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
import { AssetSquidexDataProvider } from '../data-providers/asset.data-provider';
import { AssetContentfulDataProvider } from '../data-providers/contentful/asset.data-provider';
import { UserContentfulDataProvider } from '../data-providers/contentful/user.data-provider';
import { AssetDataProvider, UserDataProvider } from '../data-providers/types';
import { UserSquidexDataProvider } from '../data-providers/user.data-provider';
import { getAuthToken } from '../utils/auth';
import { getContentfulRestClientFactory } from './clients.dependency';

let restClient: SquidexRest<gp2.RestUser, gp2.InputUser> | undefined;

const getRestClient = () => {
  if (restClient) {
    return restClient;
  }
  restClient = new SquidexRest<gp2.RestUser, gp2.InputUser>(
    getAuthToken,
    'users',
    {
      appName,
      baseUrl,
    },
  );

  return restClient;
};

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

  return new UserSquidexDataProvider(squidexGraphqlClient, getRestClient());
};

export const getAssetDataProvider = (): AssetDataProvider => {
  if (isContentfulEnabled) {
    return new AssetContentfulDataProvider(getContentfulRestClientFactory);
  }

  return new AssetSquidexDataProvider(getRestClient());
};
