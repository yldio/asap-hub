import { ResearchOutputResponse } from '@asap-hub/model';
import {
  GraphqlResearchOutput,
  GraphqlTeam,
  RestResearchOutput,
} from '@asap-hub/squidex';

import { parseDate } from '../utils/squidex';
import { parseGraphQLUser } from './user';

export const parseResearchOutput = (
  output: RestResearchOutput,
): Omit<ResearchOutputResponse, 'authors' | 'teams'> => ({
  id: output.id,
  created: output.created,
  link: output.data.link?.iv || undefined,
  type: output.data.type.iv,
  title: output.data.title.iv,
  description: output.data.description?.iv || '',
  publishDate: output.data.publishDate?.iv,
  addedDate: output.data.addedDate?.iv,
  tags: output.data.tags?.iv || [],
  lastUpdatedPartial:
    output.data.lastUpdatedPartial?.iv || output.lastModified || output.created,
  accessInstructions: output.data.accessInstructions?.iv,
});

export const parseGraphQLResearchOutput = (
  output: GraphqlResearchOutput,
  options?: {
    includeAuthors?: boolean;
    includeTeams?: boolean;
  },
):
  | Omit<ResearchOutputResponse, 'authors' | 'teams' | 'team'>
  | Partial<Pick<ResearchOutputResponse, 'authors' | 'teams' | 'team'>> => {
  const optionalAuthors = options?.includeAuthors
    ? {
        authors:
          output.flatData?.authors?.map((author) => parseGraphQLUser(author)) ||
          [],
      }
    : {};

  const optionalTeams = options?.includeTeams
    ? {
        teams:
          output.referencingTeamsContents?.map((team) =>
            parseGraphqlTeamLite(team),
          ) || [],
        team: output.referencingTeamsContents?.[0]
          ? parseGraphqlTeamLite(output.referencingTeamsContents[0])
          : undefined,
      }
    : {};

  return {
    id: output.id,
    created: parseDate(output.created).toISOString(),
    link: output.flatData?.link || undefined,
    type: output.flatData?.type || 'Proposal',
    title: output.flatData?.title || '',
    description: output.flatData?.description || '',
    tags: output.flatData?.tags || [],
    publishDate: output.flatData?.publishDate || undefined,
    addedDate: output.flatData?.addedDate || undefined,
    lastUpdatedPartial:
      output.flatData?.lastUpdatedPartial ||
      output.lastModified ||
      output.created,
    accessInstructions: output.flatData?.accessInstructions || undefined,
    ...optionalAuthors,
    ...optionalTeams,
  };
};

const parseGraphqlTeamLite = (
  graphqlTeam: GraphqlTeam,
): ResearchOutputResponse['team'] => {
  if (
    !graphqlTeam.flatData ||
    typeof graphqlTeam.flatData.displayName !== 'string'
  ) {
    throw Error('Invalid team display name');
  }

  return {
    id: graphqlTeam.id,
    displayName: graphqlTeam.flatData.displayName,
  };
};
