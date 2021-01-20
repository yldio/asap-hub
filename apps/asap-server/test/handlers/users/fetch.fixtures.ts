import { ListUserResponse } from '@asap-hub/model';
import { ResponseFetchUsers } from '../../../src/controllers/users';

export const response: { data: ResponseFetchUsers } = {
  data: {
    queryUsersContentsWithTotal: {
      total: 2,
      items: [
        {
          id: 'userId1',
          lastModified: '2020-10-26T15:33:18Z',
          created: '2020-09-23T20:45:22Z',
          data: null,
          flatData: {
            avatar: [],
            email: 'H@rdy.io',
            contactEmail: 'T@rdy.io',
            firstName: 'Tom',
            lastName: 'Hardy',
            lastModifiedDate: '',
            questions: null,
            skills: null,
            orcid: '123-456-789',
            social: null,
            teams: [
              {
                role: 'Lead PI (Core Leadership)',
                approach: null,
                responsibilities: null,
                id: [
                  {
                    id: 'userId3',
                    created: '2020-09-23T20:45:22Z',
                    lastModified: '2020-10-26T15:33:18Z',
                    data: null,
                    flatData: {
                      applicationNumber: 'applicationNumber',
                      projectTitle: 'Awesome project',
                      displayName: 'Jackson, M',
                      proposal: [{ id: 'proposalId' }],
                      skills: [],
                      outputs: [],
                    },
                  },
                ],
              },
            ],
            role: 'Grantee',
            connections: [],
          },
        },
        {
          id: 'userId2',
          created: '2020-09-23T20:45:22Z',
          lastModified: '2020-10-26T15:33:18Z',
          data: null,
          flatData: {
            avatar: null,
            email: 'iwillbeback@arnold.com',
            firstName: 'Arnold',
            lastModifiedDate: null,
            lastName: 'Schwatzneger',
            questions: [],
            skills: [],
            social: [
              {
                github: 'awesome',
                googleScholar: null,
                linkedIn: null,
                researcherId: null,
                researchGate: null,
                twitter: null,
                website1: null,
                website2: null,
              },
            ],
            teams: [
              {
                role: 'Project Manager',
                approach: 'cover',
                responsibilities: 'increase coverage',
                id: [
                  {
                    id: 'userId3',
                    created: '2020-09-23T20:45:22Z',
                    lastModified: '2020-10-26T15:33:18Z',
                    flatData: {
                      applicationNumber: 'applicationNumber',
                      projectTitle: 'Awesome project',
                      displayName: 'Jackson, M',
                      skills: [],
                      outputs: [],
                    },
                    data: null,
                  },
                ],
              },
            ],
            connections: [],
            role: 'Grantee',
          },
        },
      ],
    },
  },
};

export const expectation: ListUserResponse = {
  total: 2,
  items: [
    {
      id: 'userId1',
      createdDate: '2020-09-23T20:45:22.000Z',
      questions: [],
      skills: [],
      displayName: 'Tom Hardy',
      email: 'H@rdy.io',
      contactEmail: 'T@rdy.io',
      firstName: 'Tom',
      lastName: 'Hardy',
      lastModifiedDate: '2020-09-23T20:45:22.000Z',
      orcidWorks: [],
      orcid: '123-456-789',
      social: {
        orcid: '123-456-789',
      },
      teams: [
        {
          id: 'userId3',
          role: 'Lead PI (Core Leadership)',
          displayName: 'Jackson, M',
          proposal: 'proposalId',
        },
      ],
      role: 'Grantee',
    },
    {
      id: 'userId2',
      createdDate: '2020-09-23T20:45:22.000Z',
      questions: [],
      skills: [],
      displayName: 'Arnold Schwatzneger',
      email: 'iwillbeback@arnold.com',
      firstName: 'Arnold',
      lastName: 'Schwatzneger',
      lastModifiedDate: '2020-09-23T20:45:22.000Z',
      orcidWorks: [],
      social: {
        github: 'awesome',
      },
      teams: [
        {
          id: 'userId3',
          role: 'Project Manager',
          displayName: 'Jackson, M',
          approach: 'cover',
          responsibilities: 'increase coverage',
        },
      ],
      role: 'Grantee',
    },
  ],
};
