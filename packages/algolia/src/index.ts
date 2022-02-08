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

type AlgoliaSearchClientFactoryParams = {
  algoliaIndex?: string;
  algoliaApiKey?: string;
};

export const algoliaSearchClientFactory = ({
  algoliaIndex,
  algoliaApiKey,
}: AlgoliaSearchClientFactoryParams | undefined = {}): AlgoliaSearchClient => {
  const algoliaSearchClient = algoliasearch(
    config.algoliaAppId,
    algoliaApiKey || config.algoliaApiKey,
  );

  const index = algoliaSearchClient.initIndex(
    algoliaIndex || config.algoliaIndex,
  );

  return new AlgoliaSearchClient(index);
};
