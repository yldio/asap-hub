import {
  getGraphQLClient as getContentfulGraphQLClient,
  getRestClient as getContentfulRestClient,
} from '@asap-hub/contentful';
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
  contentfulManagementAccessToken,
  contentfulSpaceId,
  isContentfulEnabledV2,
} from '../config';
import { ExternalAuthorContentfulDataProvider } from '../data-providers/contentful/external-authors.data-provider';
import {
  ExternalAuthorDataProvider,
  ExternalAuthorSquidexDataProvider,
} from '../data-providers/external-authors.data-provider';
import { getAuthToken } from '../utils/auth';

export const getExternalAuthorDataProvider = (): ExternalAuthorDataProvider => {
  if (isContentfulEnabledV2) {
    const contentfulGraphQLClient = getContentfulGraphQLClient({
      space: contentfulSpaceId,
      accessToken: contentfulAccessToken,
      environment: contentfulEnvId,
    });

    const getContentfulRestClientFactory = () =>
      getContentfulRestClient({
        space: contentfulSpaceId,
        accessToken: contentfulManagementAccessToken,
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
