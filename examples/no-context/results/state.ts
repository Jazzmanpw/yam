import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import {
  fieldReset,
  filtersReset,
  rangedFilterToggled,
  simpleFilterToggled,
} from '../search/filters/actions';
import { resultReceived, sameResultRequested } from './actions';
import type { SearchResult } from './actions';
import { actionIsOneOf } from './utils';

const loading = createReducer(false, (builder) =>
  builder
    .addMatcher(
      actionIsOneOf([
        simpleFilterToggled,
        rangedFilterToggled,
        fieldReset,
        filtersReset,
      ]),
      () => true,
    )
    .addMatcher(
      actionIsOneOf([resultReceived, sameResultRequested]),
      () => false,
    ),
);

const result = createReducer(null as SearchResult | null, (builder) =>
  builder.addCase(resultReceived, (_, { payload }) => payload),
);

export default combineReducers({ result, loading });
