import { FetchInterestGroupByIdQuery } from '@asap-hub/contentful';
import {
  InterestGroupDataObject,
  InterestGroupResponse,
  InterestGroupLeader,
  ListInterestGroupResponse,
  GroupEvent,
} from '@asap-hub/model';
import { RestInterestGroup } from '@asap-hub/squidex';
import { EventBridgeEvent } from 'aws-lambda';
import { appName, baseUrl } from '../../src/config';
import { InterestGroupPayload } from '../../src/handlers/event-bus';
import { createEventBridgeEventMock } from '../helpers/events';
import {
  getContentfulGraphqlTeam,
} from './teams.fixtures';

export const queryInterestGroupsResponse = {
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
                      alumniSinceDate: null,
                      avatar: [
                        {
                          id: 'asset-id-1',
                        },
                      ],
                      email: 'filipe@yld.io',
                      firstName: 'Filipe',
                      lastModifiedDate: null,
                      lastName: 'Pinheiro',
                      jobTitle: 'Manager',
                      institution: 'MJFF',
                      teams: [
                        {
                          role: 'Co-PI (Core Leadership)',
                          id: [
                            {
                              __typename: 'Teams',
                              id: 'team-id-2',
                              created: '2020-12-11T14:33:50Z',
                              lastModified: '2020-12-11T15:06:26Z',
                              version: 42,
                              flatData: {
                                displayName: 'Rio, D',
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
                      alumniSinceDate: null,
                      avatar: [],
                      email: 'joao.tiago@yld.io',
                      firstName: 'João',
                      lastModifiedDate: null,
                      lastName: 'Tiago',
                      jobTitle: 'Manager',
                      institution: 'MJFF',
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

export const listInterestGroupsResponse: ListInterestGroupResponse = {
  total: 2,
  items: [
    {
      id: 'group-id-1',
      active: true,
      createdDate: '2020-12-11T14:33:50.000Z',
      lastModifiedDate: '2020-12-11T15:06:26.000Z',
      name: "JT's Group",
      tags: ['coding'],
      thumbnail: `${baseUrl}/api/assets/${appName}/uuid-thumbnail-1`,
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
            displayName: 'Filipe Pinheiro',
            firstName: 'Filipe',
            lastName: 'Pinheiro',
            email: 'filipe@yld.io',
            teams: [
              {
                id: 'team-id-2',
                role: 'Co-PI (Core Leadership)',
                displayName: 'Rio, D',
              },
            ],
          },
          role: 'Chair',
        },
        {
          user: {
            id: 'user-id-2',
            displayName: 'João Tiago',
            firstName: 'João',
            lastName: 'Tiago',
            email: 'joao.tiago@yld.io',
            teams: [],
          },
          role: 'Project Manager',
        },
      ],
      contactEmails: ['joao.tiago@yld.io'],
      calendars: [
        {
          id: 'hub@asap.science',
          color: '#B1365F',
          name: 'ASAP Hub',
          interestGroups: [],
          workingGroups: [],
        },
      ],
    },
    {
      id: 'group-id-2',
      active: true,
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
      contactEmails: [],
      calendars: [
        {
          id: 'hub@asap.science',
          color: '#B1365F',
          name: 'ASAP Hub',
          interestGroups: [],
          workingGroups: [],
        },
      ],
    },
  ],
};

const getLeaderResponse = (): InterestGroupLeader['user'] => ({
  id: 'user-id-1',
  alumniSinceDate: undefined,
  email: 'H@rdy.io',
  firstName: 'Tom',
  lastName: 'Hardy',
  displayName: 'Tom Hardy',
  teams: [
    {
      id: 'team-id-0',
      displayName: 'Team A',
      role: 'Project Manager',
      teamInactiveSince: '',
    },
  ],
});

export const getInterestGroupResponse = (): InterestGroupResponse =>
  getInterestGroupDataObject();

export const getListInterestGroupResponse = (): ListInterestGroupResponse => ({
  total: 1,
  items: [getInterestGroupResponse()],
});

export const getInterestGroupPayload = (
  id: string,
  type: GroupEvent,
): InterestGroupPayload => ({
  type,
  timestamp: '2020-12-11T15:06:26Z',
  resourceId: id,
  payload: {
    $type: 'EnrichedContentEvent',
    type: 'Updated',
    id,
    created: '2020-12-11T14:33:50Z',
    lastModified: '2020-12-11T15:06:26Z',
    version: 42,
    data: {} as RestInterestGroup['data'],
  },
});

export const getInterestGroupEvent = (
  id: string,
  eventType: GroupEvent,
): EventBridgeEvent<GroupEvent, InterestGroupPayload> =>
  createEventBridgeEventMock(
    getInterestGroupPayload(id, eventType),
    eventType,
    id,
  );

export const getInterestGroupDataObject = (): InterestGroupDataObject => ({
  id: 'group-id-1',
  active: true,
  createdDate: '2020-12-11T14:33:50.000Z',
  lastModifiedDate: '2020-12-11T15:06:26.000Z',
  name: "JT's Group",
  tags: ['coding'],
  thumbnail: `${baseUrl}/api/assets/${appName}/uuid-thumbnail-1`,
  description: 'A test Group',
  tools: {
    slack: 'https://example.com/secure-comms',
    googleCalendar: 'https://calendar.google.com/calendar/r?cid=calendar-id-1',
  },
  teams: [
    {
      id: 'team-id-0',
      displayName: 'Team A',
      lastModifiedDate: '2020-11-26T11:56:04.000Z',
      expertiseAndResourceTags: ['Animal resources'],

      projectTitle:
        'The genome-microbiome axis in the cause of Parkinson disease: Mechanistic insights and therapeutic implications from experimental models and a genetically stratified patient population.',
      proposalURL: '4cfb1b7b-bafe-4fca-b2ab-197e84d98996',
      tools: [],
    },
  ],
  leaders: [
    {
      user: getLeaderResponse(),
      role: 'Chair',
    },
    {
      user: getLeaderResponse(),
      role: 'Project Manager',
    },
  ],
  contactEmails: ['H@rdy.io'],
  calendars: [
    {
      id: 'hub@asap.science',
      color: '#B1365F',
      name: 'ASAP Hub',
      interestGroups: [],
      workingGroups: [],
    },
  ],
});

export const getContentfulGraphql = () => {
  return {
    InterestGroupsCollection: () => ({ total: 1, items: [{}] }),
    InterestGroups: () => getContentfulGraphqlInterestGroup(),
    Users: () => getContentfulGraphQLLeader(),
    Teams: () => getContentfulGraphqlTeam(),
  };
};

const getContentfulGraphQLLeader = () => ({
  sys: {
    id: 'user-id-1',
    publishedAt: '2021-09-23T20:45:22.000Z',
    firstPublishedAt: '2020-09-23T20:45:22Z',
  },
  alumniSinceDate: null,
  email: 'H@rdy.io',
  firstName: 'Tom',
  lastName: 'Hardy',
  teamsCollection: {
    items: [
      {
        role: 'Project Manager',
        inactiveSinceDate: null,
        team: {
          sys: {
            id: 'team-id-0',
          },
          displayName: 'Team A',
          inactiveSince: null,
        },
      },
    ],
  },
  avatar: {
    url: null,
  },
});

export const getContentfulGraphqlInterestGroup = (): NonNullable<
  FetchInterestGroupByIdQuery['interestGroups']
> => ({
  sys: {
    id: 'group-id-1',
    publishedAt: '2020-12-11T15:06:26.000Z',
    firstPublishedAt: '2020-12-11T14:33:50.000Z',
  },
  active: true,
  name: "JT's Group",
  tags: ['coding'],
  thumbnail: {
    url: `${baseUrl}/api/assets/${appName}/uuid-thumbnail-1`,
  },
  description: 'A test Group',
  slack: 'https://example.com/secure-comms',
  googleDrive: null,
  leadersCollection: {
    items: [
      {
        sys: {
          id: 'user-id-1',
        },
        role: 'Chair',
        inactiveSinceDate: null,
        user: getContentfulGraphQLLeader(),
      },
      {
        sys: {
          id: 'user-id-2',
        },
        role: 'Project Manager',
        inactiveSinceDate: null,
        user: getContentfulGraphQLLeader(),
      },
    ],
  },
  teamsCollection: {
    items: [getContentfulGraphqlTeam()],
  },
  calendar: {
    sys: {
      id: 'calendar-id-1',
    },
    googleCalendarId: 'hub@asap.science',
    color: '#B1365F',
    name: 'ASAP Hub',
  },
  lastUpdated: '2020-12-11T15:06:26.000Z',
});
