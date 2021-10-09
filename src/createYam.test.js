import createYam from './createYam';

const prevState = 'previous';
const nextState = 'next';

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

function createDispatch(handlers) {
  return createYam(handlers)(store)(next);
}

it('calls every handler with the state, dispatch and action', () => {
  const handlers = [jest.fn(), jest.fn(), jest.fn()];
  const action = { type: 'first' };
  const dispatch = createDispatch(handlers);

  dispatch(action);

  handlers.forEach((handler) =>
    expect(handler).toBeCalledWith({
      state: nextState,
      action,
      dispatch: store.dispatch,
    }),
  );
});

it.each([[[]], [[jest.fn()]], [[jest.fn(), jest.fn()]]])(
  'calls getState once, no matter how many handlers have been passed',
  (handlers) => {
    const dispatch = createDispatch(handlers);
    dispatch({ type: 'first' });
    expect(store.getState).toBeCalledTimes(1);
  },
);
