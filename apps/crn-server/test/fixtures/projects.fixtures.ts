import {
  ContentfulWebhookPayload,
  FetchProjectByIdQuery,
  FetchProjectsQuery,
} from '@asap-hub/contentful';
import {
  DiscoveryProject,
  ResourceProject,
  TraineeProject,
  ProjectEvent,
  WebhookDetail,
} from '@asap-hub/model';
import { EventBridgeEvent } from 'aws-lambda';
import { createEventBridgeEventMock } from '../helpers/events';

type GraphQLProject = NonNullable<
  NonNullable<FetchProjectsQuery['projectsCollection']>['items'][number]
>;

export const getDiscoveryProjectGraphqlItem = (): GraphQLProject => ({
  sys: { id: 'discovery-1' },
  title: 'Discovery Project 1',
  status: 'Completed',
  startDate: '2024-01-01',
  endDate: '2024-04-01',
  projectType: 'Discovery Project',
  resourceType: null,
  googleDriveLink: null,
  membersCollection: {
    total: 3,
    items: [
      {
        sys: { id: 'membership-discovery-team' },
        role: 'Lead Investigator',
        projectMember: {
          __typename: 'Teams',
          sys: { id: 'team-1' },
          displayName: 'Discovery Team',
          inactiveSince: '2025-01-01',
          researchTheme: { name: 'Theme One' },
        },
      },
      {
        sys: { id: 'membership-discovery-user' },
        role: 'Researcher',
        projectMember: {
          __typename: 'Users',
          sys: { id: 'user-1' },
          firstName: 'Alex',
          nickname: 'Al',
          lastName: 'Smith',
          email: 'alex@example.com',
          onboarded: true,
          avatar: { url: 'https://example.com/alex.png' },
          alumniSinceDate: undefined,
        },
      },
      null,
    ],
  },
  researchTagsCollection: {
    total: 1,
    items: [
      {
        sys: { id: 'tag-a' },
        name: 'Tag A',
        category: null,
        types: null,
      },
      null,
    ],
  },
});

export const getDiscoveryProjectWithoutTeamGraphqlItem =
  (): GraphQLProject => ({
    sys: { id: 'discovery-no-team' },
    title: 'Discovery Project No Team',
    status: 'Active',
    startDate: '2024-02-01',
    endDate: '2024-05-01',
    projectType: 'Discovery Project',
    resourceType: null,
    googleDriveLink: null,
    membersCollection: {
      total: 1,
      items: [
        {
          sys: { id: 'membership-discovery-user-no-team' },
          role: 'Researcher',
          projectMember: {
            __typename: 'Users',
            sys: { id: 'user-no-team' },
            firstName: 'Jordan',
            nickname: '',
            lastName: 'Casey',
            email: 'jordan@example.com',
            onboarded: true,
            avatar: { url: null },
            alumniSinceDate: undefined,
          },
        },
      ],
    },
    researchTagsCollection: {
      total: 1,
      items: [
        {
          sys: { id: 'tag-c' },
          name: 'Tag C',
          category: null,
          types: null,
        },
      ],
    },
  });

export const getResourceTeamProjectGraphqlItem = (): GraphQLProject => ({
  sys: { id: 'resource-team-1' },
  title: 'Resource Project Team-Based',
  status: 'Active',
  startDate: '2023-01-01',
  endDate: '2023-07-01',
  projectType: 'Resource Project',
  resourceType: { sys: { id: 'resource-type-1' }, name: 'Data Portal' },
  googleDriveLink: 'https://drive.example.com/resource',
  membersCollection: {
    total: 2,
    items: [
      {
        sys: { id: 'membership-resource-main' },
        role: 'Lead',
        projectMember: {
          __typename: 'Teams',
          sys: { id: 'resource-team-main' },
          displayName: 'Resource Team',
          inactiveSince: null,
          researchTheme: null,
        },
      },
      {
        sys: { id: 'membership-resource-support' },
        role: 'Support',
        projectMember: {
          __typename: 'Teams',
          sys: { id: 'resource-team-support' },
          displayName: 'Resource Support',
          inactiveSince: null,
          researchTheme: null,
        },
      },
    ],
  },
  researchTagsCollection: {
    total: 0,
    items: [],
  },
});

