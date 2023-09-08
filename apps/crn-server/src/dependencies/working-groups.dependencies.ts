import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../config';
import { WorkingGroupContentfulDataProvider } from '../data-providers/contentful/working-group.data-provider';
import { WorkingGroupDataProvider } from '../data-providers/types';
import { getContentfulRestClientFactory } from './clients.dependencies';

export const getWorkingGroupDataProvider = (): WorkingGroupDataProvider => {
  const contentfulGraphQLClient = getContentfulGraphQLClient({
    space: contentfulSpaceId,
    accessToken: contentfulAccessToken,
    environment: contentfulEnvId,
  });

  return new WorkingGroupContentfulDataProvider(
    contentfulGraphQLClient,
    getContentfulRestClientFactory,
  );
};
