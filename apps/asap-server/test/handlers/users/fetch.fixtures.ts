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
          flatData: {
            avatar: [],
            displayName: 'Tom Hardy',
            email: 'H@rdy.io',
            firstName: 'Tom',
            lastModifiedDate: null,
            lastName: 'Hardy',
            teams: [
              {
                role: 'Lead PI',
                id: [
                  {
                    id: 'userId3',
                    created: '2020-09-23T20:45:22Z',
                    lastModified: '2020-10-26T15:33:18Z',
                    flatData: {
                      applicationNumber: 'applicationNumber',
                      projectTitle: 'Awesome project',
                      displayName: 'Jackson, M',
                      proposal: ['proposalId'],
                      skills: [],
                    },
                  },
                ],
              },
            ],
          },
        },
        {
          id: 'userId2',
          created: '2020-09-23T20:45:22Z',
          lastModified: '2020-10-26T15:33:18Z',
          flatData: {
            avatar: null,
            displayName: 'Arnold Schwatzneger',
            email: 'iwillbeback@arnold.com',
            firstName: 'Arnold',
            lastModifiedDate: null,
            lastName: 'Schwatzneger',
            teams: [
              {
                role: 'Project Manager',
                id: [
                  {
                    id: 'userId3',
                    created: '2020-09-23T20:45:22Z',
                    lastModified: '2020-10-26T15:33:18Z',
                    flatData: {
                      applicationNumber: 'applicationNumber',
                      projectTitle: 'Awesome project',
                      displayName: 'Jackson, M',
                      proposal: null,
                      skills: [],
                    },
                  },
                ],
              },
            ],
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
      firstName: 'Tom',
      lastName: 'Hardy',
      lastModifiedDate: '2020-09-23T20:45:22.000Z',
      teams: [
        {
          id: 'userId3',
          role: 'Lead PI',
          displayName: 'Jackson, M',
          proposalURL: 'proposalId',
        },
      ],
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
      teams: [
        {
          id: 'userId3',
          role: 'Project Manager',
          displayName: 'Jackson, M',
        },
      ],
    },
  ],
};
