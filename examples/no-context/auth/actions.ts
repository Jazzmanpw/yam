import { createAction } from '@reduxjs/toolkit';

export const logInStarted =
  createAction<{ username: string; password: string }>('auth/logInStarted');
export const logInSucceeded = createAction<string>('auth/logInSucceeded');
export const logInFailed = createAction<string>('auth/logInFailed');

export const logoutInitiated = createAction('auth/logoutInitiated');
