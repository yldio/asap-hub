import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../config';
import { NewsContentfulDataProvider } from '../data-providers/contentful/news.data-provider';
import { NewsDataProvider } from '../data-providers/types';

export const getNewsDataProvider = (): NewsDataProvider => {
  const contentfulGraphQLClient = getContentfulGraphQLClient({
    space: contentfulSpaceId,
    accessToken: contentfulAccessToken,
    environment: contentfulEnvId,
  });

  return new NewsContentfulDataProvider(contentfulGraphQLClient);
};
