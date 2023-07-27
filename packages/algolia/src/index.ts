import algoliasearch, { SearchClient } from 'algoliasearch';
import { AlgoliaSearchClient } from './client';
import { EntityResponses, Payload } from './crn/types';
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

export const algoliaSearchClientFactory = <
  Responses extends EntityResponses | gp2.EntityResponses = EntityResponses,
  SavePayload extends Payload | gp2.Payload = Payload,
>({
  algoliaIndex,
  algoliaApiKey,
  algoliaAppId,
  userToken,
  clickAnalytics,
}: AlgoliaSearchClientFactoryParams): AlgoliaSearchClient<
  Responses,
  SavePayload
> => {
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
