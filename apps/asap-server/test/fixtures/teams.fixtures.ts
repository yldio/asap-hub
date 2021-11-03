import { ListTeamResponse, TeamResponse, TeamTool } from '@asap-hub/model';
import {
  config,
  GraphqlResearchOutputAuthors,
  RestTeam,
  Team,
  WebhookPayload,
} from '@asap-hub/squidex';
import { RestUser } from '@asap-hub/squidex';
import {
  ResponseFetchTeams,
  ResponseFetchTeam,
} from '../../src/controllers/teams';
import {
  Labs,
  UsersDataQuestionsChildDto,
  UsersDataTeamsChildDto,
  UsersFlatDataDto,
} from '../../src/gql/graphql';
import { getSquidexResearchOutputGraphqlResponseAuthors } from './research-output.fixtures';
import { fetchExpectation } from './users.fixtures';

export const referencingUsersContentsResponse = ({
  avatar,
}: {
  avatar?: null;
}) => [
  {
    id: 'user-id-1',
    created: '2020-09-25T09:42:51.132Z',
    lastModified: '2020-09-25T09:42:51.132Z',
    flatData: {
      avatar,
      email: 'cristiano@ronaldo.com',
      firstName: 'Cristiano',
      lastName: 'Ronaldo',
      jobTitle: 'Junior',
      institution: 'Dollar General Corporation',
      connections: [],
      biography: '',
      degree: '',
      contactEmail: '',
      country: '',
      city: '',
      orcid: '',
      orcidWorks: [],
      skillsDescription: '',
      responsibilities: '',
      reachOut: '',
      lastModifiedDate: '2020-11-26T11:56:04Z',
      orcidLastModifiedDate: '2020-11-26T11:56:04Z',
      orcidLastSyncDate: '2020-11-26T11:56:04Z',
      teams: [
        {
          id: [
            {
              id: 'team-id-1',
              created: '2020-09-23T20:33:36Z',
              lastModified: '2020-11-26T11:56:04Z',
              flatData: {
                displayName: 'Schipa, A',
              },
            },
          ],
          role: 'Lead PI (Core Leadership)',
        },
      ] as Array<UsersDataTeamsChildDto>,
      questions: [] as Array<UsersDataQuestionsChildDto>,
      skills: [],
      role: 'Grantee',
      onboarded: true,
      labs: [
        { id: 'cd7be4902', flatData: { name: 'Barcelona' } },
        { id: 'cd7be4905', flatData: { name: 'Glasgow' } },
      ] as Array<Labs>,
      adminNotes: null,
      social: [],
    } as UsersFlatDataDto,
  },
];

