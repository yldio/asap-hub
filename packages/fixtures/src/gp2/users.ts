import { gp2 } from '@asap-hub/model';

const mockedUser: gp2.UserResponse = {
  id: 'user-id-1',
  createdDate: '2020-09-23T20:45:22.000Z',
  displayName: 'Tony Stark',
  email: 'T@ark.io',
  firstName: 'Tony',
  lastName: 'Stark',
  region: 'Europe',
  degrees: ['PhD'],
  role: 'Trainee',
  country: 'Spain',
  positions: [
    {
      role: 'CEO',
      department: 'Research',
      institution: 'Stark Industries',
    },
  ],
  onboarded: true,
  projects: [
    {
      id: 'project-id',
      title: 'a project title',
      status: 'Active',
      members: [{ userId: 'user-id-1', role: 'Project lead' }],
    },
  ],
  workingGroups: [
    {
      id: 'working-group-id',
      title: 'a working group title',
      members: [{ userId: 'user-id-1', role: 'Co-lead' }],
    },
  ],
  contributingCohorts: [],
  fundingStreams: undefined,
  keywords: ['Bash'],
};

export const createUserResponse = (
  overrides: Partial<gp2.UserResponse> = {},
): gp2.UserResponse => ({
  ...mockedUser,
  ...overrides,
});

export const createUsersResponse = (items = 1): gp2.ListUserResponse => ({
  items: Array.from({ length: items }, (_, id) =>
    createUserResponse({ id: String(id) }),
  ),
  total: items,
});
