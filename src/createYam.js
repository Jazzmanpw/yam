export default function createYam(handlers) {
  return (store) => (next) => (action) => {
    const prevState = store.getState();
    next(action);
    const state = store.getState();

    const stateChangedBy = createStateChangedBy(prevState, state);

    handlers.forEach((handler) =>
      handler({
        state,
        action,
        dispatch: store.dispatch,
        stateChangedBy,
      }),
    );
  };
}

function createStateChangedBy(prevState, nextState) {
  const cache = new Map();
  return (selector) => {
    if (!cache.has(selector)) {
      cache.set(selector, selector(prevState) !== selector(nextState));
    }
    return cache.get(selector);
  };
}