export const getGraphQlTeamsResponse = (): { data: ResponseFetchTeams } => ({
  data: {
    queryTeamsContentsWithTotal: {
      total: 3,
      items: [
        {
          id: 'team-id-1',
          created: '2020-09-23T20:33:36Z',
          lastModified: '2020-11-26T11:56:04Z',
          flatData: {
            applicationNumber: 'ASAP-000420',
            displayName: 'Schipa, A',
            outputs: [
              {
                id: '4cfb1b7b-bafe-4fca-b2ab-197e84d98996',
                created: '2020-09-17T08:18:01Z',
                lastModified: '2020-10-21T13:11:50.000Z',
                flatData: {
                  link: null,
                  publishDate: null,
                  addedDate: null,
                  title: 'Proposal',
                  type: 'Proposal',
                  tags: ['test', 'tag'],
                  authors: [
                    getSquidexResearchOutputGraphqlResponseAuthors()![0] as GraphqlResearchOutputAuthors,
                  ],
                  sharingStatus: 'Network Only',
                  asapFunded: 'No',
                },
              },
              {
                id: '7198d072-de87-4b80-90ca-4a1abe67952e',
                created: '2020-11-24T16:33:30Z',
                lastModified: '2020-11-26T13:45:49.000Z',
                flatData: {
                  link: 'docs.google.com',
                  publishDate: null,
                  labCatalogNumber: 'http://example.com',
                  addedDate: '2021-05-24T17:33:30Z',
                  title: "Team Salzer's intro slide deck",
                  type: 'Presentation',
                  tags: ['test', 'tag'],
                  accessInstructions: 'some access instructions',
                  authors: [
                    getSquidexResearchOutputGraphqlResponseAuthors()[1] as GraphqlResearchOutputAuthors,
                  ],
                },
              },
            ],
            projectSummary: null,
            projectTitle:
              'The genome-microbiome axis in the cause of Parkinson disease: Mechanistic insights and therapeutic implications from experimental models and a genetically stratified patient population.',
            skills: ['Animal resources'],
            proposal: [
              {
                id: '4cfb1b7b-bafe-4fca-b2ab-197e84d98996',
              },
            ],
            tools: [
              {
                url: 'testUrl',
                name: 'slack',
                description: 'this is a test',
              },
            ],
          },
          referencingUsersContents: [
            {
              id: 'user-id-1',
              created: '2020-09-25T09:42:51.132Z',
              lastModified: '2020-09-25T09:42:51.132Z',
              flatData: {
                avatar: [
                  {
                    id: 'uuid-user-id-1',
                  },
                ],
                email: 'cristiano@ronaldo.com',
                firstName: 'Cristiano',
                lastName: 'Ronaldo',
                jobTitle: 'Junior',
                institution: 'Dollar General Corporation',
                connections: [],
                biography: '',
                teams: [
                  {
                    id: [
                      {
                        id: 'team-id-1',
                        created: '2020-09-23T20:33:36Z',
                        lastModified: '2020-11-26T11:56:04Z',
                        flatData: {
                          displayName: 'Schipa, A',
                        },
                      },
                    ],
                    role: 'Lead PI (Core Leadership)',
                  },
                ],
                questions: [],
                skills: [],
                role: 'Grantee',
                onboarded: true,
                labs: [
                  { id: 'cd7be4902', flatData: { name: 'Barcelona' } },
                  { id: 'cd7be4905', flatData: { name: 'Glasgow' } },
                ],
              },
            },
          ],
        },
        {
          id: 'team-id-2',
          created: '2020-09-23T20:29:45Z',
          lastModified: '2020-10-26T20:54:00Z',
          flatData: {
            applicationNumber: 'ASAP-000463',
            displayName: 'John T.',
            outputs: null,
            projectSummary: null,
            projectTitle:
              'Mapping the LRRK2 signalling pathway and its interplay with other Parkinson’s disease components',
            skills: [],
            proposal: null,
            tools: null,
          },
          referencingUsersContents: [
            {
              id: 'user-id-2',
              created: '2020-09-25T09:42:51.132Z',
              lastModified: '2020-09-25T09:42:51.132Z',
              flatData: {
                avatar: [
                  {
                    id: 'uuid-user-id-2',
                  },
                ],
                email: 'john@ed.ma',
                firstName: 'John',
                lastName: 'Travista',
                jobTitle: 'Junior',
                institution: 'Dollar General Corporation',
                connections: [],
                biography: '',
                teams: [
                  {
                    id: [
                      {
                        id: 'team-id-2',
                        created: '2020-09-23T20:33:36Z',
                        lastModified: '2020-11-26T11:56:04Z',
                        flatData: {
                          displayName: 'Schipa, A',
                        },
                      },
                    ],
                    role: 'Lead PI (Core Leadership)',
                  },
                ],
                questions: [],
                skills: [],
                role: 'Grantee',
                onboarded: true,
                labs: [],
              },
            },
            {
              id: 'user-id-3',
              created: '2020-09-25T09:42:51.132Z',
              lastModified: '2020-09-25T09:42:51.132Z',
              flatData: {
                avatar: [
                  {
                    id: 'uuid-user-id-3',
                  },
                ],
                email: 'bill@ed.ma',
                firstName: 'Bill',
                lastName: 'Travista',
                jobTitle: 'Junior',
                institution: 'Dollar General Corporation',
                connections: [],
                biography: '',
                teams: [
                  {
                    id: [
                      {
                        id: 'team-id-2',
                        created: '2020-09-23T20:33:36Z',
                        lastModified: '2020-11-26T11:56:04Z',
                        flatData: {
                          displayName: 'Schipa, A',
                        },
                      },
                    ],
                    role: 'Key Personnel',
                  },
                ],
                questions: [],
                skills: [],
                role: 'Grantee',
                onboarded: true,
                labs: [],
              },
            },
          ],
        },
        {
          id: 'team-id-3',
          created: '2020-09-23T20:29:52Z',
          lastModified: '2020-09-23T20:29:52Z',
          flatData: {
            applicationNumber: 'ASAP-000312',
            displayName: 'Zac T.',
            outputs: null,
            projectSummary: 'Its good',
            projectTitle: 'This is good',
            skills: [],
            proposal: null,
            tools: null,
          },
          referencingUsersContents: [
            {
              id: 'user-id-4',
              created: '2020-09-25T09:42:51.132Z',
              lastModified: '2020-09-25T09:42:51.132Z',
              flatData: {
                avatar: [
                  {
                    id: 'uuid-user-id-4',
                  },
                ],
                email: 'seb@.da',
                firstName: 'Seb',
                lastName: 'Oliver',
                jobTitle: 'Junior',
                institution: 'Dollar General Corporation',
                connections: [],
                biography: '',
                teams: [
                  {
                    id: [
                      {
                        id: 'team-id-3',
                        created: '2020-09-23T20:33:36Z',
                        lastModified: '2020-11-26T11:56:04Z',
                        flatData: {
                          displayName: 'Schipa, A',
                        },
                      },
                    ],
                    role: 'Lead PI (Core Leadership)',
                  },
                ],
                questions: [],
                skills: [],
                role: 'Grantee',
                onboarded: true,
                labs: [
                  { id: 'cd7be4904', flatData: { name: 'Manchester' } },
                  { id: 'cd7be4905', flatData: { name: 'Glasgow' } },
                ],
              },
            },
          ],
        },
      ],
    },
  },
});

