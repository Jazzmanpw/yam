import type { AnyAction } from 'redux';

export type HandlerArg<
  State = any,
  Context extends Record<string, unknown> | undefined = undefined,
  Action extends AnyAction = AnyAction,
> = {
  state: State;
  action: Action;
  stateChangedBy: <Result>(selector: (state: State) => Result) => boolean;
  context: Context;
};

export type Handler<
  State = any,
  Context extends Record<string, unknown> | undefined = undefined,
  Action extends AnyAction = AnyAction,
> = (
  arg: HandlerArg<State, Context, Action>,
) => void | Promise<void | AnyAction>;
