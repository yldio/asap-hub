import {
  FetchTeamCollaborationQuery,
  FetchUserResearchOutputsQuery,
  FetchUserTotalResearchOutputsQuery,
} from '@asap-hub/contentful';
import {
  getTeamCollaborationItems,
  getUserCollaborationItems,
  getUserDataById,
  UserData,
} from '../../../src/utils/analytics/collaboration';
import { getUserTotalResearchOutputsItem } from '../../fixtures/analytics.fixtures';

describe('getUserCollaborationItems', () => {
  beforeAll(() => {
    jest.useFakeTimers();

    jest.setSystemTime(new Date('2023-09-10T03:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('getUserDataById', () => {
    const getUserItems = (): NonNullable<
      FetchUserTotalResearchOutputsQuery['usersCollection']
    >['items'] => [
      getUserTotalResearchOutputsItem({
        userId: 'user-1',
        researchOutputs: 1,
        labIds: ['lab-1'],
        teams: [
          {
            role: 'Key Personnel',
            id: 'team-1',
            name: 'Team 1',
            teamInactiveSince: null,
            teamMembershipInactiveSince: null,
          },
          {
            role: 'ASAP Staff',
            id: 'team-2',
            name: 'Team 2',
            teamInactiveSince: '2024-08-06',
            teamMembershipInactiveSince: null,
          },
        ],
      }),
      getUserTotalResearchOutputsItem({
        userId: 'user-2',
        labIds: ['lab-2'],
        researchOutputs: 3,
        teams: [
          {
            role: 'Trainee',
            id: 'team-1',
            name: 'Team 1',
            teamInactiveSince: null,
            teamMembershipInactiveSince: '2024-08-01',
          },
        ],
      }),
    ];

    it('handles null teamsCollection', () => {
      const userItems = getUserItems();
      userItems[0]!.teamsCollection = null;

      expect(getUserDataById(userItems)).toEqual(
        expect.objectContaining({
          'user-1': expect.objectContaining({
            teamIds: [],
            teams: [],
          }),
        }),
      );
    });

    it('handles null labsCollection', () => {
      const userItems = getUserItems();
      userItems[0]!.labsCollection = null;

      expect(getUserDataById(userItems)).toEqual(
        expect.objectContaining({
          'user-1': expect.objectContaining({
            labIds: [],
          }),
        }),
      );
    });

    it('handles null researchOutputsCollection', () => {
      const userItems = getUserItems();
      userItems[0]!.linkedFrom!.researchOutputsCollection = null;

      expect(getUserDataById(userItems)).toEqual(
        expect.objectContaining({
          'user-1': expect.objectContaining({
            researchOutputs: 0,
          }),
        }),
      );
    });

    it('handles null userItems', () => {
      const userItems = getUserItems();
      userItems[0] = null;

      expect(getUserDataById(userItems)).toEqual({
        'user-2': {
          alumniSince: undefined,
          labIds: ['lab-2'],
          name: 'John (Johnny) Doe',
          researchOutputs: 3,
          teamIds: ['team-1'],
          teams: [
            {
              id: 'team-1',
              role: 'Trainee',
              team: 'Team 1',
              teamInactiveSince: undefined,
              teamMembershipInactiveSince: '2024-08-01',
            },
          ],
        },
      });
    });

    it('parses the query value and returns user data by id', () => {
      expect(getUserDataById(getUserItems())).toEqual({
        'user-1': {
          alumniSince: undefined,
          labIds: ['lab-1'],
          name: 'John (Johnny) Doe',
          researchOutputs: 1,
          teamIds: ['team-1', 'team-2'],
          teams: [
            {
              id: 'team-1',
              role: 'Key Personnel',
              team: 'Team 1',
              teamInactiveSince: undefined,
              teamMembershipInactiveSince: undefined,
            },
            {
              id: 'team-2',
              role: 'ASAP Staff',
              team: 'Team 2',
              teamInactiveSince: '2024-08-06',
              teamMembershipInactiveSince: undefined,
            },
          ],
        },
        'user-2': {
          alumniSince: undefined,
          labIds: ['lab-2'],
          name: 'John (Johnny) Doe',
          researchOutputs: 3,
          teamIds: ['team-1'],
          teams: [
            {
              id: 'team-1',
              role: 'Trainee',
              team: 'Team 1',
              teamInactiveSince: undefined,
              teamMembershipInactiveSince: '2024-08-01',
            },
          ],
        },
      });
    });
  });

  const collection: FetchUserResearchOutputsQuery['usersCollection'] = {
    total: 1741,
    items: [
      {
        sys: {
          id: 'monica',
        },
        linkedFrom: {
          researchOutputsCollection: {
            items: [
              {
                sys: {
                  id: 'research-output-1',
                },
                addedDate: '2024-07-02T08:12:02.234Z',
                documentType: 'Bioinformatics',
                authorsCollection: {
                  items: [
                    {
                      __typename: 'Users',
                      sys: {
                        id: 'monica',
                      },
                    },
                    {
                      __typename: 'ExternalAuthors',
                    },
                    {
                      __typename: 'Users',
                      sys: {
                        id: 'phoebe',
                      },
                    },
                    {
                      __typename: 'Users',
                      sys: {
                        id: 'rachel',
                      },
                    },
                  ],
                },
              },
              {
                sys: {
                  id: 'research-output-2',
                },
                addedDate: '2024-07-02T08:19:11.314Z',
                documentType: 'Bioinformatics',
                authorsCollection: {
                  items: [
                    {
                      __typename: 'Users',
                      sys: {
                        id: 'monica',
                      },
                    },
                    {
                      __typename: 'ExternalAuthors',
                    },
                  ],
                },
              },
            ],
          },
        },
      },
      {
        sys: {
          id: 'phoebe',
        },
        linkedFrom: {
          researchOutputsCollection: {
            items: [
              {
                sys: {
                  id: 'research-output-1',
                },
                addedDate: '2024-07-02T08:12:02.234Z',
                documentType: 'Bioinformatics',
                authorsCollection: {
                  items: [
                    {
                      __typename: 'Users',
                      sys: {
                        id: 'monica',
                      },
                    },
                    {
                      __typename: 'ExternalAuthors',
                    },
                    {
                      __typename: 'Users',
                      sys: {
                        id: 'phoebe',
                      },
                    },
                    {
                      __typename: 'Users',
                      sys: {
                        id: 'rachel',
                      },
                    },
                  ],
                },
              },
              {
                sys: {
                  id: 'research-output-3',
                },
                addedDate: '2024-07-02T08:19:11.314Z',
                documentType: 'Article',
                authorsCollection: {
                  items: [
                    {
                      __typename: 'Users',
                      sys: {
                        id: 'phoebe',
                      },
                    },
                    {
                      __typename: 'Users',
                      sys: {
                        id: 'ross',
                      },
                    },
                  ],
                },
              },
              {
                sys: {
                  id: 'research-output-4',
                },
                addedDate: '2024-07-02T08:19:11.314Z',
                documentType: 'Article',
                authorsCollection: {
                  items: [
                    {
                      __typename: 'Users',
                      sys: {
                        id: 'phoebe',
                      },
                    },
                    {
                      __typename: 'Users',
                      sys: {
                        id: 'chandler',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      },
      {
        sys: {
          id: 'rachel',
        },
        linkedFrom: {
          researchOutputsCollection: {
            items: [
              {
                sys: {
                  id: 'research-output-1',
                },
                addedDate: '2024-07-02T08:12:02.234Z',
                documentType: 'Bioinformatics',
                authorsCollection: {
                  items: [
                    {
                      __typename: 'Users',
                      sys: {
                        id: 'monica',
                      },
                    },
                    {
                      __typename: 'ExternalAuthors',
                    },
                    {
                      __typename: 'Users',
                      sys: {
                        id: 'phoebe',
                      },
                    },
                    {
                      __typename: 'Users',
                      sys: {
                        id: 'rachel',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    ],
  };

  const userDataById: { [userId: string]: UserData } = {
    monica: {
      name: 'Monica Geller',
      teams: [
        {
          id: 'alessi',
          team: 'Alessi',
          role: 'Key Personnel',
        },
        {
          id: 'chen',
          team: 'Chen',
          role: 'Project Manager',
        },
      ],
      labIds: ['halliday'],
      teamIds: ['alessi', 'chen'],
      researchOutputs: 2,
    },
    phoebe: {
      name: 'Phoebe Buffay',
      alumniSince: '2024-07-11T00:00:00.000-04:00',
      teams: [
        {
          id: 'chen',
          team: 'Chen',
          role: 'Collaborating PI',
        },
      ],
      labIds: ['powell'],
      teamIds: ['chen'],
      researchOutputs: 3,
    },
    rachel: {
      name: 'Rachel Green',
      teams: [
        {
          id: 'asap',
          team: 'ASAP',
          role: 'Collaborating PI',
        },
      ],
      labIds: ['powell'],
      teamIds: ['asap'],
      researchOutputs: 1,
    },
  };

  it('returns user collaboration items', () => {
    expect(getUserCollaborationItems(collection, userDataById)).toEqual([
      {
        id: 'monica',
        name: 'Monica Geller',
        alumniSince: undefined,
        teams: [
          {
            id: 'alessi',
            team: 'Alessi',
            role: 'Key Personnel',
            outputsCoAuthoredWithinTeam: 0,
            outputsCoAuthoredAcrossTeams: 1,
          },
          {
            id: 'chen',
            team: 'Chen',
            role: 'Project Manager',
            outputsCoAuthoredWithinTeam: 1,
            outputsCoAuthoredAcrossTeams: 1,
          },
        ],
        totalUniqueOutputsCoAuthoredWithinTeam: 1,
        totalUniqueOutputsCoAuthoredAcrossTeams: 1,
      },
      {
        id: 'phoebe',
        name: 'Phoebe Buffay',
        alumniSince: '2024-07-11T00:00:00.000-04:00',
        teams: [
          {
            id: 'chen',
            team: 'Chen',
            role: 'Collaborating PI',
            outputsCoAuthoredWithinTeam: 1,
            outputsCoAuthoredAcrossTeams: 3,
          },
        ],
        totalUniqueOutputsCoAuthoredWithinTeam: 1,
        totalUniqueOutputsCoAuthoredAcrossTeams: 3,
      },
      {
        id: 'rachel',
        name: 'Rachel Green',
        alumniSince: undefined,
        teams: [
          {
            id: 'asap',
            team: 'ASAP',
            role: 'Collaborating PI',
            outputsCoAuthoredWithinTeam: 0,
            outputsCoAuthoredAcrossTeams: 1,
          },
        ],
        totalUniqueOutputsCoAuthoredWithinTeam: 0,
        totalUniqueOutputsCoAuthoredAcrossTeams: 1,
      },
    ]);
  });
});

describe('getTeamCollaborationItems ', () => {
  beforeAll(() => {
    jest.useFakeTimers();

    jest.setSystemTime(new Date('2023-09-10T03:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('across teams', () => {
    it('counts outputs with multiple teams', () => {
      const data: FetchTeamCollaborationQuery['teamsCollection'] = {
        items: [
          {
            sys: { id: 'team-1' },
            linkedFrom: {
              researchOutputsCollection: {
                items: [
                  {
                    documentType: 'Article',
                    addedDate: '2023-09-01T03:00:00.000Z',
                    teamsCollection: {
                      items: [
                        {
                          sys: { id: 'team-1' },
                        },
                        {
                          sys: { id: 'team-2' },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          },
        ],
        total: 1,
      };

      const outputsCoProducedAcross =
        getTeamCollaborationItems(data)[0]!.outputsCoProducedAcross;

      expect(outputsCoProducedAcross.byDocumentType).toEqual(
        expect.objectContaining({
          Article: 1,
        }),
      );
      expect(
        getTeamCollaborationItems(data)[0]?.outputsCoProducedAcross.byTeam[0],
      ).toEqual(
        expect.objectContaining({
          Article: 1,
        }),
      );
    });

    it('does not count outputs with one team', () => {
      const data: FetchTeamCollaborationQuery['teamsCollection'] = {
        items: [
          {
            sys: { id: 'team-1' },
            linkedFrom: {
              researchOutputsCollection: {
                items: [
                  {
                    documentType: 'Article',
                    addedDate: '2023-09-01T03:00:00.000Z',
                    teamsCollection: {
                      items: [
                        {
                          sys: { id: 'team-1' },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          },
        ],
        total: 1,
      };

      const outputsCoProducedAcross =
        getTeamCollaborationItems(data)[0]!.outputsCoProducedAcross;

      expect(outputsCoProducedAcross.byDocumentType).toEqual(
        expect.objectContaining({
          Article: 0,
        }),
      );
      expect(
        getTeamCollaborationItems(data)[0]?.outputsCoProducedAcross.byTeam
          .length,
      ).toBe(0);
    });
  });
  describe('within teams', () => {
    it('counts outputs with multiple labs', () => {
      const data: FetchTeamCollaborationQuery['teamsCollection'] = {
        items: [
          {
            sys: { id: 'team-1' },
            linkedFrom: {
              researchOutputsCollection: {
                items: [
                  {
                    documentType: 'Article',
                    addedDate: '2023-09-01T03:00:00.000Z',
                    labsCollection: {
                      total: 2,
                    },
                  },
                ],
              },
            },
          },
        ],
        total: 1,
      };
      const outputsCoProducedWithin =
        getTeamCollaborationItems(data)[0]!.outputsCoProducedWithin;

      expect(outputsCoProducedWithin).toEqual(
        expect.objectContaining({
          Article: 1,
        }),
      );
    });

    it('does not count outputs with one lab', () => {
      const data: FetchTeamCollaborationQuery['teamsCollection'] = {
        items: [
          {
            sys: { id: 'team-1' },
            linkedFrom: {
              researchOutputsCollection: {
                items: [
                  {
                    documentType: 'Article',
                    addedDate: '2023-09-01T03:00:00.000Z',
                    labsCollection: {
                      total: 1,
                    },
                  },
                ],
              },
            },
          },
        ],
        total: 1,
      };

      const outputsCoProducedWithin =
        getTeamCollaborationItems(data)[0]!.outputsCoProducedWithin;

      expect(outputsCoProducedWithin).toEqual(
        expect.objectContaining({
          Article: 0,
        }),
      );
      expect(
        getTeamCollaborationItems(data)[0]?.outputsCoProducedAcross.byTeam
          .length,
      ).toBe(0);
    });
  });
});
