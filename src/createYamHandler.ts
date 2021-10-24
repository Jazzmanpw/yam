import type { AnyAction } from 'redux';
import type { Handler, HandlerArg } from './types';

export default function createYamHandler<
  State,
  Context extends Record<string, unknown> = never,
  Action extends AnyAction = AnyAction,
>(handlerMap: Record<string, Handler<State, Context, Action>>) {
  return (arg: HandlerArg<State, Context, Action>) =>
    handlerMap[arg.action.type]?.(arg);
}
