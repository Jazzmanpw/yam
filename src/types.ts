import type { AnyAction } from 'redux';

export type HandlerArg<
  State,
  Context extends Record<string, unknown> | undefined = undefined,
  Action extends AnyAction = AnyAction,
> = {
  state: State;
  action: Action;
  stateChangedBy: (selector: (state: State) => unknown) => boolean;
  context: Context;
};

export type Handler<
  State,
  Context extends Record<string, unknown> | undefined = undefined,
  Action extends AnyAction = AnyAction,
> = (
  arg: HandlerArg<State, Context, Action>,
) => void | Promise<void | AnyAction>;
