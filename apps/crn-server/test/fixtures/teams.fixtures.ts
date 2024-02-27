import {
  ContentfulWebhookPayload,
  ContentfulWebhookPublishPayload,
  ContentfulWebhookUnpublishPayload,
  FetchTeamsQuery as ContentfulFetchTeamsQuery,
  FetchTeamByIdQuery,
} from '@asap-hub/contentful';
import {
  ListTeamResponse,
  TeamCreateDataObject,
  TeamDataObject,
  TeamEvent,
  TeamListItemDataObject,
  TeamListItemResponse,
  TeamResponse,
  WebhookDetail,
} from '@asap-hub/model';
import { EventBridgeEvent } from 'aws-lambda';
import { TeamPayload } from '../../src/handlers/event-bus';
import { createEventBridgeEventMock } from '../helpers/events';

export const getContentfulGraphql = (teamById = false) => ({
  Teams: () =>
    teamById ? getContentfulGraphqlTeamById() : getContentfulGraphqlTeam(),
  TeamMembershipCollection: () => getContentfulGraphqlTeamMemberships(),
  Users: () => getContentfulGraphqlTeamMembers(),
  UsersLabsCollection: () => getContentfulGraphqlTeamMemberLabs(),
});

export const getContentfulGraphqlTeamById = (): NonNullable<
  NonNullable<FetchTeamByIdQuery['teams']>
> => ({
  sys: {
    id: 'team-id-0',
    publishedAt: '2020-11-26T11:56:04.000Z',
  },
  displayName: 'Team A',
  inactiveSince: null,
  projectSummary: null,
  projectTitle:
    'The genome-microbiome axis in the cause of Parkinson disease: Mechanistic insights and therapeutic implications from experimental models and a genetically stratified patient population.',
  researchTagsCollection: {
    items: [{ sys: { id: 'tag-1' }, name: 'Animal resources 1' }],
  },
  toolsCollection: {
    items: [],
  },
  proposal: {
    sys: {
      id: '4cfb1b7b-bafe-4fca-b2ab-197e84d98996',
    },
  },
  linkedFrom: {
    teamMembershipCollection: {
      items: [
        {
          ...getContentfulGraphqlTeamMemberships().items[0],
          linkedFrom: {
            usersCollection: {
              items: [
                {
                  ...getContentfulGraphqlTeamMembers(),
                  labsCollection: getContentfulGraphqlTeamMemberLabs(),
                },
              ],
            },
          },
        },
      ],
    },
  },
});

export const getContentfulGraphqlTeam = (): NonNullable<
  NonNullable<ContentfulFetchTeamsQuery['teamsCollection']>['items'][number]
> => ({
  sys: {
    id: 'team-id-0',
  },
  displayName: 'Team A',
  inactiveSince: null,
  projectTitle:
    'The genome-microbiome axis in the cause of Parkinson disease: Mechanistic insights and therapeutic implications from experimental models and a genetically stratified patient population.',
  researchTagsCollection: {
    items: [],
  },
  linkedFrom: {
    teamMembershipCollection: {
      items: [
        {
          ...getContentfulGraphqlTeamMemberships().items[0],
          linkedFrom: {
            usersCollection: {
              items: [
                {
                  ...getContentfulGraphqlTeamMembers(),
                  labsCollection: getContentfulGraphqlTeamMemberLabs(),
                },
              ],
            },
          },
        },
      ],
    },
  },
});

export const getContentfulGraphqlTeamMemberships = () => ({
  total: 1,
  items: [
    {
      role: 'Lead PI (Core Leadership)',
      inactiveSinceDate: null,
    },
  ],
});

export const getContentfulGraphqlTeamMembers = () => ({
  sys: {
    id: 'user-id-1',
  },
  email: 'H@rdy.io',
  firstName: 'Tom',
  lastName: 'Hardy',
  avatar: null,
  alumniSinceDate: '2020-09-23T20:45:22.000Z',
  onboarded: true,
});

export const getContentfulGraphqlTeamMemberLabs = () => ({
  total: 2,
  items: [
    { sys: { id: 'cd7be4902' }, name: 'Brighton' },
    { sys: { id: 'cd7be4903' }, name: 'Liverpool' },
  ],
});

export const getContentfulTeamsGraphqlResponse =
  (): ContentfulFetchTeamsQuery => ({
    teamsCollection: {
      total: 1,
      items: [getContentfulGraphqlTeam()],
    },
  });

export const getListTeamResponse = (): ListTeamResponse => ({
  total: 1,
  items: [getTeamListItemResponse()],
});

