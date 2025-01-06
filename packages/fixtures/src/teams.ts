import {
  TeamMember,
  TeamTool,
  TeamResponse,
  TeamListItemResponse,
  ListTeamResponse,
  TeamManuscript,
} from '@asap-hub/model';
import { createLabs } from './labs';
import { createManuscriptResponse } from './manuscripts';

export const teamMember: Omit<TeamResponse['members'][number], 'id'> = {
  firstName: 'Mason',
  lastName: 'Carpenter',
  email: 'mason@car.com',
  displayName: 'Birdie Romeo',
  role: 'Lead PI (Core Leadership)',
};

const teamTool = (id: number): TeamTool => ({
  description: 'Description of the tool',
  name: `Tool Name ${id}`,
  url: `/tool-${id}`,
});

const listTeamResponseItem: Omit<TeamResponse, 'id'> = {
  displayName: 'Abu-Remaileh, M',
  teamId: 'AR1',
  grantId: '000123',
  projectTitle:
    'Mapping the LRRK2 signalling pathway and its interplay with other Parkinson’s disease components',
  tags: [],
  members: [],
  manuscripts: [],
  lastModifiedDate: '2020-09-07T17:36:54Z',
  labCount: 0,
};

type FixtureOptions = {
  teamMembers?: number;
  tools?: number;
};

export const createTeamResponseMembers = ({
  teamMembers = 0,
  hasLabs = false,
}: {
  teamMembers?: number;
  hasLabs?: boolean;
}): TeamMember[] =>
  Array.from({ length: teamMembers }, (__, memberIndex) => ({
    ...teamMember,
    id: `tm${memberIndex}`,
    labs: createLabs({ labs: hasLabs ? 1 : 0 }),
  }));

export const createTeamResponse = (
  { tools, teamMembers }: FixtureOptions = {},
  itemIndex = 0,
): TeamResponse => ({
  ...listTeamResponseItem,
  id: `t${itemIndex}`,
  displayName: `${listTeamResponseItem.displayName} ${itemIndex + 1}`,
  members: createTeamResponseMembers({ teamMembers }),
  ...(tools
    ? {
        tools: Array.from({ length: tools }, (___, toolIndex) =>
          teamTool(toolIndex),
        ),
      }
    : {}),
});

export const createTeamListItemResponse = (
  itemIndex = 0,
): TeamListItemResponse => ({
  ...listTeamResponseItem,
  id: `t${itemIndex}`,
  displayName: `${listTeamResponseItem.displayName} ${itemIndex + 1}`,
  memberCount: 2,
});

export const createListTeamResponse = (items: number): ListTeamResponse => ({
  total: items,
  items: Array.from({ length: items }, (_, itemIndex) =>
    createTeamListItemResponse(itemIndex),
  ),
});

export const createTeamManuscriptResponse = (
  grantId: string = '000282',
): TeamManuscript => ({
  ...createManuscriptResponse(),
  grantId,
});
