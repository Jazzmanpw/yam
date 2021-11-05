import { AnyAction } from 'redux';

export function actionIsOneOf(actions: AnyAction[]) {
  return (action: AnyAction) =>
    actions.some(({ type }) => action.type === type);
}
