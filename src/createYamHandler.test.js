import createYamHandler from './createYamHandler';

function firstAction() {
  return { type: 'first' };
}

const dispatch = jest.fn();

it('calls the handler by the action.type', () => {
  const handlerMap = {
    first: jest.fn(),
  };
  const handler = createYamHandler(handlerMap);
  const argument = { action: firstAction(), state: {}, dispatch };

  handler(argument);

  expect(handlerMap.first).toBeCalledWith(argument);
});

it('does not call other handlers', () => {
  const handlerMap = {
    second: jest.fn(),
  };
  const handler = createYamHandler(handlerMap);
  const argument = { action: firstAction(), state: {}, dispatch };

  handler(argument);

  expect(handlerMap.second).not.toBeCalled();
});
