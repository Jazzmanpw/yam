import { createAction } from '@reduxjs/toolkit';

export type SearchResult = { items: { id: number }[] };

export const resultReceived = createAction<SearchResult>(
  'searchResult/received',
);

export const sameResultRequested = createAction('searchResult/sameRequested');
