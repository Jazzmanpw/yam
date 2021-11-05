import type { Filter } from './search/filters/actions';

type Search = {
  keyword: string;
  filters: Filter[];
};

export function fetchSearchResults(search: Search) {
  return mimicRequest({ items: [{ id: 1 }] }, 10);
}

function mimicRequest<T>(response: T, timeout: number) {
  return new Promise<T>((res) => setTimeout(() => res(response), timeout));
}

export function serializeSearch(search: Search) {
  return 'serialized search';
}

export function deserializeSearch(serializedSearch: string) {
  return {
    keyword: 'cover',
    filters: [{ field: 'color', value: 'silver' }],
  } as Search;
}
