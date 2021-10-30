import type { AnyAction } from 'redux';
import type { Handler, HandlerArg } from './types';

type HandlerMapBuilderCallback<
  State,
  Context extends Record<string, unknown> | undefined,
> = <ActionCreator extends (...args: any[]) => AnyAction>(
  actionCreator: ActionCreator & { type: ReturnType<ActionCreator>['type'] },
  handler: Handler<State, Context, ReturnType<ActionCreator>>,
) => [ReturnType<ActionCreator>['type'], Handler<State, Context>];

type HandlerMapBuilder<
  State,
  Context extends Record<string, unknown> | undefined,
> = (
  handle: HandlerMapBuilderCallback<State, Context>,
) => [string, Handler<State, Context>][];

export default function createYamHandler<
  State,
  Context extends Record<string, unknown> | undefined = undefined,
>(
  handlerMap:
    | Record<string, Handler<State, Context>>
    | HandlerMapBuilder<State, Context>,
) {
  const map =
    typeof handlerMap === 'function'
      ? createHandlerMap(handlerMap)
      : handlerMap;
  return (arg: HandlerArg<State, Context>) => map[arg.action.type]?.(arg);
}

function createHandlerMap<
  State,
  Context extends Record<string, unknown> | undefined,
>(handlerBuilder: HandlerMapBuilder<State, Context>) {
  const handle: HandlerMapBuilderCallback<State, Context> = (
    actionCreator,
    handler,
  ) => [actionCreator.type, handler as Handler<State, Context>];
  return Object.fromEntries(handlerBuilder(handle)) as Record<
    string,
    Handler<State, Context>
  >;
}
