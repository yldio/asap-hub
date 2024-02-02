import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../config';
import { UserContentfulDataProvider } from '../data-providers/contentful/user.data-provider';
import { AssetContentfulDataProvider } from '../data-providers/contentful/asset.data-provider';
import {
  UserDataProvider,
  AssetDataProvider,
  ResearchTagDataProvider,
} from '../data-providers/types';
import { getContentfulRestClientFactory } from './clients.dependencies';
import { ResearchTagContentfulDataProvider } from '../data-providers/contentful/research-tag.data-provider';

const getGraphQLClient = () =>
  getContentfulGraphQLClient({
    space: contentfulSpaceId,
    accessToken: contentfulAccessToken,
    environment: contentfulEnvId,
  });

export const getUserDataProvider = (): UserDataProvider => {
  const contentfulGraphQLClient = getGraphQLClient();

  return new UserContentfulDataProvider(
    contentfulGraphQLClient,
    getContentfulRestClientFactory,
  );
};

export const getAssetDataProvider = (): AssetDataProvider =>
  new AssetContentfulDataProvider(getContentfulRestClientFactory);

export const getResearchTagsDataProvider = (): ResearchTagDataProvider => {
  const contentfulGraphQLClient = getGraphQLClient();

  return new ResearchTagContentfulDataProvider(
    contentfulGraphQLClient,
    getContentfulRestClientFactory,
  );
};
