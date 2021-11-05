import type { Filter } from './actions';

export function filterEqualsTo(another: Filter) {
  return (filter: Filter) => {
    if (filter.field === another.field) {
      if ('value' in filter && 'value' in another) {
        return filter.value === another.value;
      }
      if ('range' in filter && 'range' in another) {
        return (
          filter.range[0] === another.range[0] &&
          filter.range[1] === another.range[1]
        );
      }
    }
    return false;
  };
}

export function isCustomRange(filter: Filter) {
  return !!('isCustomRange' in filter && filter.isCustomRange);
}
