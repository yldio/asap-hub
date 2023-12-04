import {
  ListInterestGroupResponse,
  InterestGroupResponse,
  InterestGroupRole,
} from '@asap-hub/model';
import { createTeamListItemResponse, createTeamResponse } from './teams';
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

export const createInterestGroupResponse = (
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
): InterestGroupResponse => {
  const id = `g-${itemIndex}`;
  return {
    id,
    active: true,
    createdDate: '2021-01-12T11:09:04.000Z',
    contactEmails: ['test1@test.com', 'test2@test.com'],
    lastModifiedDate: '2021-01-12T11:10:04.000Z',
    name: `Group ${itemIndex + 1}`,
    tags: ['Tag'],
    description: `Interest Group description ${itemIndex + 1}`,
    tools: {
      slack: 'http://slack.slack.com',
      googleDrive: 'http://drive.google.com/123',
    },
    teams: Array.from({ length: teamsCount }, (_, index) =>
      createTeamListItemResponse(index),
    ),
    leaders: [
      ...Array.from({ length: leadPiCount }, (_, index) => ({
        user: createUserResponse(leadPi, index),
        role: 'Lead PI - Chair' as InterestGroupRole,
      })),
      ...Array.from({ length: projectManagerCount }, (_, index) => ({
        user: createUserResponse(projectManager, leadPiCount + index),
        role: 'Project Manager' as InterestGroupRole,
      })),
    ],
    calendars: Array.from({ length: calendarsCount }, (_, index) =>
      createCalendarResponse({ activeGroups: true }, index),
    ),
  };
};

export const createListInterestGroupResponse = (
  items = 1,
  options: FixtureOptions = {},
): ListInterestGroupResponse => ({
  total: items,
  items: Array.from({ length: items }, (_, itemIndex) =>
    createInterestGroupResponse(options, itemIndex),
  ),
});

export default createListInterestGroupResponse;
