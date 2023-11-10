import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../config';
import { TeamContentfulDataProvider } from '../data-providers/contentful/team.data-provider';
import { TeamDataProvider } from '../data-providers/types/teams.data-provider.types';
import { getContentfulRestClientFactory } from './clients.dependencies';

export const getTeamDataProvider = (): TeamDataProvider => {
  const contentfulGraphQLClient = getContentfulGraphQLClient({
    space: contentfulSpaceId,
    accessToken: contentfulAccessToken,
    environment: contentfulEnvId,
  });

  return new TeamContentfulDataProvider(
    contentfulGraphQLClient,
    getContentfulRestClientFactory,
  );
};