export const graphQlTeamsResponseSingle: { data: ResponseFetchTeams } = {
  data: {
    queryTeamsContentsWithTotal: {
      total: 1,
      items: [
        getGraphQlTeamsResponse().data.queryTeamsContentsWithTotal.items[0],
      ],
    },
  },
};

export const getListTeamResponse = (): ListTeamResponse => ({
  total: 3,
  items: [
    {
      id: 'team-id-1',
      displayName: 'Schipa, A',
      lastModifiedDate: '2020-11-26T11:56:04.000Z',
      labCount: 2,
      skills: ['Animal resources'],
      outputs: [
        {
          id: '7198d072-de87-4b80-90ca-4a1abe67952e',
          created: '2020-11-24T16:33:30.000Z',
          link: 'docs.google.com',
          type: 'Presentation',
          subTypes: [],
          title: "Team Salzer's intro slide deck",
          description: '',
          tags: ['test', 'tag'],
          addedDate: '2021-05-24T17:33:30Z',
          authors: [fetchExpectation.items[1]],
          teams: [
            {
              id: 'team-id-1',
              displayName: 'Schipa, A',
            },
          ],
          lastUpdatedPartial: '2020-11-26T13:45:49.000Z',
          accessInstructions: 'some access instructions',
          sharingStatus: 'Network Only',
          contactEmails: [],
          labCatalogNumber: 'http://example.com',
          labs: [],
        },
        {
          id: '4cfb1b7b-bafe-4fca-b2ab-197e84d98996',
          created: '2020-09-17T08:18:01.000Z',
          type: 'Proposal',
          subTypes: [],
          title: 'Proposal',
          description: '',
          tags: ['test', 'tag'],
          authors: [fetchExpectation.items[0]],
          teams: [
            {
              id: 'team-id-1',
              displayName: 'Schipa, A',
            },
          ],
          lastUpdatedPartial: '2020-10-21T13:11:50.000Z',
          sharingStatus: 'Network Only',
          asapFunded: false,
          contactEmails: [],
          labs: [],
        },
      ],
      members: [
        {
          id: 'user-id-1',
          displayName: 'Cristiano Ronaldo',
          firstName: 'Cristiano',
          lastName: 'Ronaldo',
          email: 'cristiano@ronaldo.com',
          role: 'Lead PI (Core Leadership)',
          avatarUrl: `${config.baseUrl}/api/assets/${config.appName}/uuid-user-id-1`,
          labs: [
            { id: 'cd7be4902', name: 'Barcelona' },
            { id: 'cd7be4905', name: 'Glasgow' },
          ],
        },
      ],
      projectTitle:
        'The genome-microbiome axis in the cause of Parkinson disease: Mechanistic insights and therapeutic implications from experimental models and a genetically stratified patient population.',
      proposalURL: '4cfb1b7b-bafe-4fca-b2ab-197e84d98996',
      tools: [
        {
          url: 'testUrl',
          name: 'slack',
          description: 'this is a test',
        },
      ],
    },
    {
      id: 'team-id-2',
      displayName: 'John T.',
      labCount: 0,
      projectTitle:
        'Mapping the LRRK2 signalling pathway and its interplay with other Parkinson’s disease components',
      skills: [],
      outputs: [],
      members: [
        {
          id: 'user-id-2',
          firstName: 'John',
          lastName: 'Travista',
          avatarUrl: `${config.baseUrl}/api/assets/${config.appName}/uuid-user-id-2`,
          email: 'john@ed.ma',
          displayName: 'John Travista',
          role: 'Lead PI (Core Leadership)',
          labs: [],
        },
        {
          id: 'user-id-3',
          firstName: 'Bill',
          lastName: 'Travista',
          avatarUrl: `${config.baseUrl}/api/assets/${config.appName}/uuid-user-id-3`,
          email: 'bill@ed.ma',
          displayName: 'Bill Travista',
          role: 'Key Personnel',
          labs: [],
        },
      ],
      lastModifiedDate: '2020-10-26T20:54:00.000Z',
      tools: [],
    },
    {
      id: 'team-id-3',
      displayName: 'Zac T.',
      labCount: 2,
      skills: [],
      outputs: [],
      members: [
        {
          avatarUrl: `${config.baseUrl}/api/assets/${config.appName}/uuid-user-id-4`,
          displayName: 'Seb Oliver',
          email: 'seb@.da',
          firstName: 'Seb',
          id: 'user-id-4',
          lastName: 'Oliver',
          role: 'Lead PI (Core Leadership)',
          labs: [
            { id: 'cd7be4904', name: 'Manchester' },
            { id: 'cd7be4905', name: 'Glasgow' },
          ],
        },
      ],
      tools: [],
      projectTitle: 'This is good',
      projectSummary: 'Its good',
      lastModifiedDate: '2020-09-23T20:29:52.000Z',
    },
  ],
});