export const getTeamDataObject = (): TeamDataObject => ({
  id: 'team-id-0',
  displayName: 'Team A',
  lastModifiedDate: '2020-11-26T11:56:04.000Z',
  labCount: 2,
  tags: [
    {
      id: 'tag-1',
      name: 'Animal resources 1',
    },
  ],
  members: [
    {
      id: 'user-id-1',
      alumniSinceDate: '2020-09-23T20:45:22.000Z',
      email: 'H@rdy.io',
      firstName: 'Tom',
      lastName: 'Hardy',
      displayName: 'Tom Hardy',
      role: 'Lead PI (Core Leadership)',
      avatarUrl: undefined,
      labs: [
        { id: 'cd7be4902', name: 'Brighton' },
        { id: 'cd7be4903', name: 'Liverpool' },
      ],
    },
  ],
  projectTitle:
    'The genome-microbiome axis in the cause of Parkinson disease: Mechanistic insights and therapeutic implications from experimental models and a genetically stratified patient population.',
  proposalURL: '4cfb1b7b-bafe-4fca-b2ab-197e84d98996',
  tools: [],
});

export const getTeamListItemDataObject = (): TeamListItemDataObject => ({
  id: 'team-id-0',
  displayName: 'Team A',
  labCount: 2,
  tags: [],
  memberCount: 1,
  projectTitle:
    'The genome-microbiome axis in the cause of Parkinson disease: Mechanistic insights and therapeutic implications from experimental models and a genetically stratified patient population.',
});

export const getTeamResponse = (): TeamResponse => getTeamDataObject();
export const getTeamListItemResponse = (): TeamListItemResponse =>
  getTeamListItemDataObject();

export type TeamEventGenerator = (
  id: string,
) => EventBridgeEvent<TeamEvent, TeamPayload>;

export const getTeamUnpublishedEvent: TeamEventGenerator = (id: string) =>
  getTeamEvent(id, 'TeamsUnpublished');

export const getTeamPublishedEvent: TeamEventGenerator = (id: string) =>
  getTeamEvent(id, 'TeamsPublished');

export const getTeamContentfulWebhookDetail = (
  id: string,
): WebhookDetail<ContentfulWebhookPayload<'teams'>> => ({
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
        id: 'teams',
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

export const getTeamEvent = (
  id: string,
  eventType: TeamEvent,
): EventBridgeEvent<
  TeamEvent,
  WebhookDetail<ContentfulWebhookPayload<'teams'>>
> =>
  createEventBridgeEventMock(getTeamContentfulWebhookDetail(id), eventType, id);

export const getTeamCreateDataObject = (): TeamCreateDataObject => ({
  applicationNumber: 'ASAP-000420',
  displayName: 'Team A',
  inactiveSince: undefined,
  projectSummary: 'project-summary',
  projectTitle:
    'The genome-microbiome axis in the cause of Parkinson disease: Mechanistic insights and therapeutic implications from experimental models and a genetically stratified patient population.',
  expertiseAndResourceTags: ['Animal resources'],
  tools: [
    {
      name: 'Team Scherzer Slack Channel',
      description: 'Connect with the team on the private slack channel',
      url: 'https://scherzerlab.slack.com/archives/C019B8W86NQ',
    },
  ],
  researchOutputIds: [],
});

export const getTeamPublishContentfulWebhookPayload =
  (): ContentfulWebhookPublishPayload<'teams'> => ({
    metadata: {
      tags: [],
    },
    sys: {
      type: 'Entry',
      id: '2i3zL0KG5pjxnNQpDOqf01',
      space: {
        sys: {
          type: 'Link',
          linkType: 'Space',
          id: '5v6w5j61tndm',
        },
      },
      environment: {
        sys: {
          id: 'crn-2802',
          type: 'Link',
          linkType: 'Environment',
        },
      },
      contentType: {
        sys: {
          type: 'Link',
          linkType: 'ContentType',
          id: 'teams',
        },
      },
      createdBy: {
        sys: {
          type: 'Link',
          linkType: 'User',
          id: '1W39zODWXRZZPH4On1MQoS',
        },
      },
      updatedBy: {
        sys: {
          type: 'Link',
          linkType: 'User',
          id: '1W39zODWXRZZPH4On1MQoS',
        },
      },
      revision: 1,
      createdAt: '2023-03-22T15:40:48.930Z',
      updatedAt: '2023-03-22T15:40:48.930Z',
    },
    fields: {
      displayName: {
        'en-US': 'team 1',
      },
      applicationNumber: {
        'en-US': 'ASAP',
      },
      projectTitle: {
        'en-US': 'Test title',
      },
    },
  });

export const getTeamUnpublishContentfulWebhookPayload =
  (): ContentfulWebhookUnpublishPayload<'teams'> => ({
    sys: {
      type: 'DeletedEntry',
      id: '4fTQlBcDyPBvUIwpjm96JU',
      space: {
        sys: {
          type: 'Link',
          linkType: 'Space',
          id: '5v6w5j61tndm',
        },
      },
      environment: {
        sys: {
          id: 'crn-2802',
          type: 'Link',
          linkType: 'Environment',
        },
      },
      contentType: {
        sys: {
          type: 'Link',
          linkType: 'ContentType',
          id: 'teams',
        },
      },
      revision: 2,
      createdAt: '2023-03-23T08:54:29.958Z',
      updatedAt: '2023-03-23T08:54:29.958Z',
      deletedAt: '2023-03-23T08:54:29.958Z',
    },
  });
