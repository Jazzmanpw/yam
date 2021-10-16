export default function createYam(handlers, options) {
  return (store) => (next) => (action) => {
    const prevState = store.getState();
    next(action);
    const state = store.getState();

    const stateChangedBy = createStateChangedBy(prevState, state);

    handlers.forEach(async (handler) => {
      const nextAction = await handler({
        state,
        action,
        dispatch: options?.passDispatch ? store.dispatch : undefined,
        stateChangedBy,
      });
      if (nextAction) {
        store.dispatch(nextAction);
      }
    });
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