export const graphQlTeamResponse: { data: ResponseFetchTeam } = {
  data: {
    findTeamsContent: {
      id: 'team-id-1',
      created: '2020-09-23T20:33:36Z',
      lastModified: '2020-11-26T11:56:04Z',
      flatData: {
        applicationNumber: 'ASAP-000420',
        displayName: 'Schipa, A',
        outputs: [
          {
            id: '4cfb1b7b-bafe-4fca-b2ab-197e84d98996',
            created: '2020-09-17T08:18:01Z',
            lastModified: '2020-10-21T13:11:50.000Z',
            flatData: {
              link: null,
              publishDate: null,
              addedDate: null,
              title: 'Proposal',
              type: 'Proposal',
              tags: ['test', 'tag'],
              sharingStatus: 'Network Only',
              asapFunded: 'No',
              authors: [
                getSquidexResearchOutputGraphqlResponseAuthors()[0] as GraphqlResearchOutputAuthors,
              ],
            },
          },
          {
            id: '7198d072-de87-4b80-90ca-4a1abe67952e',
            created: '2020-11-24T16:33:30Z',
            lastModified: '2020-11-26T13:45:49.000Z',
            flatData: {
              link: 'docs.google.com',
              publishDate: null,
              labCatalogNumber: 'http://example.com',
              addedDate: null,
              title: "Team Salzer's intro slide deck",
              type: 'Presentation',
              authors: [
                getSquidexResearchOutputGraphqlResponseAuthors()[1] as GraphqlResearchOutputAuthors,
              ],
              usedInAPublication: 'No',
            },
            referencingTeamsContents: [
              {
                id: 'team-id-1',
                created: '2020-09-23T20:33:36Z',
                lastModified: '2020-11-26T11:56:04Z',
                flatData: {
                  displayName: 'Schipa, A',
                },
              },
              {
                id: 'team-id-2',
                created: '2020-09-23T20:33:36Z',
                lastModified: '2020-11-26T11:56:04Z',
                flatData: {
                  displayName: 'Team, B',
                },
              },
            ],
          },
        ],
        projectSummary: null,
        projectTitle:
          'The genome-microbiome axis in the cause of Parkinson disease: Mechanistic insights and therapeutic implications from experimental models and a genetically stratified patient population.',
        skills: ['Animal resources'],
        proposal: [
          {
            id: '4cfb1b7b-bafe-4fca-b2ab-197e84d98996',
          },
        ],
        tools: [],
      },
      referencingUsersContents: [
        {
          id: 'user-id-1',
          created: '2020-09-25T09:42:51.132Z',
          lastModified: '2020-09-25T09:42:51.132Z',
          flatData: {
            avatar: [
              {
                id: 'uuid-user-id-1',
              },
            ],
            email: 'cristiano@ronaldo.com',
            firstName: 'Cristiano',
            lastName: 'Ronaldo',
            jobTitle: 'Junior',
            institution: 'Dollar General Corporation',
            connections: [],
            biography: '',
            teams: [
              {
                id: [
                  {
                    id: 'team-id-1',
                    created: '2020-09-23T20:33:36Z',
                    lastModified: '2020-11-26T11:56:04Z',
                    flatData: {
                      displayName: 'Schipa, A',
                      tools: [],
                    },
                  },
                ],
                role: 'Lead PI (Core Leadership)',
              },
            ],
            questions: [],
            skills: [],
            role: 'Grantee',
            onboarded: true,
            labs: [
              { id: 'cd7be4902', flatData: { name: 'Barcelona' } },
              { id: 'cd7be4905', flatData: { name: 'Glasgow' } },
            ],
          },
        },
      ],
    },
  },
};