export const getResourceIndividualProjectGraphqlItem = (): GraphQLProject => ({
  sys: { id: 'resource-individual-1' },
  title: 'Resource Project Individual',
  status: 'Completed',
  startDate: '2022-01-01',
  endDate: '2023-03-01',
  projectType: 'Resource Project',
  resourceType: { sys: { id: 'resource-type-2' }, name: 'Dataset' },
  googleDriveLink: null,
  membersCollection: {
    total: 2,
    items: [
      {
        sys: { id: 'membership-resource-user-2' },
        role: 'Contributor',
        projectMember: {
          __typename: 'Users',
          sys: { id: 'user-2' },
          firstName: 'Jamie',
          nickname: '',
          lastName: 'Lee',
          email: 'jamie@example.com',
          onboarded: true,
          avatar: { url: null },
          alumniSinceDate: '2025-01-01',
        },
      },
      {
        sys: { id: 'membership-resource-user-3' },
        role: 'Contributor',
        projectMember: {
          __typename: 'Users',
          sys: { id: 'user-3' },
          firstName: 'Pat',
          nickname: 'Patty',
          lastName: 'Stone',
          email: 'pat@example.com',
          onboarded: true,
          avatar: { url: 'https://example.com/pat.png' },
          alumniSinceDate: undefined,
        },
      },
    ],
  },
  researchTagsCollection: {
    total: 1,
    items: [
      {
        sys: { id: 'tag-b' },
        name: 'Tag B',
        category: null,
        types: null,
      },
    ],
  },
});

export const getTraineeProjectGraphqlItem = (): GraphQLProject => ({
  sys: { id: 'trainee-1' },
  title: 'Trainee Project 1',
  status: 'Active',
  startDate: '2024-05-01',
  endDate: '2025-05-01',
  projectType: 'Trainee Project',
  resourceType: null,
  googleDriveLink: null,
  membersCollection: {
    total: 2,
    items: [
      {
        sys: { id: 'membership-trainee-trainer' },
        role: 'Project Lead',
        projectMember: {
          __typename: 'Users',
          sys: { id: 'user-trainer' },
          firstName: 'Taylor',
          nickname: 'Tay',
          lastName: 'Mills',
          email: 'taylor@example.com',
          onboarded: true,
          avatar: { url: null },
          alumniSinceDate: undefined,
        },
      },
      {
        sys: { id: 'membership-trainee-trainee' },
        role: 'Key Personnel',
        projectMember: {
          __typename: 'Users',
          sys: { id: 'user-trainee' },
          firstName: 'Dana',
          nickname: '',
          lastName: 'Lopez',
          email: 'dana@example.com',
          onboarded: true,
          avatar: { url: null },
          alumniSinceDate: undefined,
        },
      },
    ],
  },
  researchTagsCollection: {
    total: 0,
    items: [],
  },
});

export const getProjectsGraphqlResponse = (): FetchProjectsQuery => ({
  projectsCollection: {
    total: 4,
    items: [
      getDiscoveryProjectGraphqlItem(),
      getResourceTeamProjectGraphqlItem(),
      getResourceIndividualProjectGraphqlItem(),
      getTraineeProjectGraphqlItem(),
      null,
    ],
  },
});

export const getProjectsGraphqlResponseWithUnknownType =
  (): FetchProjectsQuery => ({
    projectsCollection: {
      total: 1,
      items: [
        {
          ...getDiscoveryProjectGraphqlItem(),
          projectType: 'Unknown Project',
        },
      ],
    },
  });

export const getProjectsGraphqlResponseWithInvalidMember =
  (): FetchProjectsQuery => ({
    projectsCollection: {
      total: 1,
      items: [
        {
          ...getDiscoveryProjectGraphqlItem(),
          membersCollection: {
            total: 1,
            items: [
              {
                sys: { id: 'invalid-member' },
                role: 'Lead',
                projectMember: null,
              },
              null,
            ],
          },
        },
      ],
    },
  });

