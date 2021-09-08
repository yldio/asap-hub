import {
  ResearchOutputResponse,
  ResearchOutputSharingStatus,
  ResearchOutputSubtype,
  researchOutputSubtypes,
  ResearchOutputType,
  researchOutputTypes,
  sharingStatuses,
} from '@asap-hub/model';
import { GraphqlUser } from '@asap-hub/squidex';
import {
  FetchResearchOutput_findResearchOutputsContent,
  FetchResearchOutput_findResearchOutputsContent_referencingTeamsContents,
} from '../queries/__generated__/FetchResearchOutput';
import { parseDate } from '../utils/squidex';
import { parseGraphQLUser } from './user';

export const parseGraphQLResearchOutput = (
  output: FetchResearchOutput_findResearchOutputsContent,
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
          output.flatData.authors
            ?.filter(
              (author) =>
                author.__typename !== 'Users' ||
                author.flatData?.onboarded !== false,
            )
            .map((author) => {
              if (author.__typename === 'Users') {
                // TODO: REMOVE casting once other GraphqlTypes are generated
                return parseGraphQLUser(author as GraphqlUser);
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

  const data = output.flatData;

  return {
    id: output.id,
    created: parseDate(output.created).toISOString(),
    link: data.link || undefined,
    type: data.type && isResearchOutputType(data.type) ? data.type : 'Proposal',
    subTypes:
      data.subtype && isResearchOutputSubtype(data.subtype)
        ? [data.subtype]
        : [],
    title: data.title || '',
    description: data.description || '',
    tags: data.tags || [],
    publishDate: data.publishDate || undefined,
    labCatalogNumber: data.labCatalogNumber || undefined,
    doi: data.doi || undefined,
    accession: data.accession || undefined,
    rrid: data.rrid || undefined,
    addedDate: data.addedDate || undefined,
    lastUpdatedPartial:
      data.lastUpdatedPartial || output.lastModified || output.created,
    accessInstructions: data.accessInstructions || undefined,
    ...optionalAuthors,
    ...optionalTeams,
    sharingStatus:
      data.sharingStatus !== null && isSharingStatus(data.sharingStatus)
        ? data.sharingStatus
        : 'Network Only',
    asapFunded: convertDecisionToBoolean(data.asapFunded),
    usedInPublication: convertDecisionToBoolean(data.usedInAPublication),
    pmsEmails: uniquePmsEmails,
  };
};

const parseGraphqlTeamLite = (
  graphqlTeam: FetchResearchOutput_findResearchOutputsContent_referencingTeamsContents,
): ResearchOutputResponse['team'] => ({
  id: graphqlTeam.id,
  displayName: graphqlTeam.flatData?.displayName || '',
});

const convertDecisionToBoolean = (
  decision: string | null,
): boolean | undefined =>
  decision && ['Yes', 'No'].includes(decision) ? decision === 'Yes' : undefined;

const isSharingStatus = (
  status: string,
): status is ResearchOutputSharingStatus =>
  (sharingStatuses as ReadonlyArray<string>).includes(status);

const isResearchOutputType = (type: string): type is ResearchOutputType =>
  (researchOutputTypes as ReadonlyArray<string>).includes(type);

const isResearchOutputSubtype = (
  subtype: string,
): subtype is ResearchOutputSubtype =>
  (researchOutputSubtypes as ReadonlyArray<string>).includes(subtype);
