import { CMSUser } from '../../../src/entities';

export const patchResponse: CMSUser = {
  id: 'userId',
  data: {
    role: {
      iv: 'Grantee',
    },
    lastModifiedDate: {
      iv: '2020-09-25T09:42:51.132Z',
    },
    displayName: {
      iv: 'Cristiano Ronaldo',
    },
    email: {
      iv: 'cristiano@ronaldo.com',
    },
    firstName: {
      iv: 'Cristiano',
    },
    lastName: {
      iv: 'Ronaldo',
    },
    jobTitle: {
      iv: 'Junior',
    },
    orcid: {
      iv: '363-98-9330',
    },
    institution: {
      iv: 'Dollar General Corporation',
    },
    location: {
      iv: 'Zofilte',
    },
    avatar: {
      iv: ['uuid-user-id-1'],
    },
    skills: {
      iv: [],
    },
    orcidWorks: {
      iv: [],
    },
    teams: {
      iv: [
        {
          role: 'Lead PI',
          id: ['team-id-1'],
        },
      ],
    },
    connections: {
      iv: [],
    },
  },
  created: '2020-09-25T09:42:51Z',
  lastModified: '2020-09-25T09:42:51Z',
};
