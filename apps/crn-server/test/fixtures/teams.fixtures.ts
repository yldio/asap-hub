import {
  ContentfulWebhookPayload,
  ContentfulWebhookPublishPayload,
  ContentfulWebhookUnpublishPayload,
  FetchTeamsQuery as ContentfulFetchTeamsQuery,
  FetchTeamByIdQuery,
  FetchPublicTeamsQuery,
} from '@asap-hub/contentful';
import { manuscriptAuthor } from '@asap-hub/fixtures';
import {
  ListPublicTeamResponse,
  ListTeamResponse,
  PublicTeamListItemDataObject,
  PublicTeamResponse,
  TeamDataObject,
  TeamEvent,
  TeamMembershipEvent,
  TeamListItemDataObject,
  TeamListItemResponse,
  TeamResponse,
  WebhookDetail,
} from '@asap-hub/model';
import { EventBridgeEvent } from 'aws-lambda';
import { TeamPayload } from '../../src/handlers/event-bus';
import { createEventBridgeEventMock } from '../helpers/events';
import { getContentfulGraphqlManuscriptVersions } from './manuscript.fixtures';

export const getContentfulGraphql = (teamById = false, teamId?: string) => ({
  Teams: () =>
    teamById
      ? { ...getContentfulGraphqlTeamById(teamId), linkedFrom: () => {} }
      : getContentfulGraphqlTeam(),
  TeamMembershipCollection: () => getContentfulGraphqlTeamMemberships(),
  Users: () => getContentfulGraphqlTeamMembers(),
  UsersTeamsCollection: () => getUsersTeamsCollection(),
  UsersLabsCollection: () => getContentfulGraphqlTeamMemberLabs(),
  ManuscriptsCollection: () => getContentfulGraphqlManuscripts(),
  ManuscriptsTeamsCollection: () =>
    getContentfulGraphqlManuscripts()!.items[0]?.teamsCollection,
  ManuscriptsVersionsCollection: () => getContentfulGraphqlManuscriptVersions(),
  ManuscriptVersionsTeamsCollection: () =>
    getContentfulGraphqlManuscriptVersions(teamId).items[0]?.teamsCollection,
  ManuscriptVersionsLabsCollection: () =>
    getContentfulGraphqlManuscriptVersions(teamId).items[0]?.labsCollection,
  ManuscriptVersionsFirstAuthorsCollection: () =>
    getContentfulGraphqlManuscriptVersions(teamId).items[0]
      ?.firstAuthorsCollection,
  ManuscriptVersionsCorrespondingAuthorCollection: () =>
    getContentfulGraphqlManuscriptVersions(teamId).items[0]
      ?.correspondingAuthorCollection,
  ManuscriptVersionsAdditionalAuthorsCollection: () =>
    getContentfulGraphqlManuscriptVersions(teamId).items[0]
      ?.additionalAuthorsCollection,
});

