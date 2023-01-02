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
  region: 'North America',
  country: 'USA',
  positions: [
    {
      role: 'CEO',
      institution: 'Stark Industries',
      department: 'Research',
    },
  ],
  avatarUrl: `https://test.com/api/assets/asap-dev/squidex-asset-id`,
  role: 'Network Investigator',
  keywords: ['Data Science'],
  biography:
    'Anthony Edward "Tony" Stark was a billionaire industrialist, a founding member of the Avengers, and the former CEO of Stark Industries.',
  degrees: ['PhD'],
  projects: [],
  workingGroups: [],
  fundingStreams: null,
  contributingCohorts: [],
});
