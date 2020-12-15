import { UserResponse } from '@asap-hub/model';
import { RestUser, config, GraphqlUser } from '@asap-hub/squidex';
import { CMSUser } from '../../../src/entities';
import { ResponseFetchUser } from '../../../src/controllers/users';

export const buildUserGraphqlResponse = (
  flatdata: Partial<GraphqlUser['flatData']> = {},
): { data: ResponseFetchUser } => ({
  data: {
    findUsersContent: {
      id: 'userId',
      created: '2020-09-25T09:42:51Z',
      lastModified: '2020-09-25T09:42:51Z',
      data: null,
      flatData: {
        email: 'cristiano@ronaldo.com',
        contactEmail: 'cristiano@ronaldo.com',
        firstName: 'Cristiano',
        lastName: 'Ronaldo',
        lastModifiedDate: '2020-09-25T09:42:51.132Z',
        jobTitle: 'Junior',
        orcid: '363-98-9330',
        institution: 'Dollar General Corporation',
        location: 'Zofilte',
        avatar: [{ id: 'uuid-user-id-1' }],
        questions: null,
        skills: null,
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
            role: 'Lead PI (Core Leadership)',
            approach: 'Exact',
            responsibilities: 'Make sure coverage is high',
            id: [
              {
                id: 'team-id-1',
                created: '2020-09-23T20:45:22Z',
                lastModified: '2020-10-26T15:33:18Z',
                data: null,
                flatData: {
                  applicationNumber: 'applicationNumber',
                  projectTitle: 'Awesome project',
                  displayName: 'Jackson, M',
                  proposal: [{ id: 'proposal-id-1' }],
                  skills: [],
                  outputs: [],
                },
              },
            ],
          },
          {
            role: 'Collaborating PI',
            approach: null,
            responsibilities: null,
            id: [
              {
                id: 'team-id-3',
                created: '2020-09-23T20:45:22Z',
                lastModified: '2020-10-26T15:33:18Z',
                data: null,
                flatData: {
                  applicationNumber: 'applicationNumber',
                  projectTitle: 'Another Awesome project',
                  displayName: 'Tarantino, M',
                  proposal: [{ id: 'proposal-id-2' }],
                  skills: [],
                  outputs: [],
                },
              },
            ],
          },
        ],
        role: 'Grantee',
        connections: [],
        ...flatdata,
      },
    },
  },
});

export const getUserResponse: CMSUser = {
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
    social: {
      iv: [
        {
          github: 'awesome',
        },
      ],
    },
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
    social: {
      iv: [
        {
          github: 'awesome',
        },
      ],
    },
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
  displayName: 'Cristiano Ronaldo',
  createdDate: '2020-09-25T09:42:51.000Z',
  lastModifiedDate: '2020-09-25T09:42:51.132Z',
  email: 'cristiano@ronaldo.com',
  contactEmail: 'cristiano@ronaldo.com',
  firstName: 'Cristiano',
  lastName: 'Ronaldo',
  jobTitle: 'Junior',
  institution: 'Dollar General Corporation',
  social: {
    github: 'awesome',
    orcid: '363-98-9330',
  },
  teams: [
    {
      id: 'team-id-1',
      displayName: 'Jackson, M',
      proposal: 'proposal-id-1',
      role: 'Lead PI (Core Leadership)',
      approach: 'Exact',
      responsibilities: 'Make sure coverage is high',
    },
    {
      displayName: 'Tarantino, M',
      id: 'team-id-3',
      proposal: 'proposal-id-2',
      role: 'Collaborating PI',
    },
  ],
  location: 'Zofilte',
  orcid: '363-98-9330',
  orcidWorks: [],
  skills: [],
  questions: [],
  avatarUrl: `${config.baseUrl}/api/assets/${config.appName}/uuid-user-id-1`,
  role: 'Grantee',
};
