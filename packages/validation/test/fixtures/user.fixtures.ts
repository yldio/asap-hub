import { UserResponse } from '@asap-hub/model';

export const userResponse: UserResponse = {
  id: 'userId',
  onboarded: true,
  displayName: 'Cristiano Ronaldo',
  createdDate: '2020-09-25T09:42:51.000Z',
  lastModifiedDate: '2020-09-25T09:42:51.132Z',
  email: 'cristiano@ronaldo.com',
  contactEmail: 'cristiano@ronaldo.com',
  firstName: 'Cristiano',
  lastName: 'Ronaldo',
  jobTitle: 'Junior',
  institution: 'Dollar General Corporation',
  degree: 'MPH',
  teams: [
    {
      id: 'team-id-1',
      displayName: 'Jackson, M',
      role: 'Lead PI (Core Leadership)',
      proposal: 'proposal-id-1',
      approach: 'Exact',
      responsibilities: 'Make sure coverage is high',
    },
    {
      id: 'team-id-3',
      displayName: 'Tarantino, M',
      proposal: 'proposal-id-2',
      role: 'Collaborating PI',
    },
  ],
  location: 'Zofilte',
  orcid: '363-98-9330',
  orcidWorks: [],
  social: {
    orcid: '363-98-9330',
  },
  skills: ['skill 1', 'skill 2', 'skill 3', 'skill 4', 'skill 5'],
  questions: ['Question 1', 'Question 2'],
  avatarUrl: `https://test.com/api/assets/asap-dev/squidex-asset-id`,
  role: 'Grantee',
};
