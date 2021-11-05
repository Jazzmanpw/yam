import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { createYam } from '../../src';
import handleAuthPersistence from './auth/handleAuthPersistence';
import handleRequestPersistence from './search/handleRequestPersistence';
import handleSearch from './search/handleSearch';
import results from './results/state';
import search from './search/state';

const rootReducer = combineReducers({ search, results });

export default configureStore({
  reducer: rootReducer,
  middleware: [
    createYam([handleRequestPersistence, handleSearch, handleAuthPersistence]),
  ],
});

export type State = ReturnType<typeof rootReducer>;
