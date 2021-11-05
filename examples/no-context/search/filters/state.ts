import { createReducer } from '@reduxjs/toolkit';
import { deserializeSearch } from '../../utils';
import {
  fieldReset,
  Filter,
  filtersReset,
  rangedFilterToggled,
  simpleFilterToggled,
} from './actions';
import { filterEqualsTo, isCustomRange } from './utils';

const initialState = deserializeSearch(window.location.search)
  .filters as Filter[];

export default createReducer(initialState, (builder) =>
  builder
    .addCase(simpleFilterToggled, (state, { payload }) =>
      toggleFilter(state, payload),
    )
    .addCase(rangedFilterToggled, (state, { payload }) =>
      payload.isCustomRange && state.some(isCustomRange)
        ? state.map((filter) => (isCustomRange(filter) ? payload : filter))
        : toggleFilter(state, payload),
    )
    .addCase(fieldReset, (state, { payload }) =>
      state.some((filter) => filter.field === payload)
        ? state.filter((filter) => filter.field !== payload)
        : state,
    )
    .addCase(filtersReset, () => initialState),
);

function toggleFilter(state: Filter[], filter: Filter) {
  return state.some(filterEqualsTo(filter))
    ? state.filter((f) => !filterEqualsTo(f))
    : [...state, filter];
}
