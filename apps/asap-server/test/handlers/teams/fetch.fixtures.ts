import { ListTeamResponse } from '@asap-hub/model';
import { config } from '@asap-hub/squidex';
import { CMSTeam, CMSUser } from '../../../src/entities';

export const teamsResponse: { total: number; items: CMSTeam[] } = {
  total: 4,
  items: [
    {
      id: 'team-id-1',
      data: {
        displayName: {
          iv: 'Cristiano Ronaldo',
        },
        applicationNumber: {
          iv: 'hofded',
        },
        projectTitle: {
          iv:
            'Ce fe kok ob lovkad pim cukiviw lakwujuz vilid camiduci nim ca perkeb mekkaho wuculate re huppoljop.',
        },
        projectSummary: {
          iv:
            'Wi dalev fu jusjuh buw nauzi kas ma. Fo ajelo pu vaenusug ezuhsi resdudif ebsofak tav dan mumooz awgabu meki gicub bowec afegeir tozab umefarow.',
        },
        skills: {
          iv: [],
        },
      },
      created: '2020-09-08T16:35:28Z',
      lastModified: '2020-09-08T16:35:28Z',
    },
    {
      id: 'team-id-2',
      data: {
        displayName: {
          iv: 'John Travista',
        },
        applicationNumber: {
          iv: 'lemeh',
        },
        projectTitle: {
          iv:
            'Eslaki kev ci gohgujdub ju re levorih boknuzu jaob ja et de sen.',
        },
        projectSummary: {
          iv:
            'Opwounege epjav mevkop fuvjamal erejol ho su ri ropzuumu wumufi.',
        },
        skills: {
          iv: [],
        },
      },
      created: '2020-09-16T14:31:19Z',
      lastModified: '2020-09-16T14:31:19Z',
    },
  ],
};

export const usersResponseTeam1: { total: number; items: CMSUser[] } = {
  total: 1,
  items: [
    {
      id: 'user-id-1',
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
              displayName: 'Cristiano Ronaldo',
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
    },
  ],
};

export const usersResponseTeam2: { total: number; items: CMSUser[] } = {
  total: 2,
  items: [
    {
      id: 'user-id-2',
      data: {
        role: {
          iv: 'Grantee',
        },
        lastModifiedDate: {
          iv: '2020-09-25T09:42:51.132Z',
        },
        displayName: {
          iv: 'John Travista',
        },
        email: {
          iv: 'john@ed.ma',
        },
        firstName: {
          iv: 'John',
        },
        lastName: {
          iv: 'Travista',
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
          iv: ['uuid-user-id-2'],
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
              displayName: 'John Travista',
              id: ['team-id-2'],
            },
          ],
        },
        connections: {
          iv: [],
        },
      },
      created: '2020-09-25T09:42:51Z',
      lastModified: '2020-09-25T09:42:51Z',
    },
    {
      id: 'user-id-3',
      data: {
        role: {
          iv: 'Grantee',
        },
        lastModifiedDate: {
          iv: '2020-09-25T09:42:51.132Z',
        },
        displayName: {
          iv: 'Bill Travista',
        },
        email: {
          iv: 'bill@ed.ma',
        },
        firstName: {
          iv: 'Bill',
        },
        lastName: {
          iv: 'Travista',
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
          iv: ['uuid-user-id-3'],
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
              role: 'Key Personnel',
              displayName: 'John Travista',
              id: ['team-id-2'],
            },
          ],
        },
        connections: {
          iv: [],
        },
      },
      created: '2020-09-25T09:42:51Z',
      lastModified: '2020-09-25T09:42:51Z',
    },
  ],
};

export const expectation: ListTeamResponse = {
  total: 4,
  items: [
    {
      id: 'team-id-1',
      displayName: 'Cristiano Ronaldo',
      applicationNumber: 'hofded',
      projectTitle:
        'Ce fe kok ob lovkad pim cukiviw lakwujuz vilid camiduci nim ca perkeb mekkaho wuculate re huppoljop.',
      projectSummary:
        'Wi dalev fu jusjuh buw nauzi kas ma. Fo ajelo pu vaenusug ezuhsi resdudif ebsofak tav dan mumooz awgabu meki gicub bowec afegeir tozab umefarow.',
      skills: [],
      members: [
        {
          id: 'user-id-1',
          firstName: 'Cristiano',
          lastName: 'Ronaldo',
          avatarUrl: `${config.baseUrl}/api/assets/${config.appName}/uuid-user-id-1`,
          email: 'cristiano@ronaldo.com',
          displayName: 'Cristiano Ronaldo',
          role: 'Lead PI',
        },
      ],
      lastModifiedDate: '2020-09-08T16:35:28Z',
    },
    {
      id: 'team-id-2',
      displayName: 'John Travista',
      applicationNumber: 'lemeh',
      projectTitle:
        'Eslaki kev ci gohgujdub ju re levorih boknuzu jaob ja et de sen.',
      projectSummary:
        'Opwounege epjav mevkop fuvjamal erejol ho su ri ropzuumu wumufi.',
      skills: [],
      members: [
        {
          id: 'user-id-2',
          firstName: 'John',
          lastName: 'Travista',
          avatarUrl: `${config.baseUrl}/api/assets/${config.appName}/uuid-user-id-2`,
          email: 'john@ed.ma',
          displayName: 'John Travista',
          role: 'Lead PI',
        },
        {
          id: 'user-id-3',
          firstName: 'Bill',
          lastName: 'Travista',
          avatarUrl: `${config.baseUrl}/api/assets/${config.appName}/uuid-user-id-3`,
          email: 'bill@ed.ma',
          displayName: 'Bill Travista',
          role: 'Key Personnel',
        },
      ],
      lastModifiedDate: '2020-09-16T14:31:19Z',
    },
  ],
};
