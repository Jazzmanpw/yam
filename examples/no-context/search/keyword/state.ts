import { createReducer } from '@reduxjs/toolkit';
import { deserializeSearch } from '../../utils';
import { keywordChanged, keywordReset } from './actions';

export default createReducer(
  deserializeSearch(window.location.search).keyword,
  (builder) =>
    builder
      .addCase(keywordChanged, (_, { payload }) => payload)
      .addCase(keywordReset, () => ''),
);
