import { GraphQLClient } from '@asap-hub/contentful';
import { AssetContentfulDataProvider } from '../data-providers/asset.data-provider';
import { AssetDataProvider, UserDataProvider } from '../data-providers/types';
import { UserContentfulDataProvider } from '../data-providers/user.data-provider';
import { getContentfulRestClientFactory } from './clients.dependency';

export const getUserDataProvider = (
  contentfulGraphQLClient: GraphQLClient,
): UserDataProvider =>
  new UserContentfulDataProvider(
    contentfulGraphQLClient,
    getContentfulRestClientFactory,
  );
export const getAssetDataProvider = (): AssetDataProvider =>
  new AssetContentfulDataProvider(getContentfulRestClientFactory);
