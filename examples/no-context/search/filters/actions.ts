import { createAction } from '@reduxjs/toolkit';

export const simpleFilterToggled = createAction(
  'filters:simpleToggled',
  (field: string, value: string) => ({ payload: { field, value } }),
);
export type SimpleFilter = ReturnType<typeof simpleFilterToggled>['payload'];

export const rangedFilterToggled = createAction(
  'filters:rangedToggled',
  (field: string, range: [number, number], isCustomRange?: boolean) => ({
    payload: { field, range, isCustomRange },
  }),
);
export type RangedFilter = ReturnType<typeof rangedFilterToggled>['payload'];

export type Filter = SimpleFilter | RangedFilter;

export const fieldReset = createAction<string>('filters: fieldReset');

export const filtersReset = createAction('filters:reset');