export const getProjectsGraphqlResponseWithInvalidTeamMember =
  (): FetchProjectsQuery => ({
    projectsCollection: {
      total: 1,
      items: [
        {
          ...getResourceTeamProjectGraphqlItem(),
          membersCollection: {
            total: 1,
            items: [
              {
                sys: { id: 'invalid-team-member' },
                role: 'Lead',
                projectMember: {
                  __typename: 'Users',
                  sys: { id: 'user-foo' },
                  firstName: 'Pat',
                  nickname: '',
                  lastName: 'Foo',
                  email: 'pat@example.com',
                  onboarded: true,
                  avatar: { url: null },
                  alumniSinceDate: undefined,
                },
              },
            ],
          },
        },
      ],
    },
  });

export const getProjectsGraphqlEmptyResponse = (): FetchProjectsQuery => ({
  projectsCollection: null,
});

export const getProjectByIdGraphqlResponse = (): FetchProjectByIdQuery => ({
  projects: getDiscoveryProjectGraphqlItem(),
});

export const getExpectedDiscoveryProject = (): DiscoveryProject => ({
  id: 'discovery-1',
  title: 'Discovery Project 1',
  status: 'Completed',
  startDate: '2024-01-01',
  endDate: '2024-04-01',
  tags: ['Tag A'],
  researchTags: [
    {
      id: 'tag-a',
      name: 'Tag A',
      category: undefined,
      types: undefined,
    },
  ],
  projectId: undefined,
  grantId: undefined,
  applicationNumber: undefined,
  contactEmail: undefined,
  projectType: 'Discovery Project',
  researchTheme: 'Theme One',
  teamName: 'Discovery Team',
  teamId: 'team-1',
  inactiveSinceDate: '2025-01-01',
});

// Expected discovery project detail (for fetchById) with additional detail fields
export const getExpectedDiscoveryProjectDetail = () => ({
  ...getExpectedDiscoveryProject(),
  collaborators: [
    {
      id: 'user-1',
      displayName: 'Alex (Al) Smith',
      firstName: 'Alex',
      lastName: 'Smith',
      avatarUrl: 'https://example.com/alex.png',
      role: 'Researcher',
      email: 'alex@example.com',
      alumniSinceDate: undefined,
    },
  ],
  fundedTeam: {
    id: 'team-1',
    displayName: 'Discovery Team',
    teamType: 'Discovery Team',
    researchTheme: 'Theme One',
    teamDescription: undefined,
  },
  milestones: undefined,
  originalGrant: '',
  originalGrantProposalId: undefined,
  supplementGrant: undefined,
});

// Expected Discovery Project detail with all detail fields populated (milestones, grants, teamDescription)
export const getExpectedDiscoveryProjectDetailWithAllFields = () => ({
  ...getExpectedDiscoveryProject(),
  originalGrant: 'Original Grant Title',
  originalGrantProposalId: 'proposal-1',
  supplementGrant: {
    grantTitle: 'Supplement Grant Title',
    grantDescription: 'Supplement grant description',
    grantProposalId: 'proposal-2',
    grantStartDate: '2024-06-01',
    grantEndDate: '2025-06-01',
  },
  milestones: [
    {
      id: 'milestone-1',
      title: 'Milestone 1',
      description: 'First milestone',
      status: 'Completed',
      link: 'https://example.com/milestone1',
    },
    {
      id: 'milestone-2',
      title: 'Milestone 2',
      description: 'Second milestone',
      status: 'In Progress',
      link: undefined,
    },
  ],
  fundedTeam: {
    id: 'team-1',
    displayName: 'Discovery Team',
    teamType: 'Discovery Team',
    researchTheme: 'Theme One',
    teamDescription: 'Team description for discovery',
  },
  collaborators: [
    {
      id: 'user-1',
      displayName: 'Alex (Al) Smith',
    },
  ],
});

export const getExpectedDiscoveryProjectWithoutTeam = (): DiscoveryProject => ({
  id: 'discovery-no-team',
  title: 'Discovery Project No Team',
  status: 'Active',
  startDate: '2024-02-01',
  endDate: '2024-05-01',
  tags: ['Tag C'],
  researchTags: [
    {
      id: 'tag-c',
      name: 'Tag C',
      category: undefined,
      types: undefined,
    },
  ],
  projectId: undefined,
  grantId: undefined,
  applicationNumber: undefined,
  contactEmail: undefined,
  projectType: 'Discovery Project',
  researchTheme: '',
  teamName: '',
});