export const fetchTeamByIdExpectation: TeamResponse = {
  id: 'team-id-1',
  displayName: 'Schipa, A',
  lastModifiedDate: '2020-11-26T11:56:04.000Z',
  skills: ['Animal resources'],
  outputs: [
    {
      id: '7198d072-de87-4b80-90ca-4a1abe67952e',
      created: '2020-11-24T16:33:30.000Z',
      link: 'docs.google.com',
      type: 'Presentation',
      subTypes: [],
      title: "Team Salzer's intro slide deck",
      description: '',
      tags: [],
      authors: [fetchExpectation.items[1]],
      teams: [
        {
          id: 'team-id-1',
          displayName: 'Schipa, A',
        },
        {
          id: 'team-id-2',
          displayName: 'Team, B',
        },
      ],
      lastUpdatedPartial: '2020-11-26T13:45:49.000Z',
      sharingStatus: 'Network Only',
      usedInPublication: false,
      contactEmails: [],
      labCatalogNumber: 'http://example.com',
      labs: [],
    },
    {
      id: '4cfb1b7b-bafe-4fca-b2ab-197e84d98996',
      created: '2020-09-17T08:18:01.000Z',
      type: 'Proposal',
      subTypes: [],
      title: 'Proposal',
      description: '',
      tags: ['test', 'tag'],
      authors: [fetchExpectation.items[0]],
      teams: [
        {
          id: 'team-id-1',
          displayName: 'Schipa, A',
        },
      ],
      lastUpdatedPartial: '2020-10-21T13:11:50.000Z',
      sharingStatus: 'Network Only',
      asapFunded: false,
      contactEmails: [],
      labs: [],
    },
  ],
  members: [
    {
      id: 'user-id-1',
      firstName: 'Cristiano',
      lastName: 'Ronaldo',
      avatarUrl: `${config.baseUrl}/api/assets/${config.appName}/uuid-user-id-1`,
      email: 'cristiano@ronaldo.com',
      displayName: 'Cristiano Ronaldo',
      role: 'Lead PI (Core Leadership)',
      labs: [
        { id: 'cd7be4902', name: 'Barcelona' },
        { id: 'cd7be4905', name: 'Glasgow' },
      ],
    },
  ],
  projectTitle:
    'The genome-microbiome axis in the cause of Parkinson disease: Mechanistic insights and therapeutic implications from experimental models and a genetically stratified patient population.',
  proposalURL: '4cfb1b7b-bafe-4fca-b2ab-197e84d98996',
  tools: [],
  labCount: 2,
};

