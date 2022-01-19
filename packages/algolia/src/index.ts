import { SearchResponse } from '@algolia/client-search';

export type AlgoliaSearchResponse<T> = SearchResponse<T>;

export * from './types/response';
export * from './indexes/research-output';
