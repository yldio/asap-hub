import algoliasearch, { SearchClient } from 'algoliasearch';
import { AlgoliaSearchClient, Apps } from './client';
import * as gp2 from './gp2';

export type { SearchResponse } from '@algolia/client-search';
export * from './client';
export * from './crn/types';
export * from './filters';
export { gp2 };

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
    userToken?: ConstructorParameters<typeof AlgoliaSearchClient>['2'];
    clickAnalytics?: ConstructorParameters<typeof AlgoliaSearchClient>['3'];
  };

export const algoliaSearchClientFactory = <App extends Apps>({
  algoliaIndex,
  algoliaApiKey,
  algoliaAppId,
  userToken,
  clickAnalytics,
}: AlgoliaSearchClientFactoryParams): AlgoliaSearchClient<App> => {
  const algoliaSearchClient = algoliasearch(algoliaAppId, algoliaApiKey);

  const index = algoliaSearchClient.initIndex(algoliaIndex);
  const reverseIndex = algoliaSearchClient.initIndex(
    `${algoliaIndex}-reverse-timestamp`,
  );

  return new AlgoliaSearchClient(
    index,
    reverseIndex,
    userToken,
    clickAnalytics,
  );
};
