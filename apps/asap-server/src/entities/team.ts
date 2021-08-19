import Joi from '@hapi/joi';
import {
  ResearchOutputResponse,
  TeamResponse,
  TeamRole,
  TeamMember,
  Lab,
} from '@asap-hub/model';
import {
  GraphqlTeam,
  GraphqlResearchOutput,
  GraphqlUser,
} from '@asap-hub/squidex';

import { parseGraphQLResearchOutput } from './research-output';
import { parseDate, createURL } from '../utils/squidex';

export const teamUpdateSchema = Joi.object({
  tools: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().allow(''),
      }),
    )
    .required(),
})
  .min(1)
  .required();

const priorities: Record<TeamRole, number> = {
  'Lead PI (Core Leadership)': 1,
  'Project Manager': 2,
  'Co-PI (Core Leadership)': 3,
  'Collaborating PI': 4,
  'Key Personnel': 5,
};

export const parseGraphQLTeamMember = (
  user: GraphqlUser,
  teamId: string,
): TeamMember => {
  const flatAvatar: NonNullable<GraphqlUser['flatData']>['avatar'] =
    user.flatData?.avatar || [];

  const labs =
    user.flatData?.labs?.reduce((acc: Lab[], lab) => {
      const labsData = lab.flatData?.name
        ? [...acc, { id: lab.id, name: lab.flatData.name }]
        : acc;
      return labsData;
    }, []) ?? [];

  const role = user.flatData?.teams
    ?.filter((t) => t.id[0].id === teamId)
    .filter((s) => s.role)[0].role as TeamRole;
  return {
    id: user.id,
    firstName: user.flatData?.firstName || undefined,
    lastName: user.flatData?.lastName || undefined,
    displayName: `${user.flatData?.firstName} ${user.flatData?.lastName}`,
    email: user.flatData?.email || '',
    role,
    labs,
    avatarUrl: flatAvatar?.length
      ? createURL(flatAvatar.map((a) => a.id))[0]
      : undefined,
  };
};

export const parseGraphQLTeam = (team: GraphqlTeam): TeamResponse => {
  const flatOutputs: NonNullable<GraphqlTeam['flatData']>['outputs'] =
    team.flatData?.outputs || [];
  const displayName = team.flatData?.displayName || '';

  const members =
    team.referencingUsersContents?.map((user) =>
      parseGraphQLTeamMember(user, team.id),
    ) || [];

  const tools =
    team?.flatData?.tools?.map(({ name, description, url }) => ({
      name,
      url,
      description: description ?? undefined,
    })) || [];

  const outputs: ResearchOutputResponse[] = flatOutputs
    .map((o) => {
      const output = parseGraphQLResearchOutput(o as GraphqlResearchOutput, {
        includeAuthors: true,
      }) as Omit<ResearchOutputResponse, 'teams' | 'team'>;

      return {
        ...output,
        team: { id: team.id, displayName },
        teams: (o as GraphqlResearchOutput).referencingTeamsContents?.map(
          (t) => ({
            displayName: t.flatData?.displayName || '',
            id: t.id,
          }),
        ) || [{ id: team.id, displayName }],
      };
    })
    .sort(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime(),
    );

  return {
    id: team.id,
    displayName,
    lastModifiedDate: parseDate(team.lastModified).toISOString(),
    skills: team.flatData?.skills || [],
    outputs,
    tools,
    pointOfContact: members.find(({ role }) => role === 'Project Manager'),
    members: members.sort((a, b) => priorities[a.role] - priorities[b.role]),
    projectTitle: team.flatData?.projectTitle || '',
    projectSummary: team.flatData?.projectSummary || undefined,
    proposalURL: team.flatData?.proposal
      ? team.flatData?.proposal[0]?.id
      : undefined,
  };
};
