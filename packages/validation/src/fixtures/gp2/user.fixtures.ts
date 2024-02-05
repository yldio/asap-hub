import { gp2 } from '@asap-hub/model';

export const getUserResponse = (): gp2.UserResponse => ({
  id: 'userId',
  createdDate: '2020-09-25T09:42:51.000Z',
  onboarded: true,
  email: 'tony@stark.com',
  firstName: 'Tony',
  lastName: 'Stark',
  displayName: 'Tony Stark',
  city: 'New York',
  stateOrProvince: 'New York',
  region: 'North America',
  country: 'USA',
  positions: [
    {
      role: 'CEO',
      institution: 'Stark Industries',
      department: 'Research',
    },
  ],
  avatarUrl: `https://test.com/api/assets/asap-dev/asset-id`,
  role: 'Network Investigator',
  tags: [{ id: 'id-1', name: 'Data Science' }],
  tagIds: [],
  biography:
    'Anthony Edward "Tony" Stark was a billionaire industrialist, a founding member of the Avengers, and the former CEO of Stark Industries.',
  degrees: ['PhD'],
  projects: [],
  projectIds: [],
  workingGroups: [],
  workingGroupIds: [],
  contributingCohorts: [],
  questions: [],
});
