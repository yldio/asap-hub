import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../config';
import { UserContentfulDataProvider } from '../data-providers/contentful/user.data-provider';
import { AssetContentfulDataProvider } from '../data-providers/contentful/asset.data-provider';
import { UserDataProvider, AssetDataProvider } from '../data-providers/types';
import { getContentfulRestClientFactory } from './clients.dependencies';

export const getUserDataProvider = (): UserDataProvider => {
  const contentfulGraphQLClient = getContentfulGraphQLClient({
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
