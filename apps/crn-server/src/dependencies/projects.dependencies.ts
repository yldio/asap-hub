import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../config';
import { ProjectContentfulDataProvider } from '../data-providers/contentful/project.data-provider';
import { ProjectDataProvider } from '../data-providers/types/projects.data-provider.types';

export const getProjectDataProvider = (): ProjectDataProvider => {
  const contentfulGraphQLClient = getContentfulGraphQLClient({
    space: contentfulSpaceId,
    accessToken: contentfulAccessToken,
    environment: contentfulEnvId,
  });

  return new ProjectContentfulDataProvider(contentfulGraphQLClient);
};