export const getExpectedResourceTeamProject = (): ResourceProject => ({
  id: 'resource-team-1',
  title: 'Resource Project Team-Based',
  status: 'Active',
  startDate: '2023-01-01',
  endDate: '2023-07-01',
  tags: [],
  researchTags: [],
  projectId: undefined,
  grantId: undefined,
  applicationNumber: undefined,
  contactEmail: undefined,
  projectType: 'Resource Project',
  resourceType: 'Data Portal',
  isTeamBased: true,
  teamName: 'Resource Team',
  teamId: 'resource-team-main',
  googleDriveLink: 'https://drive.example.com/resource',
  members: [
    { id: 'resource-team-main', displayName: 'Resource Team' },
    { id: 'resource-team-support', displayName: 'Resource Support' },
  ],
});

export const getExpectedResourceIndividualProject = (): ResourceProject => ({
  id: 'resource-individual-1',
  title: 'Resource Project Individual',
  status: 'Completed',
  startDate: '2022-01-01',
  endDate: '2023-03-01',
  tags: ['Tag B'],
  researchTags: [
    {
      id: 'tag-b',
      name: 'Tag B',
      category: undefined,
      types: undefined,
    },
  ],
  projectId: undefined,
  grantId: undefined,
  applicationNumber: undefined,
  contactEmail: undefined,
  projectType: 'Resource Project',
  resourceType: 'Dataset',
  isTeamBased: false,
  googleDriveLink: undefined,
  members: [
    {
      id: 'user-2',
      displayName: 'Jamie Lee',
      firstName: 'Jamie',
      lastName: 'Lee',
      avatarUrl: undefined,
      role: 'Contributor',
      email: 'jamie@example.com',
      alumniSinceDate: '2025-01-01',
    },
    {
      id: 'user-3',
      displayName: 'Pat (Patty) Stone',
      firstName: 'Pat',
      lastName: 'Stone',
      avatarUrl: 'https://example.com/pat.png',
      role: 'Contributor',
      email: 'pat@example.com',
      alumniSinceDate: undefined,
    },
  ],
});

export const getExpectedTraineeProject = (): TraineeProject => ({
  id: 'trainee-1',
  title: 'Trainee Project 1',
  status: 'Active',
  startDate: '2024-05-01',
  endDate: '2025-05-01',
  tags: [],
  researchTags: [],
  projectId: undefined,
  grantId: undefined,
  applicationNumber: undefined,
  contactEmail: undefined,
  projectType: 'Trainee Project',
  trainer: {
    id: 'user-trainer',
    displayName: 'Taylor (Tay) Mills',
    firstName: 'Taylor',
    lastName: 'Mills',
    avatarUrl: undefined,
    role: 'Project Lead',
    email: 'taylor@example.com',
    alumniSinceDate: undefined,
  },
  members: [
    {
      id: 'user-trainee',
      displayName: 'Dana Lopez',
      firstName: 'Dana',
      lastName: 'Lopez',
      avatarUrl: undefined,
      role: 'Key Personnel',
      email: 'dana@example.com',
      alumniSinceDate: undefined,
    },
  ],
});

export const getExpectedProjectList = () => [
  getExpectedDiscoveryProject(),
  getExpectedResourceTeamProject(),
  getExpectedResourceIndividualProject(),
  getExpectedTraineeProject(),
];

