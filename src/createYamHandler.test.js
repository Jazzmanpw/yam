import createYamHandler from './createYamHandler';

function firstAction() {
  return { type: 'first' };
}
firstAction.type = 'first';

const stateChangedBy = jest.fn();

function createArgumentWithAction(action) {
  return { action, state: {}, stateChangedBy, context: undefined };
}

describe('argument as an object', () => {
  it('calls the handler by the action.type', () => {
    const handlerMap = { first: jest.fn() };
    const handler = createYamHandler(handlerMap);
    const argument = createArgumentWithAction(firstAction());

    handler(argument);

    expect(handlerMap.first).toBeCalledWith(argument);
  });

  it('does not call other handlers', () => {
    const handlerMap = { second: jest.fn() };
    const handler = createYamHandler(handlerMap);
    const argument = createArgumentWithAction(firstAction());

    handler(argument);

    expect(handlerMap.second).not.toBeCalled();
  });
});

describe('argument as a function', () => {
  it('matches the handler by the `type` property of an object passed as a first argument to the callback argument', () => {
    const firstHandler = jest.fn();
    const handler = createYamHandler((handle) => [
      handle(firstAction, firstHandler),
    ]);
    const argument = createArgumentWithAction(firstAction());

    handler(argument);

    expect(firstHandler).toBeCalledWith(argument);
  });

  it('does not call other handlers', () => {
    const secondAction = () => ({ type: 'second' });
    secondAction.type = 'second';
    const secondHandler = jest.fn();
    const handler = createYamHandler((handle) => [
      handle(secondAction, secondHandler),
    ]);
    const argument = createArgumentWithAction(firstAction());

    handler(argument);

    expect(secondHandler).not.toBeCalled();
  });
});
