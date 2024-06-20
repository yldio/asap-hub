import algoliasearch, { SearchClient } from 'algoliasearch';
import { AlgoliaSearchClient, Apps } from './client';
import * as gp2 from './gp2';
import { NoTokenAlgoliaClient } from './no-token-client';

export type { SearchResponse } from '@algolia/client-search';
export * from './client';
export * from './crn/types';
export * from './analytics/types';
export * from './filters';
export {
  EMPTY_ALGOLIA_RESPONSE,
  EMPTY_ALGOLIA_FACET_HITS,
} from './no-token-client';
export { gp2 };

export type AlgoliaClient<App extends Apps> =
  | AlgoliaSearchClient<App>
  | NoTokenAlgoliaClient<App>;

type AlgoliaSearchClientNativeFactoryParams = {
  algoliaApiKey: string | null;
  algoliaAppId: string;
};

export const algoliaSearchClientNativeFactory = ({
  algoliaApiKey,
  algoliaAppId,
}: AlgoliaSearchClientNativeFactoryParams): SearchClient => {
  if (algoliaApiKey === null) {
    throw new Error('Algolia API key is not set');
  }
  return algoliasearch(algoliaAppId, algoliaApiKey);
};

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
}: AlgoliaSearchClientFactoryParams): AlgoliaClient<App> => {
  if (algoliaApiKey === null) {
    return new NoTokenAlgoliaClient('index', 'reverseIndex');
  }

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
