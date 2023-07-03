import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import {
  RestExternalAuthor,
  SquidexGraphql,
  SquidexRest,
} from '@asap-hub/squidex';
import {
  appName,
  baseUrl,
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
  isContentfulEnabledV2,
} from '../config';
import { ExternalAuthorContentfulDataProvider } from '../data-providers/contentful/external-authors.data-provider';
import {
  ExternalAuthorDataProvider,
  ExternalAuthorSquidexDataProvider,
} from '../data-providers/external-author.data-provider';
import { getAuthToken } from '../utils/auth';
import { getContentfulRestClientFactory } from './clients.dependencies';

export const getExternalAuthorDataProvider = (): ExternalAuthorDataProvider => {
  if (isContentfulEnabledV2) {
    const contentfulGraphQLClient = getContentfulGraphQLClient({
      space: contentfulSpaceId,
      accessToken: contentfulAccessToken,
      environment: contentfulEnvId,
    });

    return new ExternalAuthorContentfulDataProvider(
      contentfulGraphQLClient,
      getContentfulRestClientFactory,
    );
  }

  const externalAuthorRestClient = new SquidexRest<RestExternalAuthor>(
    getAuthToken,
    'external-authors',
    {
      appName,
      baseUrl,
    },
  );
  const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
    appName,
    baseUrl,
  });

  return new ExternalAuthorSquidexDataProvider(
    externalAuthorRestClient,
    squidexGraphqlClient,
  );
};
