import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import {
  RestUser,
  InputUser,
  SquidexGraphql,
  SquidexRest,
  SquidexRestClient,
} from '@asap-hub/squidex';
import {
  appName,
  baseUrl,
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
  isContentfulEnabledV2,
} from '../config';
import { UserContentfulDataProvider } from '../data-providers/contentful/users.data-provider';
import { AssetContentfulDataProvider } from '../data-providers/contentful/assets.data-provider';
import {
  UserDataProvider,
  UserSquidexDataProvider,
} from '../data-providers/users.data-provider';
import {
  AssetDataProvider,
  AssetSquidexDataProvider,
} from '../data-providers/assets.data-provider';
import { getAuthToken } from '../utils/auth';
import { getContentfulRestClientFactory } from './clients.dependencies';

let restClient: SquidexRestClient<RestUser, InputUser> | undefined;

const getRestClient = (): SquidexRestClient<RestUser, InputUser> => {
  if (restClient) {
    return restClient;
  }
  restClient = new SquidexRest<RestUser, InputUser>(getAuthToken, 'users', {
    appName,
    baseUrl,
  });
  return restClient;
};

export const getUserDataProvider = (): UserDataProvider => {
  if (isContentfulEnabledV2) {
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
  if (isContentfulEnabledV2) {
    return new AssetContentfulDataProvider(getContentfulRestClientFactory);
  }

  return new AssetSquidexDataProvider(getRestClient());
};