export const getUserContentfulWebhookDetail = (
  id: string,
): WebhookDetail<ContentfulWebhookPayload<'projects'>> => ({
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
        id: 'projects',
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

export const getProjectEvent = (
  id: string,
  eventType: ProjectEvent,
): EventBridgeEvent<
  ProjectEvent,
  WebhookDetail<ContentfulWebhookPayload<'projects'>>
> =>
  createEventBridgeEventMock(getUserContentfulWebhookDetail(id), eventType, id);

// Reusable fixtures for project detail fields
export const getMilestoneGraphqlItem = (
  id: string,
  overrides?: Partial<
    NonNullable<
      NonNullable<GraphQLProject['milestonesCollection']>['items'][number]
    >
  >,
) => ({
  sys: { id },
  title: `Milestone ${id}`,
  description: `Milestone ${id} description`,
  status: 'Not Started' as const,
  externalLink: null,
  ...overrides,
});

export const getOriginalGrantFields = (overrides?: {
  originalGrant?: string;
  proposalId?: string | null;
}) => ({
  originalGrant: overrides?.originalGrant || '',
  proposal: overrides?.proposalId
    ? { sys: { id: overrides.proposalId } }
    : null,
});

export const getSupplementGrantFields = (overrides?: {
  id?: string;
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  proposalId?: string | null;
}) => ({
  sys: { id: overrides?.id || 'supplement-1' },
  title: overrides?.title || 'Supplement Grant Title',
  description: overrides?.description || 'Supplement grant description',
  startDate: overrides?.startDate || '2024-06-01',
  endDate: overrides?.endDate || '2025-06-01',
  proposal: overrides?.proposalId
    ? { sys: { id: overrides.proposalId } }
    : null,
});

export const getMilestonesCollection = (
  milestones: Array<ReturnType<typeof getMilestoneGraphqlItem> | null>,
) => ({
  total: milestones.filter(Boolean).length,
  items: milestones,
});

// Project detail fixtures that extend base fixtures
export const getDiscoveryProjectDetailGraphqlItem = (overrides?: {
  originalGrant?: string;
  proposalId?: string | null;
  supplementGrant?: ReturnType<typeof getSupplementGrantFields> | null;
  milestones?: Array<ReturnType<typeof getMilestoneGraphqlItem> | null>;
  teamDescription?: string | null;
}): NonNullable<FetchProjectByIdQuery['projects']> =>
  ({
    ...getDiscoveryProjectGraphqlItem(),
    ...getOriginalGrantFields({
      originalGrant: overrides?.originalGrant,
      proposalId: overrides?.proposalId,
    }),
    supplementGrant: overrides?.supplementGrant ?? null,
    milestonesCollection: overrides?.milestones
      ? getMilestonesCollection(overrides.milestones)
      : {
          total: 0,
          items: [],
        },
    membersCollection: {
      total: 2,
      items: [
        {
          sys: { id: 'membership-discovery-team' },
          role: 'Lead Investigator',
          projectMember: {
            __typename: 'Teams',
            sys: { id: 'team-1' },
            displayName: 'Discovery Team',
            inactiveSince: '2025-01-01',
            researchTheme: { name: 'Theme One' },
            teamDescription: overrides?.teamDescription ?? null,
          },
        },
        {
          sys: { id: 'membership-discovery-user' },
          role: 'Researcher',
          projectMember: {
            __typename: 'Users',
            sys: { id: 'user-1' },
            firstName: 'Alex',
            nickname: 'Al',
            lastName: 'Smith',
            email: 'alex@example.com',
            onboarded: true,
            avatar: { url: 'https://example.com/alex.png' },
            alumniSinceDate: undefined,
          },
        },
      ],
    },
  }) as NonNullable<FetchProjectByIdQuery['projects']>;

export const getResourceTeamProjectDetailGraphqlItem = (overrides?: {
  originalGrant?: string;
  proposalId?: string | null;
  supplementGrant?: ReturnType<typeof getSupplementGrantFields> | null;
  milestones?: Array<ReturnType<typeof getMilestoneGraphqlItem> | null>;
  teamDescription?: string | null;
}): NonNullable<FetchProjectByIdQuery['projects']> =>
  ({
    ...getResourceTeamProjectGraphqlItem(),
    ...getOriginalGrantFields({
      originalGrant: overrides?.originalGrant,
      proposalId: overrides?.proposalId,
    }),
    supplementGrant: overrides?.supplementGrant ?? null,
    milestonesCollection: overrides?.milestones
      ? getMilestonesCollection(overrides.milestones)
      : {
          total: 0,
          items: [],
        },
    membersCollection: {
      total: 2,
      items: [
        {
          sys: { id: 'membership-resource-main' },
          role: 'Lead',
          projectMember: {
            __typename: 'Teams',
            sys: { id: 'resource-team-main' },
            displayName: 'Resource Team',
            inactiveSince: null,
            researchTheme: { name: 'Resource Theme' },
            teamDescription: overrides?.teamDescription ?? null,
          },
        },
        {
          sys: { id: 'membership-resource-user' },
          role: 'Contributor',
          projectMember: {
            __typename: 'Users',
            sys: { id: 'user-resource-1' },
            firstName: 'Resource',
            nickname: '',
            lastName: 'User',
            email: 'resource@example.com',
            onboarded: true,
            avatar: { url: null },
            alumniSinceDate: undefined,
          },
        },
      ],
    },
  }) as NonNullable<FetchProjectByIdQuery['projects']>;

export const getResourceIndividualProjectDetailGraphqlItem = (overrides?: {
  originalGrant?: string;
  proposalId?: string | null;
  supplementGrant?: ReturnType<typeof getSupplementGrantFields> | null;
  milestones?: Array<ReturnType<typeof getMilestoneGraphqlItem> | null>;
}): NonNullable<FetchProjectByIdQuery['projects']> =>
  ({
    ...getResourceIndividualProjectGraphqlItem(),
    ...getOriginalGrantFields({
      originalGrant: overrides?.originalGrant,
      proposalId: overrides?.proposalId,
    }),
    supplementGrant: overrides?.supplementGrant ?? null,
    milestonesCollection: overrides?.milestones
      ? getMilestonesCollection(overrides.milestones)
      : {
          total: 0,
          items: [],
        },
    membersCollection: {
      total: 2,
      items: [
        {
          sys: { id: 'membership-resource-user-2' },
          role: 'Contributor',
          projectMember: {
            __typename: 'Users',
            sys: { id: 'user-2' },
            firstName: 'Jamie',
            nickname: '',
            lastName: 'Lee',
            email: 'jamie@example.com',
            onboarded: true,
            avatar: { url: null },
            alumniSinceDate: '2025-01-01',
          },
        },
        {
          sys: { id: 'membership-resource-user-3' },
          role: 'Contributor',
          projectMember: {
            __typename: 'Users',
            sys: { id: 'user-3' },
            firstName: 'Pat',
            nickname: 'Patty',
            lastName: 'Stone',
            email: 'pat@example.com',
            onboarded: true,
            avatar: { url: 'https://example.com/pat.png' },
            alumniSinceDate: undefined,
          },
        },
      ],
    },
  }) as NonNullable<FetchProjectByIdQuery['projects']>;

export const getTraineeProjectDetailGraphqlItem = (overrides?: {
  originalGrant?: string;
  proposalId?: string | null;
  supplementGrant?: ReturnType<typeof getSupplementGrantFields> | null;
  milestones?: Array<ReturnType<typeof getMilestoneGraphqlItem> | null>;
}): NonNullable<FetchProjectByIdQuery['projects']> =>
  ({
    ...getTraineeProjectGraphqlItem(),
    ...getOriginalGrantFields({
      originalGrant: overrides?.originalGrant,
      proposalId: overrides?.proposalId,
    }),
    supplementGrant: overrides?.supplementGrant ?? null,
    milestonesCollection: overrides?.milestones
      ? getMilestonesCollection(overrides.milestones)
      : {
          total: 0,
          items: [],
        },
    membersCollection: {
      total: 2,
      items: [
        {
          sys: { id: 'membership-trainee-trainer' },
          role: 'Project Lead',
          projectMember: {
            __typename: 'Users',
            sys: { id: 'user-trainer' },
            firstName: 'Taylor',
            nickname: 'Tay',
            lastName: 'Mills',
            email: 'taylor@example.com',
            onboarded: true,
            avatar: { url: null },
            alumniSinceDate: undefined,
          },
        },
        {
          sys: { id: 'membership-trainee-trainee' },
          role: 'Key Personnel',
          projectMember: {
            __typename: 'Users',
            sys: { id: 'user-trainee' },
            firstName: 'Dana',
            nickname: '',
            lastName: 'Lopez',
            email: 'dana@example.com',
            onboarded: true,
            avatar: { url: null },
            alumniSinceDate: undefined,
          },
        },
      ],
    },
  }) as NonNullable<FetchProjectByIdQuery['projects']>;
