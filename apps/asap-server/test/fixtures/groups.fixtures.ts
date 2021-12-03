import { ListGroupResponse, GroupResponse } from '@asap-hub/model';
import { config, GraphqlGroup } from '@asap-hub/squidex';
import {
  ResponseFetchGroups,
  ResponseFetchGroup,
} from '../../src/controllers/groups';

export const queryGroupsResponse: { data: ResponseFetchGroups } = {
  data: {
    queryGroupsContentsWithTotal: {
      total: 2,
      items: [
        {
          id: 'group-id-1',
          created: '2020-12-11T14:33:50Z',
          lastModified: '2020-12-11T15:06:26Z',
          version: 42,
          flatData: {
            description: 'A test Group',
            name: "JT's Group",
            tags: ['coding'],
            thumbnail: [
              {
                id: 'uuid-thumbnail-1',
                created: '2020-12-11T14:33:50Z',
                lastModified: '2020-12-11T15:06:26Z',
                version: 42,
              },
            ],
            tools: [
              {
                slack: 'https://example.com/secure-comms',
              },
            ],
            calendars: [
              {
                id: 'calendar-id-1',
                created: '2020-12-11T14:33:50Z',
                lastModified: '2020-12-11T15:06:26Z',
                version: 42,
                flatData: {
                  color: '#B1365F',
                  googleCalendarId: 'hub@asap.science',
                  name: 'ASAP Hub',
                },
              },
            ],
            teams: [
              {
                __typename: 'Teams',
                id: 'team-id-1',
                created: '2020-12-11T14:33:50Z',
                lastModified: '2020-12-11T15:06:26Z',
                version: 42,
                flatData: {
                  applicationNumber: 'ASAP-000592',
                  displayName: 'Lee, M',
                  projectSummary: null,
                  projectTitle:
                    'Senescence in Parkinson’s disease and related disorders',
                  expertiseAndResourceTags: [],
                  proposal: [
                    {
                      id: 'output-id-1',
                    },
                  ],
                  tools: [
                    {
                      name: 'dropbox',
                      url: '  https://example.com/secure-comms',
                    },
                  ],
                },
              },
            ],
            leaders: [
              {
                role: 'Chair',
                user: [
                  {
                    id: 'user-id-1',
                    created: '2020-12-11T14:33:50Z',
                    lastModified: '2020-12-11T15:06:26Z',
                    version: 42,
                    flatData: {
                      avatar: [
                        {
                          id: 'asset-id-1',
                        },
                      ],
                      social: [
                        {
                          github: 'fampinheiro',
                          googleScholar: null,
                          linkedIn: 'fampinheiro',
                          researcherId: null,
                          researchGate: null,
                          twitter: 'fampinheiro',
                        },
                      ],
                      biography:
                        'Filipe is an Engineering Manager who works closely with our clients to ensure process and technical standards improvements. He previously worked at startups and multinational companies, leading tech projects in mobile and web apps, before bringing this gathered experience to YLD.',
                      degree: null,
                      email: 'filipe@yld.io',
                      firstName: 'Filipe',
                      institution: 'YLD',
                      jobTitle: 'Software Engineer',
                      lastModifiedDate: null,
                      lastName: 'Pinheiro',
                      orcid: null,
                      orcidLastModifiedDate: null,
                      orcidLastSyncDate: null,
                      orcidWorks: [],
                      labs: [
                        { id: 'cd7be4904', flatData: { name: 'Manchester' } },
                        { id: 'cd7be4905', flatData: { name: 'Glasgow' } },
                      ],
                      questions: [
                        {
                          question: 'What is the meaning of life?',
                        },
                        {
                          question: 'Question 2',
                        },
                      ],
                      expertiseAndResourceTags: ['React'],
                      expertiseAndResourceDescription:
                        "In addition to his expertise in not for profit management, Todd has scientific experience in animal models and the cell biology of Parkinson's disease.",
                      teams: [
                        {
                          role: 'Co-PI (Core Leadership)',
                          responsibilities: null,
                          mainResearchInterests: null,
                          id: [
                            {
                              __typename: 'Teams',
                              id: 'team-id-2',
                              created: '2020-12-11T14:33:50Z',
                              lastModified: '2020-12-11T15:06:26Z',
                              version: 42,
                              flatData: {
                                displayName: 'Rio, D',
                                proposal: [],
                              },
                            },
                          ],
                        },
                      ],
                    },
                  },
                ],
              },
              {
                role: 'Project Manager',
                user: [
                  {
                    id: 'user-id-2',
                    created: '2020-12-11T14:33:50Z',
                    lastModified: '2020-12-11T15:06:26Z',
                    version: 42,
                    flatData: {
                      avatar: [],
                      social: [
                        {
                          github: 'johnytiago',
                          googleScholar: null,
                          linkedIn: null,
                          researcherId: null,
                          researchGate: null,
                          twitter: null,
                        },
                      ],
                      biography: null,
                      degree: null,
                      email: 'joao.tiago@yld.io',
                      firstName: 'João',
                      institution: 'YLD',
                      jobTitle: null,
                      lastModifiedDate: null,
                      lastName: 'Tiago',
                      orcid: null,
                      orcidLastModifiedDate: null,
                      orcidLastSyncDate: null,
                      orcidWorks: [],
                      questions: [],
                      expertiseAndResourceTags: [],
                      expertiseAndResourceDescription: null,
                      labs: [
                        { id: 'cd7be4902', flatData: { name: 'Barcelona' } },
                        { id: 'cd7be4905', flatData: { name: 'Glasgow' } },
                      ],
                      teams: [],
                    },
                  },
                ],
              },
            ],
          },
        },
        {
          id: 'group-id-2',
          created: '2020-12-11T14:33:50Z',
          lastModified: '2020-12-11T15:06:26Z',
          version: 42,
          flatData: {
            description: 'A test Group',
            name: "FP's Group",
            tags: ['coding'],
            thumbnail: [],
            tools: [
              {
                slack: 'https://example.com/secure-comms',
              },
            ],
            calendars: [
              {
                id: 'calendar-id-1',
                created: '2020-12-11T14:33:50Z',
                lastModified: '2020-12-11T15:06:26Z',
                version: 42,
                flatData: {
                  color: '#B1365F',
                  googleCalendarId: 'hub@asap.science',
                  name: 'ASAP Hub',
                },
              },
            ],
            teams: [],
            leaders: [],
          },
        },
      ],
    },
  },
};