export const getUpdateTeamResponse = (tools: TeamTool[] = []): RestTeam => ({
  id: 'team-id-1',
  data: {
    displayName: { iv: 'Cristiano Ronaldo' },
    applicationNumber: { iv: 'hofded' },
    projectTitle: {
      iv: 'Ce fe kok ob lovkad pim cukiviw lakwujuz vilid camiduci nim ca perkeb mekkaho wuculate re huppoljop.',
    },
    projectSummary: {
      iv: 'Wi dalev fu jusjuh buw nauzi kas ma. Fo ajelo pu vaenusug ezuhsi resdudif ebsofak tav dan mumooz awgabu meki gicub bowec afegeir tozab umefarow.',
    },
    skills: { iv: [] },
    outputs: { iv: [] },
    tools: { iv: tools },
  },
  created: '2020-09-08T16:35:28Z',
  lastModified: '2020-09-08T16:35:28Z',
});

export const getGraphQlTeamResponse = (
  tools: TeamTool[] | null = [],
): { data: ResponseFetchTeam } => ({
  data: {
    findTeamsContent: {
      id: 'team-id-1',
      created: '2020-09-23T20:33:36Z',
      lastModified: '2020-11-26T11:56:04Z',
      flatData: {
        applicationNumber: 'ASAP-000420',
        displayName: 'Schipa, A',
        outputs: [
          {
            id: '4cfb1b7b-bafe-4fca-b2ab-197e84d98996',
            created: '2020-09-17T08:18:01Z',
            lastModified: '2020-10-21T13:11:50.000Z',
            flatData: {
              link: null,
              publishDate: null,
              addedDate: null,
              title: 'Proposal',
              type: 'Proposal',
              tags: ['test', 'tag'],
              authors: [
                getSquidexResearchOutputGraphqlResponseAuthors()[0] as GraphqlResearchOutputAuthors,
              ],
              sharingStatus: 'Network Only',
              asapFunded: 'No',
            },
            referencingTeamsContents: [
              {
                id: 'team-id-1',
                created: '2020-09-17T08:18:01Z',
                lastModified: '2020-10-21T13:11:50Z',
                flatData: {
                  displayName: 'Schipa, A',
                },
              },
            ],
          },
          {
            id: '7198d072-de87-4b80-90ca-4a1abe67952e',
            created: '2020-11-24T16:33:30Z',
            lastModified: '2020-11-26T13:45:49.000Z',
            flatData: {
              link: 'docs.google.com',
              publishDate: null,
              labCatalogNumber: 'http://example.com',
              addedDate: null,
              title: "Team Salzer's intro slide deck",
              type: 'Presentation',
              authors: [
                getSquidexResearchOutputGraphqlResponseAuthors()[1] as GraphqlResearchOutputAuthors,
              ],
              usedInAPublication: 'No',
            },
            referencingTeamsContents: [
              {
                id: 'team-id-1',
                created: '2020-09-17T08:18:01Z',
                lastModified: '2020-10-21T13:11:50Z',
                flatData: {
                  displayName: 'Schipa, A',
                },
              },
              {
                id: 'team-id-2',
                created: '2020-09-17T08:18:01Z',
                lastModified: '2020-10-21T13:11:50Z',
                flatData: {
                  displayName: 'Team, B',
                },
              },
            ],
          },
        ],
        projectSummary: null,
        projectTitle:
          'The genome-microbiome axis in the cause of Parkinson disease: Mechanistic insights and therapeutic implications from experimental models and a genetically stratified patient population.',
        skills: ['Animal resources'],
        proposal: [
          {
            id: '4cfb1b7b-bafe-4fca-b2ab-197e84d98996',
          },
        ],
        tools,
      },
      referencingUsersContents: [
        {
          id: 'user-id-1',
          created: '2020-09-25T09:42:51.132Z',
          lastModified: '2020-09-25T09:42:51.132Z',
          flatData: {
            avatar: [
              {
                id: 'uuid-user-id-1',
              },
            ],
            email: 'cristiano@ronaldo.com',
            firstName: 'Cristiano',
            lastName: 'Ronaldo',
            jobTitle: 'Junior',
            institution: 'Dollar General Corporation',
            connections: [],
            biography: '',
            teams: [
              {
                id: [
                  {
                    id: 'team-id-1',
                    created: '2020-09-23T20:33:36Z',
                    lastModified: '2020-11-26T11:56:04Z',
                    flatData: {
                      displayName: 'Schipa, A',
                    },
                  },
                ],
                role: 'Lead PI (Core Leadership)',
              },
            ],
            questions: [],
            skills: [],
            role: 'Grantee',
            onboarded: true,
            labs: [
              { id: 'cd7be4902', flatData: { name: 'Barcelona' } },
              { id: 'cd7be4905', flatData: { name: 'Glasgow' } },
            ],
          },
        },
      ],
    },
  },
});

