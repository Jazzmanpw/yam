import { handlerRejectedType, handlerRequiredType } from './actions';

export default function createYam(handlers, options) {
  return (store) => {
    let injectedHandlers = [];

    return (next) => (action) => {
      if (action.type === handlerRequiredType) {
        if (!injectedHandlers.includes(action.payload)) {
          injectedHandlers = [...injectedHandlers, action.payload];
        }
        return;
      }

      if (action.type === handlerRejectedType) {
        injectedHandlers = injectedHandlers.filter((h) => h !== action.payload);
        return;
      }

      const prevState = store.getState();
      next(action);
      const state = store.getState();

      const stateChangedBy = createStateChangedBy(prevState, state);

      handlers.concat(injectedHandlers).forEach(async (handler) => {
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
