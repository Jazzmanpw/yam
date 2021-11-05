import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import {
  logInFailed,
  logInStarted,
  logInSucceeded,
  logoutInitiated,
} from './actions';

enum Status {
  idle,
  pending,
  loaded,
  error,
}

const status = createReducer(Status.idle, (builder) =>
  builder
    .addCase(logInStarted, () => Status.pending)
    .addCase(logInSucceeded, () => Status.loaded)
    .addCase(logInFailed, () => Status.error),
);
const data = createReducer(!!window.localStorage.getItem('token'), (builder) =>
  builder
    .addCase(logInSucceeded, () => true)
    .addCase(logoutInitiated, () => false),
);
const error = createReducer(null as string | null, (builder) =>
  builder
    .addCase(logInFailed, (_, { payload }) => payload)
    .addCase(logInStarted, () => null),
);

export default combineReducers({ status, data, error });
