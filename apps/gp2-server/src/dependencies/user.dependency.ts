import { getGraphQLClient } from '@asap-hub/contentful';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../config';
import { AssetContentfulDataProvider } from '../data-providers/asset.data-provider';
import { AssetDataProvider, UserDataProvider } from '../data-providers/types';
import { UserContentfulDataProvider } from '../data-providers/user.data-provider';
import { getContentfulRestClientFactory } from './clients.dependency';

export const getUserDataProvider = (): UserDataProvider => {
  const contentfulGraphQLClient = getGraphQLClient({
    space: contentfulSpaceId,
    accessToken: contentfulAccessToken,
    environment: contentfulEnvId,
  });

  return new UserContentfulDataProvider(
    contentfulGraphQLClient,
    getContentfulRestClientFactory,
  );
};

export const getAssetDataProvider = (): AssetDataProvider =>
  new AssetContentfulDataProvider(getContentfulRestClientFactory);
