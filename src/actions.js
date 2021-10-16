export const handlerRequiredType = Symbol('handlerRequired');
export const handlerRejectedType = Symbol('handlerRejected');
export function handlerRequired(handler) {
  return { type: handlerRequiredType, payload: handler };
}
export function handlerRejected(handler) {
  return { type: handlerRejectedType, payload: handler };
}
