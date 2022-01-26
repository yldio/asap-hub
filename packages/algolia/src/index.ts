import algoliasearchfn, {
  SearchIndex as AlgoliaSearchIndex,
  SearchClient as AlgoliaSearchClient,
} from 'algoliasearch';
import algoliasearchLiteFn, {
  SearchClient as AlgoliaSearchClientLite,
} from 'algoliasearch/lite';

export type SearchClient = AlgoliaSearchClient;
export type SearchClientLite = AlgoliaSearchClientLite;
export type SearchIndex = AlgoliaSearchIndex;

export * from './types/response';
export * from './indexes/research-output';
export * from './scripts/move-index';
export * from './scripts/remove-index';
export * from './scripts/remove-records';

export const algoliasearch = algoliasearchfn;
export const algoliasearchLite = algoliasearchLiteFn;
