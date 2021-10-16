import createYam from './createYam';
import { handlerRejected, handlerRequired } from './actions';

const prevState = 'previous';
const nextState = 'next';

const changingSelector = (state) => state.toUpperCase();
const notChangingSelector = (state) => typeof state === 'string';

const store = {
  getState: jest.fn(),
  dispatch: jest.fn(),
};

const next = jest.fn(() => store.getState.mockReturnValue(nextState));

beforeEach(() => {
  store.getState.mockReturnValue(prevState);
});
afterEach(() => {
  store.getState.mockReset();
  store.dispatch.mockClear();
  next.mockClear();
});

function createYamDispatch(handlers, options) {
  return createYam(handlers, options)(store)(next);
}

function callYam(handlers, options) {
  const action = { type: 'first' };
  return createYamDispatch(handlers, options)(action);
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

describe('injection', () => {
  const action = { type: 'action type' };
  it('injects a handler on `handlerRequired` action', () => {
    const injectedHandler = jest.fn();
    const dispatch = createYamDispatch([]);

    dispatch(action);
    expect(injectedHandler).not.toBeCalled();

    dispatch(handlerRequired(injectedHandler));
    dispatch(action);
    expect(injectedHandler).toBeCalled();
  });

  it('does not inject a duplicated handler', () => {
    const injectedHandler = jest.fn();
    const dispatch = createYamDispatch([]);

    dispatch(handlerRequired(injectedHandler));
    dispatch(handlerRequired(injectedHandler));
    dispatch(action);

    expect(injectedHandler).toBeCalledTimes(1);
  });

  it('injection stops the middleware chain immediately', () => {
    const initialHandler = jest.fn();
    const dispatch = createYamDispatch([initialHandler]);
    dispatch(handlerRequired(jest.fn()));

    expect(next).not.toBeCalled();
    expect(store.getState).not.toBeCalled();
    expect(initialHandler).not.toBeCalled();
  });

  it('ejects a handler on `handlerReleased` action', () => {
    const injectedHandler = jest.fn();
    const ejectedHandler = jest.fn();
    const dispatch = createYamDispatch([]);

    dispatch(handlerRequired(injectedHandler));
    dispatch(handlerRequired(ejectedHandler));
    dispatch(handlerRejected(ejectedHandler));
    dispatch(action);

    expect(injectedHandler).toBeCalled();
    expect(ejectedHandler).not.toBeCalled();
  });

  it('does not throw on ejection of a non-existent handler', () => {
    const dispatch = createYamDispatch([]);

    expect(() => {
      dispatch(handlerRejected(jest.fn()));
    }).not.toThrow();
  });

  it('does not eject initial handlers', () => {
    const initialHandler = jest.fn();
    const dispatch = createYamDispatch([initialHandler]);

    dispatch(handlerRejected(initialHandler));
    dispatch(action);

    expect(initialHandler).toBeCalled();
  });

  it('ejection stops the middleware chain immediately', () => {
    const initialHandler = jest.fn();
    const dispatch = createYamDispatch([initialHandler]);
    dispatch(handlerRejected(jest.fn()));

    expect(next).not.toBeCalled();
    expect(store.getState).not.toBeCalled();
    expect(initialHandler).not.toBeCalled();
  });
});
