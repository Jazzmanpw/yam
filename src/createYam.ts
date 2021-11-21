import type { AnyAction, Dispatch, MiddlewareAPI } from 'redux';
import { isHandlerRejectedAction, isHandlerRequiredAction } from './actions';
import type { Handler } from './types';

export default function createYam<
  State,
  Context extends Record<string, unknown> | undefined,
>(
  handlers: Handler<State, Context>[],
  context: Context = undefined as Context,
) {
  return (store: MiddlewareAPI<Dispatch, State>) => {
    let injectedHandlers = [] as Handler<State, Context>[];

    return (next: Dispatch) => (action: AnyAction) => {
      if (isHandlerRequiredAction(action)) {
        if (!injectedHandlers.includes(action.payload)) {
          injectedHandlers = [...injectedHandlers, action.payload];
        }
        return;
      }

      if (isHandlerRejectedAction(action)) {
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
          stateChangedBy,
          context,
        });
        if (nextAction) {
          store.dispatch(nextAction);
        }
      });
    };
  };
}

function createStateChangedBy<State>(prevState: State, nextState: State) {
  const cache = new Map<(state: State) => unknown, boolean>();
  return (selector: (state: State) => unknown) => {
    if (!cache.has(selector)) {
      cache.set(selector, selector(prevState) !== selector(nextState));
    }
    return !!cache.get(selector);
  };
}
