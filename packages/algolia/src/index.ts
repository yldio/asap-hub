import algoliasearch, { SearchClient } from 'algoliasearch';
import { AlgoliaSearchClient } from './client';

export type { SearchResponse } from '@algolia/client-search';
export * from './client';
export * from './filters';
export * from './scripts/move-index';
export * from './scripts/remove-index';
export * from './scripts/remove-records';
type AlgoliaSearchClientNativeFactoryParams = {
  algoliaApiKey: string;
  algoliaAppId: string;
};

export const algoliaSearchClientNativeFactory = ({
  algoliaApiKey,
  algoliaAppId,
}: AlgoliaSearchClientNativeFactoryParams): SearchClient =>
  algoliasearch(algoliaAppId, algoliaApiKey);

type AlgoliaSearchClientFactoryParams =
  AlgoliaSearchClientNativeFactoryParams & {
    algoliaIndex: string;
  };

export const algoliaSearchClientFactory = ({
  algoliaIndex,
  algoliaApiKey,
  algoliaAppId,
}: AlgoliaSearchClientFactoryParams): AlgoliaSearchClient => {
  const algoliaSearchClient = algoliasearch(algoliaAppId, algoliaApiKey);

  const index = algoliaSearchClient.initIndex(algoliaIndex);

  return new AlgoliaSearchClient(index);
};
