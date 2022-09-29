import {
  ListTeamResponse,
  TeamMember,
  TeamTool,
  TeamResponse,
} from '@asap-hub/model';

const teamMember: Omit<ListTeamResponse['items'][0]['members'][0], 'id'> = {
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

const listTeamResponseItem: Omit<ListTeamResponse['items'][0], 'id'> = {
  displayName: 'Abu-Remaileh, M',
  active: true,
  projectTitle:
    'Mapping the LRRK2 signalling pathway and its interplay with other Parkinson’s disease components',
  expertiseAndResourceTags: [],
  members: [],
  lastModifiedDate: '2020-09-07T17:36:54Z',
  labCount: 0,
};

type FixtureOptions = {
  teamMembers?: number;
  tools?: number;
};

export const createTeamResponseMembers = ({
  teamMembers = 0,
}: {
  teamMembers?: number;
}): TeamMember[] =>
  Array.from({ length: teamMembers }, (__, memberIndex) => ({
    ...teamMember,
    id: `tm${memberIndex}`,
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

export const createListTeamResponse = (
  items: number,
  options: FixtureOptions = {},
): ListTeamResponse => ({
  total: items,
  items: Array.from({ length: items }, (_, itemIndex) =>
    createTeamResponse(options, itemIndex),
  ),
});

export default createListTeamResponse;
