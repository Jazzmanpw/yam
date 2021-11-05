import { createYamHandler } from '../../../src';
import type { State } from '../store';
import { logInSucceeded, logoutInitiated } from './actions';

export default createYamHandler<State>((handle) => [
  handle(logInSucceeded, ({ action: { payload: token } }) => {
    window.localStorage.setItem('token', token);
  }),
  handle(logoutInitiated, () => {
    window.localStorage.removeItem('token');
  }),
]);
