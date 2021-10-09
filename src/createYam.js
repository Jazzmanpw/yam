export default function createYam(handlers) {
  return (store) => (next) => (action) => {
    next(action);
    const state = store.getState();
    handlers.forEach((handler) =>
      handler({ state, action, dispatch: store.dispatch }),
    );
  };
}