export const updateResponseTeam: { total: number; items: RestUser[] } = {
  total: 1,
  items: [
    {
      id: 'user-id-1',
      data: {
        role: { iv: 'Grantee' },
        lastModifiedDate: { iv: '2020-09-25T09:42:51.132Z' },
        email: { iv: 'cristiano@ronaldo.com' },
        firstName: { iv: 'Cristiano' },
        lastName: { iv: 'Ronaldo' },
        jobTitle: { iv: 'Junior' },
        orcid: { iv: '363-98-9330' },
        institution: { iv: 'Dollar General Corporation' },
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
        questions: { iv: [] },
        onboarded: {
          iv: true,
        },
        labs: {
          iv: [
            { id: 'cd7be4902', flatData: { name: 'Barcelona' } },
            { id: 'cd7be4905', flatData: { name: 'Glasgow' } },
          ],
        },
      },
      created: '2020-09-25T09:42:51Z',
      lastModified: '2020-09-25T09:42:51Z',
    },
  ],
};

export const updateExpectation: TeamResponse = {
  id: 'team-id-1',
  displayName: 'Schipa, A',
  lastModifiedDate: '2020-11-26T11:56:04.000Z',
  skills: ['Animal resources'],
  outputs: [
    {
      id: '7198d072-de87-4b80-90ca-4a1abe67952e',
      created: '2020-11-24T16:33:30.000Z',
      link: 'docs.google.com',
      type: 'Presentation',
      subTypes: [],
      title: "Team Salzer's intro slide deck",
      description: '',
      tags: [],
      authors: [fetchExpectation.items[1]],
      teams: [
        {
          id: 'team-id-1',
          displayName: 'Schipa, A',
        },
        {
          id: 'team-id-2',
          displayName: 'Team, B',
        },
      ],
      lastUpdatedPartial: '2020-11-26T13:45:49.000Z',
      sharingStatus: 'Network Only',
      usedInPublication: false,
      contactEmails: [],
      labCatalogNumber: 'http://example.com',
      labs: [],
    },
    {
      id: '4cfb1b7b-bafe-4fca-b2ab-197e84d98996',
      created: '2020-09-17T08:18:01.000Z',
      type: 'Proposal',
      subTypes: [],
      title: 'Proposal',
      description: '',
      tags: ['test', 'tag'],
      authors: [fetchExpectation.items[0]],
      teams: [
        {
          id: 'team-id-1',
          displayName: 'Schipa, A',
        },
      ],
      lastUpdatedPartial: '2020-10-21T13:11:50.000Z',
      sharingStatus: 'Network Only',
      asapFunded: false,
      contactEmails: [],
      labs: [],
    },
  ],
  members: [
    {
      id: 'user-id-1',
      firstName: 'Cristiano',
      lastName: 'Ronaldo',
      avatarUrl: `${config.baseUrl}/api/assets/${config.appName}/uuid-user-id-1`,
      email: 'cristiano@ronaldo.com',
      displayName: 'Cristiano Ronaldo',
      role: 'Lead PI (Core Leadership)',
      labs: [
        { id: 'cd7be4902', name: 'Barcelona' },
        { id: 'cd7be4905', name: 'Glasgow' },
      ],
    },
  ],
  projectTitle:
    'The genome-microbiome axis in the cause of Parkinson disease: Mechanistic insights and therapeutic implications from experimental models and a genetically stratified patient population.',
  proposalURL: '4cfb1b7b-bafe-4fca-b2ab-197e84d98996',
  tools: [],
  labCount: 2,
};

