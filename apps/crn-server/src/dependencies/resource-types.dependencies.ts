import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../config';
import { ResourceTypeContentfulDataProvider } from '../data-providers/contentful/resource-type.data-provider';
import { ResourceTypeDataProvider } from '../data-providers/types';

export const getResourceTypeDataProvider = (): ResourceTypeDataProvider => {
  const contentfulGraphQLClient = getContentfulGraphQLClient({
    space: contentfulSpaceId,
    accessToken: contentfulAccessToken,
    environment: contentfulEnvId,
  });

  return new ResourceTypeContentfulDataProvider(contentfulGraphQLClient);
};
