import { ListGroupResponse, GroupResponse } from '@asap-hub/model';
import { config } from '@asap-hub/squidex';
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
          flatData: {
            description: 'A test Group',
            name: "JT's Group",
            tags: ['coding'],
            thumbnail: [
              {
                id: 'uuid-thumbnail-1',
                created: '2020-12-11T14:33:50Z',
                lastModified: '2020-12-11T15:06:26Z',
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
                flatData: {
                  color: '#B1365F',
                  id: 'hub@asap.science',
                  name: 'ASAP Hub',
                },
              },
            ],
            teams: [
              {
                id: 'team-id-1',
                created: '2020-12-11T14:33:50Z',
                lastModified: '2020-12-11T15:06:26Z',
                flatData: {
                  applicationNumber: 'ASAP-000592',
                  displayName: 'Lee, M',
                  outputs: [
                    {
                      id: 'output-id-1',
                      created: '2020-12-11T14:33:18Z',
                      flatData: {
                        link: null,
                        publishDate: null,
                        addedDate: null,
                        title: 'Proposal',
                        type: 'Proposal',
                        tags: ['test', 'tag'],
                      },
                    },
                  ],
                  projectSummary: null,
                  projectTitle:
                    'Senescence in Parkinson’s disease and related disorders',
                  skills: [],
                  proposal: [
                    {
                      id: 'output-id-1',
                    },
                  ],
                  tools: [],
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
                      location: 'Lisbon, Portugal',
                      orcid: null,
                      orcidLastModifiedDate: null,
                      orcidLastSyncDate: null,
                      orcidWorks: [],
                      questions: [
                        {
                          question: 'What is the meaning of life?',
                        },
                        {
                          question: 'Question 2',
                        },
                      ],
                      skills: ['React'],
                      skillsDescription:
                        "In addition to his expertise in not for profit management, Todd has scientific experience in animal models and the cell biology of Parkinson's disease.",
                      teams: [
                        {
                          role: 'Co-PI (Core Leadership)',
                          responsibilities: null,
                          approach: null,
                          id: [
                            {
                              id: 'team-id-2',
                              created: '2020-12-11T14:33:50Z',
                              lastModified: '2020-12-11T15:06:26Z',
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
                      location: null,
                      orcid: null,
                      orcidLastModifiedDate: null,
                      orcidLastSyncDate: null,
                      orcidWorks: [],
                      questions: [],
                      skills: [],
                      skillsDescription: null,
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
                flatData: {
                  color: '#B1365F',
                  id: 'hub@asap.science',
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

export const queryGroupsExpectation: ListGroupResponse = {
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
          skills: [],
          outputs: [
            {
              id: 'output-id-1',
              created: '2020-12-11T14:33:18.000Z',
              type: 'Proposal',
              title: 'Proposal',
              description: '',
              tags: ['test', 'tag'],
              team: { id: 'team-id-1', displayName: 'Lee, M' },
              teams: [{ id: 'team-id-1', displayName: 'Lee, M' }],
            },
          ],
          projectTitle:
            'Senescence in Parkinson’s disease and related disorders',
          proposalURL: 'output-id-1',
        },
      ],
      leaders: [
        {
          user: {
            id: 'user-id-1',
            createdDate: '2020-12-11T14:33:50.000Z',
            displayName: 'Filipe Pinheiro',
            firstName: 'Filipe',
            lastName: 'Pinheiro',
            biography:
              'Filipe is an Engineering Manager who works closely with our clients to ensure process and technical standards improvements. He previously worked at startups and multinational companies, leading tech projects in mobile and web apps, before bringing this gathered experience to YLD.',
            email: 'filipe@yld.io',
            institution: 'YLD',
            jobTitle: 'Software Engineer',
            location: 'Lisbon, Portugal',
            orcidWorks: [],
            questions: ['What is the meaning of life?', 'Question 2'],
            skills: ['React'],
            skillsDescription:
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
          },
          role: 'Chair',
        },
        {
          user: {
            id: 'user-id-2',
            createdDate: '2020-12-11T14:33:50.000Z',
            displayName: 'João Tiago',
            firstName: 'João',
            lastName: 'Tiago',
            email: 'joao.tiago@yld.io',
            institution: 'YLD',
            orcidWorks: [],
            questions: [],
            skills: [],
            lastModifiedDate: '2020-12-11T14:33:50.000Z',
            teams: [],
            social: { github: 'johnytiago' },
            role: 'Guest',
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

export const findGroupResponse: { data: ResponseFetchGroup } = {
  data: {
    findGroupsContent:
      queryGroupsResponse.data.queryGroupsContentsWithTotal.items[0],
  },
};

export const findGroupExpectation: GroupResponse =
  queryGroupsExpectation.items[0];