const getTeamsEvent = (
  eventType: string,
  eventName: string,
  data = {
    displayName: { iv: 'Team 1' },
    applicationNumber: { iv: '12345' },
    skills: { iv: [] },
    proposal: { iv: [] },
    projectTitle: { iv: 'Team Project' },
    projectSummary: { iv: '' },
    outputs: { iv: ['5434911260ba'] },
    tools: { iv: [] },
  },
  dataOld = {
    displayName: { iv: 'Team 1' },
    applicationNumber: { iv: '12345' },
    skills: { iv: [] },
    proposal: { iv: [] },
    projectTitle: { iv: 'Team Project' },
    projectSummary: { iv: '' },
    outputs: { iv: ['5434911260ba'] },
    tools: { iv: [] },
  },
): WebhookPayload<Team> => ({
  type: eventName,
  timestamp: '2021-10-05T12:49:49Z',
  payload: {
    $type: 'EnrichedContentEvent',
    type: eventType,
    id: 'teamId',
    created: '2021-10-04T16:55:30Z',
    lastModified: '2021-10-05T12:49:49Z',
    data,
    dataOld,
  },
});

export const getTeamsCreated = getTeamsEvent('Published', 'TeamsPublished');
export const getTeamsUpdated = getTeamsEvent('Updated', 'TeamsUpdated');
export const getTeamsDeleted = getTeamsEvent('Deleted', 'TeamsDeleted');

export const teamResponse: TeamResponse = updateExpectation;
