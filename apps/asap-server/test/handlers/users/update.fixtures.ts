import { UserResponse } from '@asap-hub/model';
import { RestUser } from '@asap-hub/squidex';
import { CMSUser } from '../../../src/entities';

export const patchResponse: CMSUser = {
  id: 'userId',
  data: {
    role: { iv: 'Grantee' },
    lastModifiedDate: { iv: '2020-09-25T09:42:51.132Z' },
    displayName: { iv: 'Cristiano Ronaldo' },
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
          role: 'Lead PI (Core Leadership)',
          id: ['team-id-1'],
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
    displayName: { iv: 'Cristiano Ronaldo' },
    email: { iv: 'cristiano@ronaldo.com' },
    firstName: { iv: 'Cristiano' },
    lastName: { iv: 'Ronaldo' },
    avatar: { iv: ['uuid-user-id-1'] },
    skills: { iv: [] },
    orcidWorks: { iv: [] },
    teams: { iv: [{ role: 'Lead PI', id: ['team-id-1'] }] },
    connections: { iv: [] },
    biography: { iv: 'Epic shit' },
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
  biography: 'Epic shit',
  teams: [
    {
      id: 'team-id-1',
      displayName: 'Unknown',
      role: 'Lead PI',
    },
  ],
  orcidWorks: [],
  skills: [],
  questions: ['test'],
  avatarUrl: 'http://localhost:4004/api/assets/asap-local/uuid-user-id-1',
  role: 'Grantee',
};
