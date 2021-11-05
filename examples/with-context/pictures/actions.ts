import { createAction } from '@reduxjs/toolkit';

type PictureResults = { id: number }[];

export const keywordChanged = createAction<string>('keyword/changed');
export const resultsReceived = createAction<PictureResults>('results/received');
