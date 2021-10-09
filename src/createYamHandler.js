export default function createYamHandler(handlerMap) {
  return (arg) => handlerMap[arg.action.type]?.(arg);
}