export const listGroupsResponse: ListGroupResponse = {
  total: 2,
  items: [
    {
      id: 'group-id-1',
      createdDate: '2020-12-11T14:33:50.000Z',
      lastModifiedDate: '2020-12-11T15:06:26.000Z',
      name: "JT's Group",
      tags: ['coding'],
      thumbnail: `${config.baseUrl}/api/assets/${config.appName}/uuid-thumbnail-1`,
      description: 'A test Group',
      tools: {
        slack: 'https://example.com/secure-comms',
        googleCalendar:
          'https://calendar.google.com/calendar/r?cid=calendar-id-1',
      },
      teams: [
        {
          id: 'team-id-1',
          displayName: 'Lee, M',
          lastModifiedDate: '2020-12-11T15:06:26.000Z',
          expertiseAndResourceTags: [],
          projectTitle:
            'Senescence in Parkinson’s disease and related disorders',
          proposalURL: 'output-id-1',
          tools: [
            {
              name: 'dropbox',
              url: '  https://example.com/secure-comms',
            },
          ],
        },
      ],
      leaders: [
        {
          user: {
            id: 'user-id-1',
            onboarded: true,
            createdDate: '2020-12-11T14:33:50.000Z',
            displayName: 'Filipe Pinheiro',
            firstName: 'Filipe',
            lastName: 'Pinheiro',
            biography:
              'Filipe is an Engineering Manager who works closely with our clients to ensure process and technical standards improvements. He previously worked at startups and multinational companies, leading tech projects in mobile and web apps, before bringing this gathered experience to YLD.',
            email: 'filipe@yld.io',
            institution: 'YLD',
            jobTitle: 'Software Engineer',
            orcidWorks: [],
            questions: ['What is the meaning of life?', 'Question 2'],
            expertiseAndResourceTags: ['React'],
            expertiseAndResourceDescription:
              "In addition to his expertise in not for profit management, Todd has scientific experience in animal models and the cell biology of Parkinson's disease.",
            lastModifiedDate: '2020-12-11T14:33:50.000Z',
            teams: [
              {
                id: 'team-id-2',
                role: 'Co-PI (Core Leadership)',
                displayName: 'Rio, D',
              },
            ],
            social: {
              github: 'fampinheiro',
              linkedIn: 'fampinheiro',
              twitter: 'fampinheiro',
            },
            avatarUrl: `${config.baseUrl}/api/assets/${config.appName}/asset-id-1`,
            role: 'Guest',
            labs: [
              { id: 'cd7be4904', name: 'Manchester' },
              { id: 'cd7be4905', name: 'Glasgow' },
            ],
          },
          role: 'Chair',
        },
        {
          user: {
            id: 'user-id-2',
            onboarded: true,
            createdDate: '2020-12-11T14:33:50.000Z',
            displayName: 'João Tiago',
            firstName: 'João',
            lastName: 'Tiago',
            email: 'joao.tiago@yld.io',
            institution: 'YLD',
            orcidWorks: [],
            questions: [],
            expertiseAndResourceTags: [],
            lastModifiedDate: '2020-12-11T14:33:50.000Z',
            teams: [],
            social: { github: 'johnytiago' },
            role: 'Guest',
            labs: [
              { id: 'cd7be4902', name: 'Barcelona' },
              { id: 'cd7be4905', name: 'Glasgow' },
            ],
          },
          role: 'Project Manager',
        },
      ],
      calendars: [
        { id: 'hub@asap.science', color: '#B1365F', name: 'ASAP Hub' },
      ],
    },
    {
      id: 'group-id-2',
      createdDate: '2020-12-11T14:33:50.000Z',
      lastModifiedDate: '2020-12-11T15:06:26.000Z',
      name: "FP's Group",
      tags: ['coding'],
      description: 'A test Group',
      tools: {
        slack: 'https://example.com/secure-comms',
        googleCalendar:
          'https://calendar.google.com/calendar/r?cid=calendar-id-1',
      },
      teams: [],
      leaders: [],
      calendars: [
        { id: 'hub@asap.science', color: '#B1365F', name: 'ASAP Hub' },
      ],
    },
  ],
};

