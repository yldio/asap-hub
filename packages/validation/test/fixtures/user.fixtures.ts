import { UserResponse } from '@asap-hub/model';

export const getUserResponse = (): UserResponse => ({
  id: 'userId',
  onboarded: true,
  displayName: 'Tony Stark',
  createdDate: '2020-09-25T09:42:51.000Z',
  lastModifiedDate: '2020-09-25T09:42:51.132Z',
  email: 'tony@stark.com',
  contactEmail: 'tony@stark.com',
  firstName: 'Tony',
  lastName: 'Stark',
  jobTitle: 'CEO',
  city: 'London',
  country: 'United Kingdom',
  institution: 'Stark Industries',
  degree: 'MPH',
  teams: [
    {
      id: 'team-id-1',
      displayName: 'Jackson, M',
      role: 'Lead PI (Core Leadership)',
      proposal: 'proposal-id-1',
    },
    {
      id: 'team-id-3',
      displayName: 'Tarantino, M',
      proposal: 'proposal-id-2',
      role: 'Collaborating PI',
    },
  ],
  orcid: '363-98-9330',
  orcidWorks: [],
  social: {
    orcid: '363-98-9330',
  },
  expertiseAndResourceTags: [
    'expertise 1',
    'expertise 2',
    'expertise 3',
    'expertise 4',
    'expertise 5',
  ],
  questions: ['Question 1', 'Question 2'],
  avatarUrl: `https://test.com/api/assets/asap-dev/squidex-asset-id`,
  role: 'Grantee',
  biography: 'Biography',
  labs: [
    { id: 'cd7be4902', name: 'Barcelona' },
    { id: 'cd7be4905', name: 'Glasgow' },
  ],
  researchInterests: 'Exact',
  responsibilities: 'Make sure coverage is high',
});
