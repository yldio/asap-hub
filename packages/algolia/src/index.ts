import algoliasearch from 'algoliasearch';
import { AlgoliaSearchClient } from './client';
import * as config from './config';

export type { SearchResponse } from '@algolia/client-search';
export type { AlgoliaSearchClient, EntityRecord } from './client';
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
  if (algoliaApiKey) {
    algoliaSearchClientNative.updateApiKey(algoliaApiKey);
  }

  const index = algoliaSearchClientNative.initIndex(algoliaIndex);

  return new AlgoliaSearchClient(index);
};