export const getGraphqlGroup = (): GraphqlGroup => ({
  id: 'group-id-1',
  created: '2020-12-11T14:33:50Z',
  lastModified: '2020-12-11T15:06:26Z',
  version: 42,
  flatData: {
    description: 'A test Group',
    name: "JT's Group",
    tags: ['coding'],
    thumbnail: [
      {
        id: 'uuid-thumbnail-1',
        created: '2020-12-11T14:33:50Z',
        lastModified: '2020-12-11T15:06:26Z',
        version: 42,
      },
    ],
    tools: [
      {
        slack: 'https://example.com/secure-comms',
      },
    ],
    calendars: [
      {
        id: 'calendar-id-1',
        created: '2020-12-11T14:33:50Z',
        lastModified: '2020-12-11T15:06:26Z',
        version: 42,
        flatData: {
          color: '#B1365F',
          googleCalendarId: 'hub@asap.science',
          name: 'ASAP Hub',
        },
      },
    ],
    teams: [
      {
        __typename: 'Teams',
        id: 'team-id-1',
        created: '2020-12-11T14:33:50Z',
        lastModified: '2020-12-11T15:06:26Z',
        version: 42,
        flatData: {
          applicationNumber: 'ASAP-000592',
          displayName: 'Lee, M',
          projectSummary: null,
          projectTitle:
            'Senescence in Parkinson’s disease and related disorders',
          expertiseAndResourceTags: [],
          proposal: [
            {
              id: 'output-id-1',
            },
          ],
          tools: [
            {
              name: 'dropbox',
              url: '  https://example.com/secure-comms',
            },
          ],
        },
      },
    ],
    leaders: [
      {
        role: 'Chair',
        user: [
          {
            id: 'user-id-1',
            created: '2020-12-11T14:33:50Z',
            lastModified: '2020-12-11T15:06:26Z',
            version: 42,
            flatData: {
              avatar: [
                {
                  id: 'asset-id-1',
                },
              ],
              social: [
                {
                  github: 'fampinheiro',
                  googleScholar: null,
                  linkedIn: 'fampinheiro',
                  researcherId: null,
                  researchGate: null,
                  twitter: 'fampinheiro',
                },
              ],
              biography:
                'Filipe is an Engineering Manager who works closely with our clients to ensure process and technical standards improvements. He previously worked at startups and multinational companies, leading tech projects in mobile and web apps, before bringing this gathered experience to YLD.',
              degree: null,
              email: 'filipe@yld.io',
              firstName: 'Filipe',
              institution: 'YLD',
              jobTitle: 'Software Engineer',
              lastModifiedDate: null,
              lastName: 'Pinheiro',
              orcid: null,
              orcidLastModifiedDate: null,
              orcidLastSyncDate: null,
              orcidWorks: [],
              labs: [
                { id: 'cd7be4904', flatData: { name: 'Manchester' } },
                { id: 'cd7be4905', flatData: { name: 'Glasgow' } },
              ],
              questions: [
                {
                  question: 'What is the meaning of life?',
                },
                {
                  question: 'Question 2',
                },
              ],
              expertiseAndResourceTags: ['React'],
              expertiseAndResourceDescription:
                "In addition to his expertise in not for profit management, Todd has scientific experience in animal models and the cell biology of Parkinson's disease.",
              teams: [
                {
                  role: 'Co-PI (Core Leadership)',
                  responsibilities: null,
                  mainResearchInterests: null,
                  id: [
                    {
                      __typename: 'Teams',
                      id: 'team-id-2',
                      created: '2020-12-11T14:33:50Z',
                      lastModified: '2020-12-11T15:06:26Z',
                      version: 42,
                      flatData: {
                        displayName: 'Rio, D',
                        proposal: [],
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
      {
        role: 'Project Manager',
        user: [
          {
            id: 'user-id-2',
            created: '2020-12-11T14:33:50Z',
            lastModified: '2020-12-11T15:06:26Z',
            version: 42,
            flatData: {
              avatar: [],
              social: [
                {
                  github: 'johnytiago',
                  googleScholar: null,
                  linkedIn: null,
                  researcherId: null,
                  researchGate: null,
                  twitter: null,
                },
              ],
              biography: null,
              degree: null,
              email: 'joao.tiago@yld.io',
              firstName: 'João',
              institution: 'YLD',
              jobTitle: null,
              lastModifiedDate: null,
              lastName: 'Tiago',
              orcid: null,
              orcidLastModifiedDate: null,
              orcidLastSyncDate: null,
              orcidWorks: [],
              questions: [],
              expertiseAndResourceTags: [],
              expertiseAndResourceDescription: null,
              labs: [
                { id: 'cd7be4902', flatData: { name: 'Barcelona' } },
                { id: 'cd7be4905', flatData: { name: 'Glasgow' } },
              ],
              teams: [],
            },
          },
        ],
      },
    ],
  },
});

export const getResponseFetchGroup = (): { data: ResponseFetchGroup } => ({
  data: {
    findGroupsContent: getGraphqlGroup(),
  },
});

export const findGroupResponse: { data: ResponseFetchGroup } = {
  data: {
    findGroupsContent:
      queryGroupsResponse.data.queryGroupsContentsWithTotal.items[0]!,
  },
};

export const getGroupResponse = (): GroupResponse => ({
  id: 'group-id-1',
  createdDate: '2020-12-11T14:33:50.000Z',
  lastModifiedDate: '2020-12-11T15:06:26.000Z',
  name: "JT's Group",
  tags: ['coding'],
  thumbnail: `${config.baseUrl}/api/assets/${config.appName}/uuid-thumbnail-1`,
  description: 'A test Group',
  tools: {
    slack: 'https://example.com/secure-comms',
    googleCalendar: 'https://calendar.google.com/calendar/r?cid=calendar-id-1',
  },
  teams: [
    {
      id: 'team-id-1',
      displayName: 'Lee, M',
      lastModifiedDate: '2020-12-11T15:06:26.000Z',
      expertiseAndResourceTags: [],
      projectTitle: 'Senescence in Parkinson’s disease and related disorders',
      proposalURL: 'output-id-1',
      tools: [
        {
          name: 'dropbox',
          url: '  https://example.com/secure-comms',
        },
      ],
    },
  ],
  leaders: [
    {
      user: {
        id: 'user-id-1',
        onboarded: true,
        createdDate: '2020-12-11T14:33:50.000Z',
        displayName: 'Filipe Pinheiro',
        firstName: 'Filipe',
        lastName: 'Pinheiro',
        biography:
          'Filipe is an Engineering Manager who works closely with our clients to ensure process and technical standards improvements. He previously worked at startups and multinational companies, leading tech projects in mobile and web apps, before bringing this gathered experience to YLD.',
        email: 'filipe@yld.io',
        institution: 'YLD',
        jobTitle: 'Software Engineer',
        orcidWorks: [],
        questions: ['What is the meaning of life?', 'Question 2'],
        expertiseAndResourceTags: ['React'],
        expertiseAndResourceDescription:
          "In addition to his expertise in not for profit management, Todd has scientific experience in animal models and the cell biology of Parkinson's disease.",
        lastModifiedDate: '2020-12-11T14:33:50.000Z',
        teams: [
          {
            id: 'team-id-2',
            role: 'Co-PI (Core Leadership)',
            displayName: 'Rio, D',
          },
        ],
        social: {
          github: 'fampinheiro',
          linkedIn: 'fampinheiro',
          twitter: 'fampinheiro',
        },
        avatarUrl: `${config.baseUrl}/api/assets/${config.appName}/asset-id-1`,
        role: 'Guest',
        labs: [
          { id: 'cd7be4904', name: 'Manchester' },
          { id: 'cd7be4905', name: 'Glasgow' },
        ],
      },
      role: 'Chair',
    },
    {
      user: {
        id: 'user-id-2',
        onboarded: true,
        createdDate: '2020-12-11T14:33:50.000Z',
        displayName: 'João Tiago',
        firstName: 'João',
        lastName: 'Tiago',
        email: 'joao.tiago@yld.io',
        institution: 'YLD',
        orcidWorks: [],
        questions: [],
        expertiseAndResourceTags: [],
        lastModifiedDate: '2020-12-11T14:33:50.000Z',
        teams: [],
        social: { github: 'johnytiago' },
        role: 'Guest',
        labs: [
          { id: 'cd7be4902', name: 'Barcelona' },
          { id: 'cd7be4905', name: 'Glasgow' },
        ],
      },
      role: 'Project Manager',
    },
  ],
  calendars: [{ id: 'hub@asap.science', color: '#B1365F', name: 'ASAP Hub' }],
});

export const groupResponse: GroupResponse = listGroupsResponse.items[0]!;
