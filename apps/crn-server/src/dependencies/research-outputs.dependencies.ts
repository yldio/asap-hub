import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import {
  RestResearchOutput,
  InputResearchOutput,
  SquidexGraphql,
  SquidexRest,
  SquidexRestClient,
} from '@asap-hub/squidex';
import {
  appName,
  baseUrl,
  contentfulAccessToken,
  contentfulPreviewAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
  isContentfulEnabled,
} from '../config';
import { ResearchOutputContentfulDataProvider } from '../data-providers/contentful/research-output.data-provider';
import { ResearchOutputDataProvider } from '../data-providers/types';
import { ResearchOutputSquidexDataProvider } from '../data-providers/research-output.data-provider';
import { getAuthToken } from '../utils/auth';
import { getContentfulRestClientFactory } from './clients.dependencies';

let restClient:
  | SquidexRestClient<RestResearchOutput, InputResearchOutput>
  | undefined;

const getRestClient = (): SquidexRestClient<
  RestResearchOutput,
  InputResearchOutput
> => {
  if (restClient) {
    return restClient;
  }
  restClient = new SquidexRest<RestResearchOutput, InputResearchOutput>(
    getAuthToken,
    'researchOutputs',
    {
      appName,
      baseUrl,
    },
  );
  return restClient;
};

export const getResearchOutputDataProvider = (): ResearchOutputDataProvider => {
  if (isContentfulEnabled) {
    const contentfulGraphQLPreviewClient = getContentfulGraphQLClient({
      space: contentfulSpaceId,
      accessToken: contentfulPreviewAccessToken,
      environment: contentfulEnvId,
    });
    const contentfulGraphQLClient = getContentfulGraphQLClient({
      space: contentfulSpaceId,
      accessToken: contentfulAccessToken,
      environment: contentfulEnvId,
    });

    return new ResearchOutputContentfulDataProvider(
      contentfulGraphQLClient,
      contentfulGraphQLPreviewClient,
      getContentfulRestClientFactory,
    );
  }

  const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
    appName,
    baseUrl,
  });

  return new ResearchOutputSquidexDataProvider(
    squidexGraphqlClient,
    getRestClient(),
  );
};
