import type { AnyAction } from 'redux';
import type { Handler } from './types';

export const handlerRequiredType = Symbol('handlerRequired');
export const handlerRejectedType = Symbol('handlerRejected');

export function handlerRequired(handler: Handler<any, any>) {
  return {
    type: handlerRequiredType,
    payload: handler,
  };
}
export function isHandlerRequiredAction(
  action: AnyAction,
): action is ReturnType<typeof handlerRequired> {
  return action.type === handlerRequiredType;
}

export function handlerRejected(handler: Handler<any, any>) {
  return {
    type: handlerRejectedType,
    payload: handler,
  };
}
export function isHandlerRejectedAction(
  action: AnyAction,
): action is ReturnType<typeof handlerRejected> {
  return action.type === handlerRejectedType;
}
