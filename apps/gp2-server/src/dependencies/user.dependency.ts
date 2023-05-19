import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import { gp2, SquidexGraphql, SquidexRest } from '@asap-hub/squidex';
import {
  appName,
  baseUrl,
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
  isContentfulEnabled,
} from '../config';
import { UserContentfulDataProvider } from '../data-providers/contentful/user.data-provider';
import { UserDataProvider } from '../data-providers/types';
import { UserSquidexDataProvider } from '../data-providers/user.data-provider';
import { getAuthToken } from '../utils/auth';
import { getContentfulRestClientFactory } from './clients.dependency';

export const getUserDataProvider = (): UserDataProvider => {
  if (isContentfulEnabled) {
    const contentfulGraphQLClient = getContentfulGraphQLClient({
      space: contentfulSpaceId,
      accessToken: contentfulAccessToken,
      environment: contentfulEnvId,
    });

    return new UserContentfulDataProvider(
      contentfulGraphQLClient,
      getContentfulRestClientFactory,
    );
  }

  const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
    appName,
    baseUrl,
  });

  const restClient = new SquidexRest<gp2.RestUser, gp2.InputUser>(
    getAuthToken,
    'users',
    {
      appName,
      baseUrl,
    },
  );
  return new UserSquidexDataProvider(squidexGraphqlClient, restClient);
};
