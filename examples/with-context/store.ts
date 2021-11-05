import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { createYam } from '../../src';
import handleKeywordPersistence from './pictures/handleKeywordPersistence';
import handlePictureFetching from './pictures/handlePictureFetching';
import pictures from './pictures/state';
import { fetchPictures } from './utils';

const rootReducer = combineReducers({ pictures });

const yamContext = { fetchPictures };

export type YamContext = typeof yamContext;

export default configureStore({
  reducer: rootReducer,
  middleware: [
    createYam([handlePictureFetching, handleKeywordPersistence], yamContext),
  ],
});

export type State = ReturnType<typeof rootReducer>;
