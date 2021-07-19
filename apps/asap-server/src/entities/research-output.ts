import { DecisionOption, ResearchOutputResponse } from '@asap-hub/model';
import { GraphqlResearchOutput, GraphqlTeam } from '@asap-hub/squidex';
import { parseDate } from '../utils/squidex';
import { parseGraphQLUser } from './user';

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
          output.flatData?.authors
            ?.filter(
              (author) =>
                author.__typename !== 'Users' ||
                author.flatData?.onboarded !== false,
            )
            .map((author) => {
              if (author.__typename === 'Users') {
                return parseGraphQLUser(author);
              }

              return {
                displayName: author.flatData?.name,
                orcid: author.flatData?.orcid,
              };
            }) || [],
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

  const pmsEmails =
    output.referencingTeamsContents?.flatMap((team) =>
      team.referencingUsersContents
        ?.filter(
          (user) =>
            user.flatData?.teams !== undefined &&
            user.flatData?.teams?.filter(
              (innerTeam) =>
                innerTeam?.role === 'Project Manager' &&
                innerTeam?.id?.[0]?.id === team?.id,
            ).length !== 0,
        )
        .map((user) => user.flatData?.email),
    ) || [];

  const filteredPmsEmails = pmsEmails?.filter(
    (email): email is string => email !== undefined,
  ) as string[];

  const uniquePmsEmails = [...new Set(filteredPmsEmails)];

  return {
    id: output.id,
    created: parseDate(output.created).toISOString(),
    link: output.flatData?.link || undefined,
    type: output.flatData?.type || 'Proposal',
    subTypes: output.flatData?.subtype ? [output.flatData.subtype] : [],
    title: output.flatData?.title || '',
    description: output.flatData?.description || '',
    tags: output.flatData?.tags || [],
    publishDate: output.flatData?.publishDate || undefined,
    labCatalogNumber: output.flatData?.labCatalogNumber || undefined,
    addedDate: output.flatData?.addedDate || undefined,
    lastUpdatedPartial:
      output.flatData?.lastUpdatedPartial ||
      output.lastModified ||
      output.created,
    accessInstructions: output.flatData?.accessInstructions || undefined,
    ...optionalAuthors,
    ...optionalTeams,
    sharingStatus: output.flatData?.sharingStatus || 'Network Only',
    asapFunded: convertDecisionToBoolean(output.flatData?.asapFunded),
    usedInPublication: convertDecisionToBoolean(
      output.flatData?.usedInAPublication,
    ),
    pmsEmails: uniquePmsEmails,
  };
};

const parseGraphqlTeamLite = (
  graphqlTeam: GraphqlTeam,
): ResearchOutputResponse['team'] => ({
  id: graphqlTeam.id,
  displayName: graphqlTeam.flatData?.displayName || '',
});

const convertDecisionToBoolean = (
  decision?: DecisionOption | null,
): boolean | undefined =>
  decision && ['Yes', 'No'].includes(decision) ? decision === 'Yes' : undefined;
