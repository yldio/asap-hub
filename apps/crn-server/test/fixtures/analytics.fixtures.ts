import {
  FetchAnalyticsTeamLeadershipQuery,
  FetchTeamCollaborationQuery,
  FetchTeamProductivityQuery,
  FetchUserCollaborationQuery,
  FetchUserProductivityQuery,
} from '@asap-hub/contentful';
import {
  AnalyticsTeamLeadershipDataObject,
  AnalyticsTeamLeadershipResponse,
  ListAnalyticsTeamLeadershipDataObject,
  ListAnalyticsTeamLeadershipResponse,
  ListTeamCollaborationResponse,
  ListTeamProductivityDataObject,
  ListTeamProductivityResponse,
  ListUserCollaborationResponse,
  ListUserProductivityDataObject,
  ListUserProductivityResponse,
  TeamCollaborationDataObject,
  TeamCollaborationResponse,
  TeamProductivityDataObject,
  TeamProductivityResponse,
  UserCollaborationDataObject,
  UserCollaborationResponse,
  UserProductivityDataObject,
  UserProductivityResponse,
} from '@asap-hub/model';
import { getTeamDataObject } from './teams.fixtures';

export const getAnalyticsTeamLeadershipDataObject =
  (): AnalyticsTeamLeadershipDataObject => {
    const { id, displayName } = getTeamDataObject();
    return {
      id,
      displayName,
      workingGroupLeadershipRoleCount: 1,
      workingGroupPreviousLeadershipRoleCount: 2,
      workingGroupMemberCount: 3,
      workingGroupPreviousMemberCount: 4,
      interestGroupLeadershipRoleCount: 5,
      interestGroupPreviousLeadershipRoleCount: 6,
      interestGroupMemberCount: 7,
      interestGroupPreviousMemberCount: 8,
    };
  };

export const getListAnalyticsTeamLeadershipDataObject =
  (): ListAnalyticsTeamLeadershipDataObject => ({
    total: 1,
    items: [getAnalyticsTeamLeadershipDataObject()],
  });

export const getAnalyticsTeamLeadershipResponse =
  (): AnalyticsTeamLeadershipResponse => getAnalyticsTeamLeadershipDataObject();

export const getListAnalyticsTeamLeadershipResponse =
  (): ListAnalyticsTeamLeadershipResponse => ({
    total: 1,
    items: [getAnalyticsTeamLeadershipResponse()],
  });

