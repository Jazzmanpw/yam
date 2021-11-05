export function fetchPictures(keyword: string) {
  return mimicRequest([{ id: 1 }], 10);
}

function mimicRequest<T>(response: T, timeout: number) {
  return new Promise<T>((res) => setTimeout(() => res(response), timeout));
}

export function serializeKeyword(search: string) {
  return 'serialized search';
}

export function deserializeKeyword(serializedSearch: string) {
  return 'deserialized keyword';
}
