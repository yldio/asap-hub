import Joi from '@hapi/joi';
import {
  ResearchOutputResponse,
  TeamResponse,
  TeamRole,
  TeamMember,
} from '@asap-hub/model';
import { GraphqlTeam, GraphqlResearchOutput } from '@asap-hub/squidex';

import { parseGraphQLResearchOutput } from './research-output';
import { parseDate } from '../utils/squidex';

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

export const parseGraphQLTeam = (
  team: GraphqlTeam,
  members: TeamMember[] = [],
): TeamResponse => {
  const flatOutputs: NonNullable<GraphqlTeam['flatData']>['outputs'] =
    team.flatData?.outputs || [];
  const displayName = team.flatData?.displayName || '';

  const outputs: ResearchOutputResponse[] = flatOutputs
    .map((o) => {
      const output = parseGraphQLResearchOutput(o as GraphqlResearchOutput);
      return { ...output, team: { id: team.id, displayName } };
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
    pointOfContact: members.find(({ role }) => role === 'Project Manager'),
    members: members.sort((a, b) => priorities[a.role] - priorities[b.role]),
    projectTitle: team.flatData?.projectTitle || '',
    projectSummary: team.flatData?.projectSummary || undefined,
    proposalURL: team.flatData?.proposal
      ? team.flatData?.proposal[0]?.id
      : undefined,
  };
};