export const getUsersTeamsCollection = () => ({
  items: [{ team: { sys: { id: 'team-id-0' }, displayName: 'Team A' } }],
});
export const getContentfulGraphqlTeamById = (
  teamId?: string,
): NonNullable<NonNullable<FetchTeamByIdQuery['teams']>> => ({
  sys: {
    id: teamId || 'team-id-0',
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
    manuscriptsCollection: getContentfulGraphqlManuscripts(teamId),
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

export const getContentfulGraphqlPublicTeam = (): NonNullable<
  NonNullable<FetchPublicTeamsQuery['teamsCollection']>['items'][number]
> => ({
  sys: {
    id: 'team-id-0',
  },
  displayName: 'Team A',
  inactiveSince: null,
  projectTitle:
    'The genome-microbiome axis in the cause of Parkinson disease: Mechanistic insights and therapeutic implications from experimental models and a genetically stratified patient population.',
  projectSummary: undefined,
  researchTheme: {
    name: 'PD Functional Genomics',
  },
  linkedFrom: {
    teamMembershipCollection: {
      items: [
        {
          role: 'Key Personnel',
          linkedFrom: {
            usersCollection: {
              items: [
                {
                  sys: {
                    id: 'active-member-1',
                  },
                  firstName: 'John',
                  lastName: 'Doe',
                  onboarded: true,
                  alumniSinceDate: null,
                  nickname: null,
                },
              ],
            },
          },
        },
        {
          ...getContentfulGraphqlTeamMemberships().items[0],
          linkedFrom: {
            usersCollection: {
              items: [
                {
                  ...getContentfulGraphqlTeamMembers(),
                  alumniSinceDate: null,
                },
              ],
            },
          },
        },
        {
          role: 'Trainee',
          inactiveSinceDate: '2020-09-23T20:45:22.000Z',
          linkedFrom: {
            usersCollection: {
              items: [
                {
                  sys: {
                    id: 'inactive-member-1',
                  },
                  firstName: 'Jane',
                  lastName: 'Doe',
                  onboarded: true,
                  alumniSinceDate: null,
                },
              ],
            },
          },
        },
      ],
    },
    interestGroupsTeamsCollection: {
      items: [
        {
          linkedFrom: {
            interestGroupsCollection: {
              items: [
                {
                  sys: {
                    id: 'interest-group-1',
                  },
                  name: 'Interest Group 1',
                  active: true,
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
  nickname: 'Tim',
  lastName: 'Hardy',
  avatar: null,
  alumniSinceDate: '2020-09-23T20:45:22.000Z',
  onboarded: true,
});

export const getContentfulGraphqlTeamMemberLabs = () => ({
  items: [
    { sys: { id: 'cd7be4902' }, name: 'Brighton' },
    { sys: { id: 'cd7be4903' }, name: 'Liverpool' },
  ],
});

export const getContentfulGraphqlManuscripts = (
  teamId?: string,
): NonNullable<
  NonNullable<FetchTeamByIdQuery['teams']>['linkedFrom']
>['manuscriptsCollection'] => ({
  items: [
    {
      sys: { id: 'manuscript-id-1' },
      count: 1,
      title: 'Manuscript 1',
      status: 'Compliant',
      apcRequested: false,
      apcAmountPaid: null,
      teamsCollection: {
        items: [
          {
            sys: { id: teamId || 'team-id-0' },
            grantId: '000282',
            teamId: 'WH1',
          },
        ],
      },
      versionsCollection: getContentfulGraphqlManuscriptVersions(teamId),
    },
    {
      sys: { id: 'manuscript-id-2' },
      count: 2,
      title: 'Manuscript 2',
      apcRequested: false,
      apcAmountPaid: null,
      teamsCollection: {
        items: [
          {
            sys: { id: teamId || 'team-id-0' },
            grantId: '000282',
            teamId: 'WH1',
          },
        ],
      },
      versionsCollection: getContentfulGraphqlManuscriptVersions(teamId),
    },
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
      displayName: 'Tom (Tim) Hardy',
      role: 'Lead PI (Core Leadership)',
      avatarUrl: undefined,
      labs: [
        { id: 'cd7be4902', name: 'Brighton' },
        { id: 'cd7be4903', name: 'Liverpool' },
      ],
    },
  ],
  manuscripts: [
    {
      id: 'manuscript-id-2',
      count: 2,
      title: 'Manuscript 2',
      teamId: 'WH1',
      grantId: '000282',
      versions: [
        {
          id: 'version-1',
          lifecycle: 'Preprint',
          type: 'Original Research',
          description: 'A good description',
          shortDescription: 'A good short description',
          count: 1,
          createdBy: manuscriptAuthor,
          updatedBy: manuscriptAuthor,
          createdDate: '2020-09-23T20:45:22.000Z',
          publishedAt: '2020-09-23T20:45:22.000Z',
          manuscriptFile: {
            id: 'file-id',
            url: 'https://example.com/manuscript.pdf',
            filename: 'manuscript.pdf',
          },
          keyResourceTable: {
            id: 'file-table-id',
            url: 'https://example.com/manuscript.csv',
            filename: 'manuscript.csv',
          },
          teams: [
            {
              id: 'team-1',
              displayName: 'Test 1',
            },
          ],
          labs: [{ id: 'lab-1', name: 'Lab 1' }],
          firstAuthors: [],
          correspondingAuthor: [],
          additionalAuthors: [],
        },
      ],
    },
    {
      id: 'manuscript-id-1',
      count: 1,
      title: 'Manuscript 1',
      status: 'Compliant',
      teamId: 'WH1',
      grantId: '000282',
      versions: [
        {
          id: 'version-1',
          lifecycle: 'Preprint',
          type: 'Original Research',
          description: 'A good description',
          shortDescription: 'A good short description',
          count: 1,
          createdBy: manuscriptAuthor,
          updatedBy: manuscriptAuthor,
          createdDate: '2020-09-23T20:45:22.000Z',
          publishedAt: '2020-09-23T20:45:22.000Z',
          manuscriptFile: {
            id: 'file-id',
            url: 'https://example.com/manuscript.pdf',
            filename: 'manuscript.pdf',
          },
          keyResourceTable: {
            id: 'file-table-id',
            url: 'https://example.com/manuscript.csv',
            filename: 'manuscript.csv',
          },
          teams: [
            {
              id: 'team-1',
              displayName: 'Test 1',
            },
          ],
          labs: [{ id: 'lab-1', name: 'Lab 1' }],
          firstAuthors: [],
          correspondingAuthor: [],
          additionalAuthors: [],
        },
      ],
    },
  ],
  projectTitle:
    'The genome-microbiome axis in the cause of Parkinson disease: Mechanistic insights and therapeutic implications from experimental models and a genetically stratified patient population.',
  proposalURL: '4cfb1b7b-bafe-4fca-b2ab-197e84d98996',
  tools: [],
});

export const getPublicTeamListItemDataObject =
  (): PublicTeamListItemDataObject => ({
    id: 'team-id-0',
    name: 'Team A',
    researchTheme: 'PD Functional Genomics',
    activeTeamMembers: ['active-member-1', 'user-id-1'],
    inactiveTeamMembers: ['inactive-member-1'],
    noOfTeamMembers: 2,
    activeInterestGroups: ['Interest Group 1'],
    teamLeaders: [
      {
        id: 'user-id-1',
        displayName: 'Tom (Tim) Hardy',
        avatarUrl: undefined,
      },
    ],
  });

export const getListPublicTeamResponse = (): ListPublicTeamResponse => ({
  total: 1,
  items: [getPublicTeamListItemDataObject()],
});

export const getUnsortedManuscripts = (teamId: string) => ({
  // Keep this order for testing => should sort manuscripts so that Compliant and Closed (other) are last
  manuscriptsCollection: {
    items: [
      {
        sys: { id: '1' },
        title: 'First Manuscript',
        status: 'Waiting for Report',
        teamsCollection: {
          items: [{ sys: { id: teamId }, teamId, grantId: 'g1' }],
        },
        versionsCollection: { items: [] },
      },
      {
        sys: { id: '2' },
        title: 'Second Manuscript',
        status: 'Compliant',
        teamsCollection: {
          items: [{ sys: { id: teamId }, teamId, grantId: 'g1' }],
        },
        versionsCollection: { items: [] },
      },
      {
        sys: { id: '3' },
        title: 'Third Manuscript',
        status: 'Closed (other)',
        teamsCollection: {
          items: [{ sys: { id: teamId }, teamId, grantId: 'g1' }],
        },
        versionsCollection: { items: [] },
      },
      {
        sys: { id: '4' },
        title: 'Fourth Manuscript',
        status: 'Submit Final Publication',
        teamsCollection: {
          items: [{ sys: { id: teamId }, teamId, grantId: 'g1' }],
        },
        versionsCollection: { items: [] },
      },
    ],
  },
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
export const getPublicTeamResponse = (): PublicTeamResponse => ({
  id: 'team-id-0',
  name: 'Team A',
  title:
    'The genome-microbiome axis in the cause of Parkinson disease: Mechanistic insights and therapeutic implications from experimental models and a genetically stratified patient population.',
  status: 'Active',
  tags: ['Animal resources 1'],
  projectSummary: undefined,
  members: [
    {
      id: 'user-id-1',
      status: 'Inactive',
      firstName: 'Tom',
      lastName: 'Hardy',
      displayName: 'Tom (Tim) Hardy',
      role: 'Lead PI (Core Leadership)',
      avatarUrl: undefined,
    },
    {
      id: 'user-id-2',
      status: 'Active',
      firstName: 'John',
      lastName: 'Doe',
      displayName: 'John Doe',
      role: 'Lead PI (Core Leadership)',
      avatarUrl: undefined,
    },
  ],
});
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

// TeamMembership Event Fixtures
export type TeamMembershipEventGenerator = (
  membershipId: string,
  teamId: string,
) => EventBridgeEvent<TeamMembershipEvent, any>;

export const getTeamMembershipContentfulWebhookDetail = (
  membershipId: string,
  teamId: string,
): WebhookDetail<ContentfulWebhookPayload<'teamMembership'>> => ({
  resourceId: membershipId,
  metadata: {
    tags: [],
  },
  sys: {
    type: 'Entry',
    id: membershipId,
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
        id: 'teamMembership',
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
    revision: 1,
    createdAt: '2023-05-17T13:39:03.250Z',
    updatedAt: '2023-05-18T16:17:36.425Z',
  },
  fields: {
    team: {
      'en-US': {
        sys: {
          type: 'Link',
          linkType: 'Entry',
          id: teamId,
        },
      },
    },
    role: {
      'en-US': 'Data Manager',
    },
  },
});

export const getTeamMembershipEvent = (
  membershipId: string,
  teamId: string,
  eventType: TeamMembershipEvent,
): EventBridgeEvent<
  TeamMembershipEvent,
  WebhookDetail<ContentfulWebhookPayload<'teamMembership'>>
> =>
  createEventBridgeEventMock(
    getTeamMembershipContentfulWebhookDetail(membershipId, teamId),
    eventType,
    membershipId,
  );

export const getTeamMembershipPublishedEvent: TeamMembershipEventGenerator = (
  membershipId: string,
  teamId: string,
) => getTeamMembershipEvent(membershipId, teamId, 'TeamMembershipPublished');

export const getTeamMembershipUnpublishedEvent: TeamMembershipEventGenerator = (
  membershipId: string,
  teamId: string,
) => getTeamMembershipEvent(membershipId, teamId, 'TeamMembershipUnpublished');
