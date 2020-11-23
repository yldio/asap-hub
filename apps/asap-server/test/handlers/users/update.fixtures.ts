import { UserResponse } from '@asap-hub/model';
import { RestUser } from '@asap-hub/squidex';
import { CMSUser } from '../../../src/entities';
import { config } from '@asap-hub/squidex';

export const patchResponse: CMSUser = {
  id: 'userId',
  data: {
    role: { iv: 'Grantee' },
    lastModifiedDate: { iv: '2020-09-25T09:42:51.132Z' },
    email: { iv: 'cristiano@ronaldo.com' },
    firstName: { iv: 'Cristiano' },
    lastName: { iv: 'Ronaldo' },
    jobTitle: { iv: 'Junior' },
    orcid: { iv: '363-98-9330' },
    institution: { iv: 'Dollar General Corporation' },
    location: { iv: 'Zofilte' },
    avatar: { iv: ['uuid-user-id-1'] },
    skills: { iv: [] },
    orcidWorks: { iv: [] },
    teams: {
      iv: [
        {
          id: ['team-id-1'],
          role: 'Lead PI (Core Leadership)',
          approach: 'Exact',
          responsibilities: 'Make sure coverage is high',
        },
        {
          id: ['team-id-3'],
          role: 'Collaborating PI',
        },
      ],
    },
    connections: { iv: [] },
  },
  created: '2020-09-25T09:42:51Z',
  lastModified: '2020-09-25T09:42:51Z',
};

export const putResponse: RestUser = {
  id: 'userId',
  data: {
    role: { iv: 'Grantee' },
    lastModifiedDate: { iv: '2020-09-25T09:42:51.132Z' },
    email: { iv: 'cristiano@ronaldo.com' },
    firstName: { iv: 'Cristiano' },
    lastName: { iv: 'Ronaldo' },
    avatar: { iv: ['uuid-user-id-1'] },
    skills: { iv: [] },
    orcidWorks: { iv: [] },
    teams: {
      iv: [
        {
          role: 'Lead PI (Core Leadership)',
          approach: 'Exact',
          responsibilities: 'Make sure coverage is high',
          id: ['team-id-1'],
        },
      ],
    },
    connections: { iv: [] },
    biography: { iv: 'I do awesome stuff' },
    department: { iv: 'Awesome Department' },
    questions: { iv: [{ question: 'test' }] },
  },
  created: '2020-09-25T09:42:51Z',
  lastModified: '2020-09-25T09:42:51Z',
};

export const expectation: UserResponse = {
  id: 'userId',
  createdDate: '2020-09-25T09:42:51.000Z',
  lastModifiedDate: '2020-09-25T09:42:51.132Z',
  displayName: 'Cristiano Ronaldo',
  email: 'cristiano@ronaldo.com',
  firstName: 'Cristiano',
  lastName: 'Ronaldo',
  biography: 'I do awesome stuff',
  department: 'Awesome Department',
  teams: [
    {
      id: 'team-id-1',
      displayName: 'Unknown',
      role: 'Lead PI (Core Leadership)',
      approach: 'Exact',
      responsibilities: 'Make sure coverage is high',
    },
  ],
  orcidWorks: [],
  skills: [],
  questions: ['test'],
  avatarUrl: `${config.baseUrl}/api/assets/${config.appName}/uuid-user-id-1`,
  role: 'Grantee',
};
