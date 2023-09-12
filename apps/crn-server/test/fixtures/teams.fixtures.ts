import {
  ContentfulWebhookPublishPayload,
  ContentfulWebhookUnpublishPayload,
  FetchTeamsQuery as ContentfulFetchTeamsQuery,
} from '@asap-hub/contentful';
import {
  ListTeamResponse,
  TeamCreateDataObject,
  TeamDataObject,
  TeamEvent,
  TeamResponse,
} from '@asap-hub/model';
import { EventBridgeEvent } from 'aws-lambda';
import { TeamPayload } from '../../src/handlers/event-bus';
import { createEventBridgeEventMock } from '../helpers/events';

export const getContentfulGraphql = () => ({
  Teams: () => getContentfulGraphqlTeam(),
  TeamMembershipCollection: () => getContentfulGraphqlTeamMemberships(),
  Users: () => getContentfulGraphqlTeamMembers(),
  UsersLabsCollection: () => getContentfulGraphqlTeamMemberLabs(),
});

export const getContentfulGraphqlTeam = (): NonNullable<
  NonNullable<ContentfulFetchTeamsQuery['teamsCollection']>['items'][number]
> => ({
  sys: {
    id: 'team-id-0',
    firstPublishedAt: '2020-09-23T20:33:36.000Z',
    publishedAt: '2020-11-26T11:56:04.000Z',
    publishedVersion: 42,
  },
  displayName: 'Team A',
  applicationNumber: 'ASAP-000420',
  inactiveSince: null,
  projectSummary: null,
  projectTitle:
    'The genome-microbiome axis in the cause of Parkinson disease: Mechanistic insights and therapeutic implications from experimental models and a genetically stratified patient population.',
  expertiseAndResourceTags: ['Animal resources'],
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
  items: [getTeamResponse()],
});

export const getTeamDataObject = (): TeamDataObject => ({
  id: 'team-id-0',
  displayName: 'Team A',
  lastModifiedDate: '2020-11-26T11:56:04.000Z',
  labCount: 2,
  expertiseAndResourceTags: ['Animal resources'],
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

export const getTeamResponse = (): TeamResponse => getTeamDataObject();

export const getTeamsEvent = (
  eventType: string,
  eventName: TeamEvent,
  data = {
    displayName: { iv: 'Team 1' },
    applicationNumber: { iv: '12345' },
    expertiseAndResourceTags: { iv: [] },
    proposal: { iv: [] },
    projectTitle: { iv: 'Team Project' },
    projectSummary: { iv: '' },
    tools: { iv: [] },
  },
  dataOld = {
    displayName: { iv: 'Team 1' },
    applicationNumber: { iv: '12345' },
    expertiseAndResourceTags: { iv: [] },
    proposal: { iv: [] },
    projectTitle: { iv: 'Team Project' },
    projectSummary: { iv: '' },
    tools: { iv: [] },
  },
): TeamPayload => ({
  type: eventName,
  timestamp: '2021-10-05T12:49:49Z',
  resourceId: 'teamId',
  payload: {
    $type: 'EnrichedContentEvent',
    type: eventType,
    id: 'teamId',
    created: '2021-10-04T16:55:30Z',
    lastModified: '2021-10-05T12:49:49Z',
    version: 42,
    data,
    dataOld,
  },
});

export const getTeamsCreated = getTeamsEvent('Published', 'TeamsPublished');
export const getTeamsUpdated = getTeamsEvent('Updated', 'TeamsUpdated');
export const getTeamsDeleted = getTeamsEvent('Deleted', 'TeamsDeleted');
export const getTeamsUnpublished = getTeamsEvent('Deleted', 'TeamsUnpublished');

export const getPossibleTeamEvents: [string, string, TeamPayload][] = [
  ['teams-created', 'TeamsCreated', getTeamsCreated],
  ['teams-unpublished', 'TeamsDeleted', getTeamsUnpublished],
  ['teams-updated', 'TeamsUpdated', getTeamsUpdated],
  ['teams-deleted', 'TeamsDeleted', getTeamsDeleted],
];

export const getTeamsEventbridgeEvent = (id: string, eventType: TeamEvent) =>
  createEventBridgeEventMock(getTeamsEvent(id, eventType), eventType, id);

export type TeamEventGenerator = (
  id: string,
) => EventBridgeEvent<TeamEvent, TeamPayload>;

export const unpublishedEvent: TeamEventGenerator = (id: string) =>
  getTeamsEventbridgeEvent(id, 'TeamsUnpublished') as EventBridgeEvent<
    TeamEvent,
    TeamPayload
  >;

export const deleteEvent: TeamEventGenerator = (id: string) =>
  getTeamsEventbridgeEvent(id, 'TeamsDeleted') as EventBridgeEvent<
    TeamEvent,
    TeamPayload
  >;

export const createEvent: TeamEventGenerator = (id: string) =>
  getTeamsEventbridgeEvent(id, 'TeamsPublished') as EventBridgeEvent<
    TeamEvent,
    TeamPayload
  >;

export const updateEvent: TeamEventGenerator = (id: string) =>
  getTeamsEventbridgeEvent(id, 'TeamsUpdated') as EventBridgeEvent<
    TeamEvent,
    TeamPayload
  >;

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
