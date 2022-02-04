import algoliasearch from 'algoliasearch';
import { AlgoliaSearchClient } from './client';
import * as config from './config';

export type { SearchResponse } from '@algolia/client-search';
export type {
  AlgoliaSearchClient,
  EntityRecord,
  EntityResponses,
} from './client';
export * from './scripts/move-index';
export * from './scripts/remove-index';
export * from './scripts/remove-records';

export const algoliaSearchClientNative = algoliasearch(
  config.algoliaAppId,
  config.algoliaApiKey,
);

export const algoliaSearchClientFactory = (
  algoliaIndex: string,
  algoliaApiKey?: string,
): AlgoliaSearchClient => {
  const algoliaSearchClient = algoliasearch(
    config.algoliaAppId,
    algoliaApiKey || config.algoliaApiKey,
  );

const index = algoliaSearchClient.initIndex(algoliaIndex);

  return new AlgoliaSearchClient(index);
};
