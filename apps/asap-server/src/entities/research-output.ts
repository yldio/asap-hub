import {
  ResearchOutputResponse,
  ResearchOutputSharingStatus,
  ResearchOutputSubtype,
  researchOutputSubtypes,
  ResearchOutputType,
  researchOutputTypes,
  sharingStatuses,
  TeamResponse,
} from '@asap-hub/model';
import { FetchResearchOutputQuery, Labs, Scalars } from '../gql/graphql';
import { parseDate } from '../utils/squidex';
import { parseGraphQLUser } from './user';

export const parseGraphQLResearchOutput = (
  output: NonNullable<FetchResearchOutputQuery['findResearchOutputsContent']>,
  options?: {
    includeAuthors?: boolean;
    includeTeams?: boolean;
  },
):
  | Omit<ResearchOutputResponse, 'authors' | 'teams'>
  | Partial<Pick<ResearchOutputResponse, 'authors' | 'teams'>> => {
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
      }
    : {};

  const contactEmails =
    output.referencingTeamsContents?.flatMap((team) =>
      team.referencingUsersContents
        ?.filter(
          (user) =>
            user.flatData.teams &&
            user.flatData.teams.filter(
              (innerTeam) =>
                innerTeam.role === 'Project Manager' &&
                innerTeam.id?.[0]?.id === team.id,
            ).length !== 0,
        )
        .map((user) => user.flatData?.email),
    ) || [];

  const filteredContactEmails = contactEmails?.filter(
    (email): email is string => email !== undefined,
  ) as string[];

  const uniqueContactEmails = [...new Set(filteredContactEmails)];

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
    contactEmails: uniqueContactEmails,
    labs:
      data.labs
        ?.filter((lab): lab is LabWithName => lab.flatData.name !== null)
        .map((lab) => ({
          id: lab.id,
          name: lab.flatData.name,
        })) || [],
  };
};

const parseGraphqlTeamLite = (
  graphqlTeam: FetchResearchOutputTeamContents,
): Pick<TeamResponse, 'id' | 'displayName'> => ({
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

type FetchResearchOutputTeamContents = NonNullable<
  NonNullable<
    FetchResearchOutputQuery['findResearchOutputsContent']
  >['referencingTeamsContents']
>[number];

type LabWithName = Pick<Labs, 'id'> & {
  flatData: {
    name: Scalars['String'];
  };
};
