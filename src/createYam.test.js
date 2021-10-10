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

function callYam(handlers) {
  const action = { type: 'first' };
  return createYam(handlers)(store)(next)(action);
}

it('calls every handler with the state, dispatch, action and stateChangedBy', () => {
  const handlers = [jest.fn(), jest.fn(), jest.fn()];
  const action = { type: 'first' };

  callYam(handlers);

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