export const getAnalyticsTeamLeadershipQuery =
  (): FetchAnalyticsTeamLeadershipQuery => ({
    teamsCollection: {
      total: 1,
      items: [
        {
          sys: {
            id: 'team-id-0',
          },
          displayName: 'Team A',
          linkedFrom: {
            interestGroupsCollection: {
              items: [
                {
                  sys: {
                    id: 'interest-group-1',
                  },
                  active: true,
                },
              ],
            },
            teamMembershipCollection: {
              items: [
                {
                  inactiveSinceDate: null,
                  linkedFrom: {
                    usersCollection: {
                      items: [
                        {
                          alumniSinceDate: null,
                          linkedFrom: {
                            interestGroupLeadersCollection: {
                              items: [
                                {
                                  role: 'Chair',
                                  linkedFrom: {
                                    interestGroupsCollection: {
                                      items: [
                                        {
                                          sys: {
                                            id: 'interest-group-1',
                                          },
                                          active: true,
                                        },
                                      ],
                                    },
                                  },
                                },
                              ],
                            },
                            workingGroupMembersCollection: {
                              items: [
                                {
                                  linkedFrom: {
                                    workingGroupsCollection: {
                                      items: [
                                        {
                                          sys: {
                                            id: 'working-group-1',
                                          },
                                        },
                                      ],
                                    },
                                  },
                                },
                              ],
                            },
                            workingGroupLeadersCollection: {
                              items: [
                                {
                                  role: 'Chair',
                                  linkedFrom: {
                                    workingGroupsCollection: {
                                      items: [
                                        {
                                          sys: {
                                            id: 'working-group-1',
                                          },
                                        },
                                      ],
                                    },
                                  },
                                },
                              ],
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  });

export const getUserProductivityDataObject =
  (): UserProductivityDataObject => ({
    id: 'user-1',
    name: 'Jane (Jenny) Doe',
    isAlumni: false,
    teams: [
      {
        id: '1',
        isTeamInactive: false,
        isUserInactiveOnTeam: false,
        role: 'Co-PI (Core Leadership)',
        team: 'Team Alessi',
      },
      {
        id: '2',
        isTeamInactive: false,
        isUserInactiveOnTeam: false,
        role: 'Collaborating PI',
        team: 'Team De Camilli',
      },
    ],
    asapOutput: 3,
    asapPublicOutput: 1,
    ratio: '0.33',
    asapArticleOutput: 0,
    asapArticlePublicOutput: 0,
    articleRatio: '0.00',
    asapBioinformaticsOutput: 0,
    asapBioinformaticsPublicOutput: 0,
    bioinformaticsRatio: '0.00',
    asapDatasetOutput: 0,
    asapDatasetPublicOutput: 0,
    datasetRatio: '0.00',
    asapLabResourceOutput: 0,
    asapLabResourcePublicOutput: 0,
    labResourceRatio: '0.00',
    asapProtocolOutput: 0,
    asapProtocolPublicOutput: 0,
    protocolRatio: '0.00',
  });

export const getResearchOutputUserProductivity = (): NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<
        FetchUserProductivityQuery['usersCollection']
      >['items'][number]
    >['linkedFrom']
  >['researchOutputsCollection']
>['items'] => [
  {
    addedDate: '2023-09-08T03:00:00.000Z',
    sharingStatus: 'Network Only',
    authorsCollection: {
      items: [
        {
          __typename: 'Users',
          sys: {
            id: 'user-1',
          },
        },
      ],
    },
  },
  {
    addedDate: '2023-09-07T03:00:00.000Z',
    sharingStatus: 'Network Only',
    authorsCollection: {
      items: [
        {
          __typename: 'Users',
          sys: {
            id: 'user-2',
          },
        },
        {
          __typename: 'Users',
          sys: {
            id: 'user-3',
          },
        },
      ],
    },
  },
  {
    addedDate: '2023-09-06T03:00:00.000Z',
    sharingStatus: 'Network Only',
    authorsCollection: {
      items: [
        {
          __typename: 'Users',
          sys: {
            id: 'user-1',
          },
        },
      ],
    },
  },
  {
    addedDate: '2023-09-05T03:00:00.000Z',
    sharingStatus: 'Public',
    authorsCollection: {
      items: [
        {
          __typename: 'Users',
          sys: {
            id: 'user-1',
          },
        },
      ],
    },
  },
  {
    addedDate: '2023-07-05T03:00:00.000Z',
    sharingStatus: 'Public',
    authorsCollection: {
      items: [
        {
          __typename: 'Users',
          sys: {
            id: 'user-1',
          },
        },
      ],
    },
  },
];

export const getTeamProductivityDataObject =
  (): TeamProductivityDataObject => ({
    id: 'team-id-0',
    name: 'Team A',
    isInactive: false,
    Article: 1,
    Bioinformatics: 1,
    Dataset: 0,
    'Lab Resource': 0,
    Protocol: 0,
  });

export const getResearchOutputTeamProductivity = (): NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<
        FetchTeamProductivityQuery['teamsCollection']
      >['items'][number]
    >['linkedFrom']
  >['researchOutputsCollection']
>['items'] => [
  {
    addedDate: '2023-09-05T03:00:00.000Z',
    documentType: 'Article',
  },
  {
    addedDate: '2023-09-03T03:00:00.000Z',
    documentType: 'Bioinformatics',
  },
  {
    addedDate: '2023-09-01T03:00:00.000Z',
    documentType: 'Grant Document',
  },
  {
    addedDate: null,
    documentType: 'Protocol',
  },
];

export const getUserProductivityQuery = (): FetchUserProductivityQuery => ({
  usersCollection: {
    total: 1,
    items: [
      {
        sys: {
          id: 'user-1',
        },
        firstName: 'Jane',
        lastName: 'Doe',
        nickname: 'Jenny',
        alumniSinceDate: null,
        linkedFrom: {
          researchOutputsCollection: {
            items: getResearchOutputUserProductivity(),
          },
        },
        teamsCollection: {
          items: [
            {
              role: 'Co-PI (Core Leadership)',
              inactiveSinceDate: null,
              team: {
                sys: { id: '1' },
                displayName: 'Team Alessi',
                inactiveSince: null,
              },
            },
            {
              role: 'Collaborating PI',
              inactiveSinceDate: null,
              team: {
                sys: { id: '2' },
                displayName: 'Team De Camilli',
                inactiveSince: null,
              },
            },
          ],
        },
      },
    ],
  },
});

export const getTeamProductivityQuery = (): FetchTeamProductivityQuery => ({
  teamsCollection: {
    total: 1,
    items: [
      {
        sys: {
          id: 'team-id-0',
        },
        displayName: 'Team A',
        inactiveSince: null,
        linkedFrom: {
          researchOutputsCollection: {
            items: getResearchOutputTeamProductivity(),
          },
        },
      },
    ],
  },
});

export const getListUserProductivityDataObject =
  (): ListUserProductivityDataObject => ({
    total: 1,
    items: [getUserProductivityDataObject()],
  });

export const getListTeamProductivityDataObject =
  (): ListTeamProductivityDataObject => ({
    total: 1,
    items: [getTeamProductivityDataObject()],
  });

export const getUserProductivityResponse = (): UserProductivityResponse =>
  getUserProductivityDataObject();

export const getListUserProductivityResponse =
  (): ListUserProductivityResponse => getListUserProductivityDataObject();

export const getTeamProductivityResponse = (): TeamProductivityResponse =>
  getTeamProductivityDataObject();

export const getListTeamProductivityResponse =
  (): ListTeamProductivityResponse => getListTeamProductivityDataObject();

export const getUserCollaborationQuery = (): FetchUserCollaborationQuery => ({
  usersCollection: {
    total: 1,
    items: [
      {
        sys: {
          id: 'user-1',
        },
        firstName: 'Jane',
        lastName: 'Doe',
        nickname: 'Jenny',
        alumniSinceDate: null,
        linkedFrom: {
          researchOutputsCollection: {
            items: getResearchOutputUserProductivity(),
          },
        },
        teamsCollection: {
          items: [
            {
              role: 'Co-PI (Core Leadership)',
              inactiveSinceDate: null,
              team: {
                sys: {
                  id: 'team-1',
                },
                displayName: 'Team Alessi',
                inactiveSince: null,
              },
            },
            {
              role: 'Collaborating PI',
              inactiveSinceDate: null,
              team: {
                sys: {
                  id: 'team-2',
                },
                displayName: 'Team De Camilli',
                inactiveSince: null,
              },
            },
          ],
        },
      },
    ],
  },
});

export const getResearchOutputTeamCollaboration = (): NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<
        FetchTeamCollaborationQuery['teamsCollection']
      >['items'][number]
    >['linkedFrom']
  >['researchOutputsCollection']
>['items'] => [
  {
    addedDate: '2023-09-05T03:00:00.000Z',
    documentType: 'Article',
    labsCollection: {
      total: 3,
    },
    teamsCollection: {
      items: [
        {
          sys: {
            id: 'team-id-0',
          },
          displayName: 'Team A',
          inactiveSince: null,
        },
        {
          sys: {
            id: 'team-id-1',
          },
          displayName: 'Team B',
          inactiveSince: null,
        },
      ],
    },
  },
];

export const getTeamCollaborationQuery = (): FetchTeamCollaborationQuery => ({
  teamsCollection: {
    total: 1,
    items: [
      {
        sys: {
          id: 'team-1',
        },
        displayName: 'Team A',
        inactiveSince: null,
        linkedFrom: {
          researchOutputsCollection: {
            items: [
              {
                addedDate: '2023-09-01T03:00:00.000Z',
                createdDate: '',
                documentType: '',
                labsCollection: {
                  total: 3,
                },
                teamsCollection: {
                  items: [
                    {
                      sys: {
                        id: 'team-1',
                      },
                      displayName: 'Team A',
                      inactiveSince: null,
                    },
                    {
                      sys: {
                        id: 'team-2',
                      },
                      displayName: 'Team B',
                      inactiveSince: null,
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    ],
  },
});

export const getUserCollaborationDataObject =
  (): UserCollaborationDataObject => ({
    id: 'user-1',
    isAlumni: false,
    name: 'User User',
    teams: [],
  });

export const getTeamCollaborationDataObject =
  (): TeamCollaborationDataObject => ({
    id: 'team-id-0',
    isInactive: false,
    name: 'Team A',
    outputsCoProducedWithin: {
      Article: 1,
      Bioinformatics: 0,
      Dataset: 0,
      'Lab Resource': 0,
      Protocol: 0,
    },
    outputsCoProducedAcross: {
      byDocumentType: {
        Article: 1,
        Bioinformatics: 0,
        Dataset: 0,
        'Lab Resource': 0,
        Protocol: 0,
      },
      byTeam: [
        {
          id: 'team-id-1',
          name: 'Team B',
          isInactive: false,
          Article: 1,
          Bioinformatics: 0,
          Dataset: 0,
          'Lab Resource': 0,
          Protocol: 0,
        },
      ],
    },
  });

export const getUserCollaborationResponse = (): UserCollaborationResponse =>
  getUserCollaborationDataObject();

export const getTeamCollaborationResponse = (): TeamCollaborationResponse =>
  getTeamCollaborationDataObject();

export const getListUserCollaborationResponse =
  (): ListUserCollaborationResponse => ({
    total: 1,
    items: [getUserCollaborationResponse()],
  });

export const getListTeamCollaborationResponse =
  (): ListTeamCollaborationResponse => ({
    total: 1,
    items: [getTeamCollaborationResponse()],
  });
