import createYam from './createYam';

const prevState = 'previous';
const nextState = 'next';

const changingSelector = (state) => state.toUpperCase();
const notChangingSelector = (state) => typeof state === 'string';

const store = {
  getState: jest.fn(),
  dispatch: jest.fn(),
};

beforeEach(() => {
  store.getState.mockReturnValue(prevState);
});
afterEach(() => {
  store.getState.mockReset();
  store.dispatch.mockClear();
});

const next = jest.fn(() => store.getState.mockReturnValue(nextState));

function callYam(handlers, options) {
  const action = { type: 'first' };
  return createYam(handlers, options)(store)(next)(action);
}

describe('base API', () => {
  it('calls every handler with the state, action and stateChangedBy', () => {
    const handlers = [jest.fn(), jest.fn(), jest.fn()];
    const action = { type: 'first' };

    callYam(handlers);

    handlers.forEach((handler) =>
      expect(handler).toBeCalledWith({
        state: nextState,
        action,
        stateChangedBy: expect.any(Function),
      }),
    );
  });

  it('adds dispatch to the API if the second argument has `passDispatch: true`', () => {
    const handlers = [jest.fn(), jest.fn(), jest.fn()];
    const action = { type: 'first' };

    callYam(handlers, { passDispatch: true });

    handlers.forEach((handler) =>
      expect(handler).toBeCalledWith({
        state: nextState,
        action,
        dispatch: store.dispatch,
        stateChangedBy: expect.any(Function),
      }),
    );
  });

  it.each([[[]], [[jest.fn()]], [[jest.fn(), jest.fn()]]])(
    'calls getState once before the "next" call and once after, no matter how many handlers have been passed',
    (handlers) => {
      callYam(handlers);

      expect(store.getState).toBeCalledTimes(2);
      expect(store.getState.mock.results).toEqual([
        { type: 'return', value: prevState },
        { type: 'return', value: nextState },
      ]);
    },
  );
});

describe('stateChangedBy', () => {
  it('returns true if the selector result changed', () => {
    const handler = ({ stateChangedBy }) => {
      expect(stateChangedBy(changingSelector)).toBe(true);
    };
    callYam([handler]);
  });

  it('returns false if the selector result did not change', () => {
    const handler = ({ stateChangedBy }) => {
      expect(stateChangedBy(notChangingSelector)).toBe(false);
    };
    callYam([handler]);
  });

  it('calls the selector once for previous state and one for the new one, no matter how many handlers use the selector', () => {
    const selector = jest.fn();
    const handlers = [
      ({ stateChangedBy }) => stateChangedBy(selector),
      ({ stateChangedBy }) => stateChangedBy(selector),
    ];

    callYam(handlers);

    expect(selector).toBeCalledTimes(2);
    expect(selector.mock.calls).toEqual([[prevState], [nextState]]);
  });
});

describe('dispatching', () => {
  it('dispatches whatever returned from a handler', async () => {
    const action = { type: 'action type' };
    const anotherAction = { type: 'another action type' };
    const handlers = [() => action, () => anotherAction];
    callYam(handlers);

    // since yam works based on promises that are not available from the outside,
    // we have to make Jest wait just a little bit to get the dispatch called with the actions
    await null;

    expect(store.dispatch).toBeCalledWith(action);
    expect(store.dispatch).toBeCalledWith(anotherAction);
  });

  it('does not dispatch an undefined action', () => {
    callYam([() => undefined]);

    expect(store.dispatch).not.toBeCalled();
  });

  it('supports async handlers', async () => {
    const action = { type: 'action type' };
    const handler = () =>
      new Promise((res) => setTimeout(() => res(action), 200));
    callYam([handler]);

    await handler();

    expect(store.dispatch).toBeCalledWith(action);
  });

  it('dispatches the returned action even if `passDispatch: true`', async () => {
    const action = { type: 'action type' };
    callYam([() => action], { passDispatch: true });

    await null;

    expect(store.dispatch).toBeCalledWith(action);
  });
});
