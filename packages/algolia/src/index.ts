import { algoliasearch, SearchClient } from 'algoliasearch';
import { AlgoliaSearchClient, Apps } from './client';
import * as gp2 from './gp2';
import { NoTokenAlgoliaClient } from './no-token-client';

export type { SearchResponse } from 'algoliasearch';
export * from './client';
export * from './crn/types';
export * from './filters';
export {
  EMPTY_ALGOLIA_RESPONSE,
  EMPTY_ALGOLIA_FACET_HITS,
} from './no-token-client';
export * from './utils';
export { gp2 };

export * from './fixtures';

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
    userToken?: ConstructorParameters<typeof AlgoliaSearchClient>['3'];
    clickAnalytics?: ConstructorParameters<typeof AlgoliaSearchClient>['4'];
  };

export const algoliaSearchClientFactory = <App extends Apps>({
  algoliaIndex,
  algoliaApiKey,
  algoliaAppId,
  userToken,
  clickAnalytics,
}: AlgoliaSearchClientFactoryParams): AlgoliaClient<App> => {
  if (algoliaApiKey === null) {
    return new NoTokenAlgoliaClient(
      algoliaIndex,
      `${algoliaIndex}-reverse-timestamp`,
    );
  }

  const algoliaSearchClient = algoliasearch(algoliaAppId, algoliaApiKey);

  return new AlgoliaSearchClient(
    algoliaSearchClient,
    algoliaIndex,
    `${algoliaIndex}-reverse-timestamp`,
    userToken,
    clickAnalytics,
  );
};
