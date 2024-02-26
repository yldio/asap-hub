import {
  ContentfulWebhookPayload,
  FetchInterestGroupByIdQuery,
} from '@asap-hub/contentful';
import {
  InterestGroupDataObject,
  InterestGroupResponse,
  InterestGroupLeader,
  ListInterestGroupResponse,
  InterestGroupEvent,
  WebhookDetail,
} from '@asap-hub/model';
import { EventBridgeEvent } from 'aws-lambda';
import { createEventBridgeEventMock } from '../helpers/events';
import { getContentfulGraphqlTeam } from './teams.fixtures';

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
      thumbnail: `https://www.contentful.com/api/assets/asap-crn/uuid-thumbnail-1`,
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
          expertiseAndResourceTags: [],
          projectTitle:
            'Senescence in Parkinson’s disease and related disorders',
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

export const getInterestGroupDataObject = (): InterestGroupDataObject => ({
  id: 'group-id-1',
  active: true,
  createdDate: '2020-12-11T14:33:50.000Z',
  lastModifiedDate: '2020-12-11T15:06:26.000Z',
  name: "JT's Group",
  tags: [
    {
  "id": "Hello World",
  "name": "Hello World",
  },
 {
  "id": "Hello World",
  "name": "Hello World",
  }
],
  thumbnail: `https://www.contentful.com/api/assets/asap-crn/uuid-thumbnail-1`,
  description: 'A test Group',
  tools: {
    slack: 'https://example.com/secure-comms',
    googleCalendar: 'https://calendar.google.com/calendar/r?cid=calendar-id-1',
  },
  teams: [
    {
      id: 'team-id-0',
      displayName: 'Team A',
      tags: [],
      projectTitle:
        'The genome-microbiome axis in the cause of Parkinson disease: Mechanistic insights and therapeutic implications from experimental models and a genetically stratified patient population.',
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
  tags: [],
  thumbnail: {
    url: `https://www.contentful.com/api/assets/asap-crn/uuid-thumbnail-1`,
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

export const getInterestGroupContentfulWebhookDetail = (
  id: string,
): WebhookDetail<ContentfulWebhookPayload<'interestGroups'>> => ({
  resourceId: id,
  metadata: {
    tags: [],
  },
  sys: {
    type: 'Entry',
    id: 'fc496d00-053f-44fd-9bac-68dd9d959848',
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: '5v6w5j61tndm',
      },
    },
    environment: {
      sys: {
        id: 'crn-3046',
        type: 'Link',
        linkType: 'Environment',
      },
    },
    contentType: {
      sys: {
        type: 'Link',
        linkType: 'ContentType',
        id: 'interestGroups',
      },
    },
    createdBy: {
      sys: {
        type: 'Link',
        linkType: 'User',
        id: '2SHvngTJ24kxZGAPDJ8J1y',
      },
    },
    updatedBy: {
      sys: {
        type: 'Link',
        linkType: 'User',
        id: '2SHvngTJ24kxZGAPDJ8J1y',
      },
    },
    revision: 14,
    createdAt: '2023-05-17T13:39:03.250Z',
    updatedAt: '2023-05-18T16:17:36.425Z',
  },
  fields: {},
});

export const getInterestGroupEvent = (
  id: string,
  eventType: InterestGroupEvent,
): EventBridgeEvent<
  InterestGroupEvent,
  WebhookDetail<ContentfulWebhookPayload<'interestGroups'>>
> =>
  createEventBridgeEventMock(
    getInterestGroupContentfulWebhookDetail(id),
    eventType,
    id,
  );
