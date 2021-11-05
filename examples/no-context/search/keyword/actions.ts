import { createAction } from '@reduxjs/toolkit';

export const keywordChanged = createAction<string>('keyword/changed');
export const keywordReset = createAction('keyword/reset');
