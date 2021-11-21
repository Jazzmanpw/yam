import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { State } from '../store';
import { deserializeKeyword } from '../utils';
import { keywordChanged, resultsReceived } from './actions';

const keyword = createReducer(
  deserializeKeyword(window.location.search),
  (builder) => builder.addCase(keywordChanged, (_, { payload }) => payload),
);

const results = createReducer([] as { id: number }[], (builder) =>
  builder.addCase(resultsReceived, (_, { payload }) => payload),
);

export default combineReducers({ keyword, results });

export const selectPictures = (state: State) => state.pictures;
export const selectKeyword = (state: State) => selectPictures(state).keyword;
export const selectResults = (state: State) => selectPictures(state).results;
