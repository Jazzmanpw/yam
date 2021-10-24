import type { AnyAction } from 'redux';
import type { Handler } from './types';

export const handlerRequiredType = Symbol('handlerRequired');
export const handlerRejectedType = Symbol('handlerRejected');

export type HandlerInjectionAction = {
  type: symbol;
  payload: Handler<any, any>;
};

export function handlerRequired(handler: Handler<any, any>) {
  return {
    type: handlerRequiredType,
    payload: handler,
  } as HandlerInjectionAction;
}
export function isHandlerRequiredAction(
  action: AnyAction,
): action is HandlerInjectionAction {
  return action.type === handlerRequiredType;
}

export function handlerRejected(handler: Handler<any, any>) {
  return {
    type: handlerRejectedType,
    payload: handler,
  } as HandlerInjectionAction;
}
export function isHandlerRejectedAction(
  action: AnyAction,
): action is HandlerInjectionAction {
  return action.type === handlerRejectedType;
}
