import {
  FetchProjectByIdQuery,
  FetchProjectsQuery,
} from '@asap-hub/contentful';
import {
  DiscoveryProject,
  ResourceProject,
  TraineeProject,
} from '@asap-hub/model';

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
          teamId: 'team-1-id',
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
          teamId: 'resource-team-main-id',
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
          teamId: 'resource-team-support-id',
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
  status: 'Complete',
  startDate: '2024-01-01',
  endDate: '2024-04-01',
  duration: '3 mos',
  tags: ['Tag A'],
  projectType: 'Discovery',
  researchTheme: 'Theme One',
  teamName: 'Discovery Team',
  teamId: 'team-1',
  inactiveSinceDate: '2025-01-01',
});

export const getExpectedDiscoveryProjectWithoutTeam = (): DiscoveryProject => ({
  id: 'discovery-no-team',
  title: 'Discovery Project No Team',
  status: 'Active',
  startDate: '2024-02-01',
  endDate: '2024-05-01',
  duration: '3 mos',
  tags: ['Tag C'],
  projectType: 'Discovery',
  researchTheme: '',
  teamName: '',
});

export const getExpectedResourceTeamProject = (): ResourceProject => ({
  id: 'resource-team-1',
  title: 'Resource Project Team-Based',
  status: 'Active',
  startDate: '2023-01-01',
  endDate: '2023-07-01',
  duration: '6 mos',
  tags: [],
  projectType: 'Resource',
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
  status: 'Complete',
  startDate: '2022-01-01',
  endDate: '2023-03-01',
  duration: '1 yr 2 mos',
  tags: ['Tag B'],
  projectType: 'Resource',
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
  duration: '1 yr',
  tags: [],
  projectType: 'Trainee',
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
