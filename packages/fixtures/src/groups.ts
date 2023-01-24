import { ListGroupResponse, GroupResponse, GroupRole } from '@asap-hub/model';
import { createTeamResponse } from './teams';
import { createUserResponse } from './users';
import { createCalendarResponse } from './calendars';

type FixtureOptions = {
  teams?: Parameters<typeof createTeamResponse>[0];
  teamsCount?: number;
  leadPi?: Parameters<typeof createUserResponse>[0];
  leadPiCount?: number;
  projectManager?: Parameters<typeof createUserResponse>[0];
  projectManagerCount?: number;
  calendarsCount?: number;
};

export const createGroupResponse = (
  {
    calendarsCount = 1,
    leadPi,
    leadPiCount = 1,
    projectManager,
    projectManagerCount = 1,
    teams,
    teamsCount = 1,
  }: FixtureOptions = {},
  itemIndex = 0,
): GroupResponse => {
  const id = `g-${itemIndex}`;
  return {
    id,
    active: true,
    createdDate: '2021-01-12T11:09:04.000Z',
    lastModifiedDate: '2021-01-12T11:10:04.000Z',
    name: `Group ${itemIndex + 1}`,
    tags: ['Tag'],
    description: `Group description ${itemIndex + 1}`,
    tools: {
      slack: 'http://slack.slack.com',
      googleDrive: 'http://drive.google.com/123',
    },
    teams: Array.from({ length: teamsCount }, (_, index) =>
      createTeamResponse(teams, index),
    ),
    leaders: [
      ...Array.from({ length: leadPiCount }, (_, index) => ({
        user: createUserResponse(leadPi, index),
        role: 'Lead PI - Chair' as GroupRole,
      })),
      ...Array.from({ length: projectManagerCount }, (_, index) => ({
        user: createUserResponse(projectManager, leadPiCount + index),
        role: 'Project Manager' as GroupRole,
      })),
    ],
    calendars: Array.from({ length: calendarsCount }, (_, index) =>
      createCalendarResponse({ group: true }, index),
    ),
  };
};

export const createListGroupResponse = (
  items = 1,
  options: FixtureOptions = {},
): ListGroupResponse => ({
  total: items,
  items: Array.from({ length: items }, (_, itemIndex) =>
    createGroupResponse(options, itemIndex),
  ),
});

export default createListGroupResponse;
