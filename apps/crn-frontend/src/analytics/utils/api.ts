const DEFAULT_PAGE_NUMBER = 0;
const DEFAULT_PAGE_SIZE = 10;
export interface OpenSearchHit<T> {
  _index: string;
  _id: string;
  _score: number;
  _source: T;
}

export const generateSearchQuery = (
  page: number | null,
  size: number | null,
) => ({
  query: {
    match_all: {},
  },
  size: size || DEFAULT_PAGE_SIZE,
  from: (page || DEFAULT_PAGE_NUMBER) * (size || DEFAULT_PAGE_SIZE),
});
