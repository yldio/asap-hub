export interface OpenSearchHit<T> {
  _index: string;
  _id: string;
  _score: number;
  _source: T;
}

export const generateSearchQuery = (page: number, size: number) => ({
  query: {
    match_all: {},
  },
  size,
  from: page * size,
});
