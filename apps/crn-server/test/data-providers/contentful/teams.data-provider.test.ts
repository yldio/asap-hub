import { GraphQLError } from 'graphql';
import {
  getContentfulGraphqlClientMockServer,
  Environment,
} from '@asap-hub/contentful';

import {
  getContentfulGraphql,
  getContentfulGraphqlTeamMembers,
  getContentfulGraphqlTeamMemberLabs,
  getContentfulTeamsGraphqlResponse,
  getTeamDataObject,
  getTeamListItemDataObject,
  getContentfulGraphqlTeamById,
  getContentfulGraphqlTeam,
  getUnsortedManuscripts,
  getContentfulGraphqlPublicTeam,
  getPublicTeamListItemDataObject,
} from '../../fixtures/teams.fixtures';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';
import { getContentfulEnvironmentMock } from '../../mocks/contentful-rest-client.mock';
import { TeamContentfulDataProvider } from '../../../src/data-providers/contentful/team.data-provider';
import { getEntry } from '../../fixtures/contentful.fixtures';
import { TeamRole } from '@asap-hub/model';
import { DateTime } from 'luxon';

describe('Teams data provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
  const environmentMock = getContentfulEnvironmentMock();
  const contentfulRestClientMock: () => Promise<Environment> = () =>
    Promise.resolve(environmentMock);

  const teamDataProvider = new TeamContentfulDataProvider(
    contentfulGraphqlClientMock,
    contentfulRestClientMock,
  );

  const contentfulGraphqlClientMockServer =
    getContentfulGraphqlClientMockServer(getContentfulGraphql());

  const teamDataProviderMock = new TeamContentfulDataProvider(
    contentfulGraphqlClientMockServer,
    contentfulRestClientMock,
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Create method', () => {
    test('should throw an error', async () => {
      await expect(teamDataProvider.create()).rejects.toThrow(
        'Method not implemented.',
      );
    });
  });

  describe('Fetch method', () => {
    test('Should fetch the list of teams from Contentful GraphQl', async () => {
      const result = await teamDataProviderMock.fetch({});

      expect(result.items[0]).toMatchObject(getTeamListItemDataObject());
    });

    test('Should return an empty result when no teams exist', async () => {
      const contentfulGraphQLResponse = getContentfulTeamsGraphqlResponse();
      contentfulGraphQLResponse.teamsCollection!.total = 0;
      contentfulGraphQLResponse.teamsCollection!.items = [];

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await teamDataProvider.fetch({});

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should throw an error with a specific error message when the graphql client throws one', async () => {
      contentfulGraphqlClientMock.request.mockRejectedValueOnce(
        new GraphQLError('some error message'),
      );

      await expect(teamDataProvider.fetch({})).rejects.toThrow(
        'some error message',
      );
    });

    test('Should return an empty result when the query is returned as null', async () => {
      const contentfulGraphQLResponse = getContentfulTeamsGraphqlResponse();
      contentfulGraphQLResponse.teamsCollection = null;

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await teamDataProvider.fetch({});

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should use default query params when request does not have any', async () => {
      const contentfulGraphQLResponse = getContentfulTeamsGraphqlResponse();

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await teamDataProvider.fetch({});

      expect(result).toEqual({
        total: 1,
        items: [getTeamListItemDataObject()],
      });

      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          limit: 8,
          order: ['displayName_ASC'],
          skip: 0,
          where: {},
        }),
      );
    });

    describe('Active Filter', () => {
      test('Should return active teams only when active filter is true', async () => {
        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          getContentfulTeamsGraphqlResponse(),
        );

        const result = await teamDataProvider.fetch({
          take: 8,
          skip: 5,
          filter: {
            active: true,
          },
        });

        expect(result).toEqual({
          total: 1,
          items: [getTeamListItemDataObject()],
        });

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            limit: 8,
            order: ['displayName_ASC'],
            skip: 5,
            where: { inactiveSince_exists: false },
          }),
        );
      });

      test('Should return inactive teams only when active filter is false', async () => {
        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          getContentfulTeamsGraphqlResponse(),
        );

        const result = await teamDataProvider.fetch({
          take: 8,
          skip: 5,
          filter: {
            active: false,
          },
        });

        expect(result).toEqual({
          total: 1,
          items: [getTeamListItemDataObject()],
        });

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            limit: 8,
            order: ['displayName_ASC'],
            skip: 5,
            where: { inactiveSince_exists: true },
          }),
        );
      });
    });

    describe('Text Filter', () => {
      test('Should query data properly when passing search param and active filter is not set', async () => {
        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          getContentfulTeamsGraphqlResponse(),
        );

        const search = 'Tony Stark';
        const result = await teamDataProvider.fetch({
          search,
        });

        expect(result).toEqual({
          total: 1,
          items: [getTeamListItemDataObject()],
        });
        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            limit: 8,
            order: ['displayName_ASC'],
            skip: 0,
            where: {
              OR: [
                { displayName_contains: 'Tony' },
                { displayName_contains: 'Stark' },
                { projectTitle_contains: 'Tony' },
                { projectTitle_contains: 'Stark' },
                { researchTags: { name_contains: 'Tony' } },
                { researchTags: { name_contains: 'Stark' } },
              ],
            },
          }),
        );
      });

      test('Should query data properly when passing search param and active filter is set', async () => {
        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          getContentfulTeamsGraphqlResponse(),
        );

        const search = 'Tony Stark';
        const result = await teamDataProvider.fetch({
          take: 8,
          skip: 5,
          search,
          filter: {
            active: false,
          },
        });

        expect(result).toEqual({
          total: 1,
          items: [getTeamListItemDataObject()],
        });
        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            limit: 8,
            order: ['displayName_ASC'],
            skip: 5,
            where: {
              OR: [
                { displayName_contains: 'Tony' },
                { displayName_contains: 'Stark' },
                { projectTitle_contains: 'Tony' },
                { projectTitle_contains: 'Stark' },
                { researchTags: { name_contains: 'Tony' } },
                { researchTags: { name_contains: 'Stark' } },
              ],
              inactiveSince_exists: true,
            },
          }),
        );
      });
    });

    describe('team members', () => {
      test('should ignore falsy items in the team membership list', async () => {
        const team = {
          ...getContentfulGraphqlTeam(),
          linkedFrom: {
            teamMembershipCollection: {
              total: 3,
              items: [
                null,
                {
                  role: 'Project Manager',
                  inactiveSinceDate: null,
                  linkedFrom: {
                    usersCollection: {
                      total: 1,
                      items: [null],
                    },
                  },
                },
                {
                  role: 'Project Manager',
                  inactiveSinceDate: null,
                  linkedFrom: {
                    usersCollection: {
                      total: 1,
                      items: [getContentfulGraphqlTeamMembers()],
                    },
                  },
                },
              ],
            },
          },
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          teamsCollection: {
            total: 1,
            items: [team],
          },
        });

        const result = await teamDataProvider.fetch({});

        expect(result).toEqual({
          items: [expect.objectContaining({ memberCount: 1 })],
          total: 1,
        });
      });

      test('should filter non onboarded users', async () => {
        const team = {
          ...getContentfulGraphqlTeam(),
          linkedFrom: {
            teamMembershipCollection: {
              total: 3,
              items: [
                {
                  role: 'Collaborating PI',
                  inactiveSinceDate: null,
                  linkedFrom: {
                    usersCollection: {
                      total: 1,
                      items: [getContentfulGraphqlTeamMembers()],
                    },
                  },
                },
                {
                  role: 'Key Personnel',
                  inactiveSinceDate: null,
                  linkedFrom: {
                    usersCollection: {
                      total: 1,
                      items: [
                        {
                          ...getContentfulGraphqlTeamMembers(),
                          onboarded: false,
                        },
                      ],
                    },
                  },
                },
                {
                  role: 'Project Manager',
                  inactiveSinceDate: null,
                  linkedFrom: {
                    usersCollection: {
                      total: 1,
                      items: [getContentfulGraphqlTeamMembers()],
                    },
                  },
                },
              ],
            },
          },
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          teamsCollection: {
            total: 1,
            items: [team],
          },
        });

        const result = await teamDataProvider.fetch({});

        expect(result).toEqual({
          items: [expect.objectContaining({ memberCount: 2 })],
          total: 1,
        });
      });
    });

    describe('labs', () => {
      test('should add a lab count to the team response', async () => {
        const team = {
          ...getContentfulGraphqlTeam(),
          linkedFrom: {
            teamMembershipCollection: {
              total: 1,
              items: [
                {
                  role: 'Project Manager',
                  inactiveSinceDate: null,
                  linkedFrom: {
                    usersCollection: {
                      total: 1,
                      items: [
                        {
                          ...getContentfulGraphqlTeamMembers(),
                          labsCollection: {
                            items: [
                              { sys: { id: 'lab-1' } },
                              { sys: { id: 'lab-2' } },
                            ],
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          teamsCollection: {
            total: 1,
            items: [team],
          },
        });

        const result = await teamDataProvider.fetch({});

        expect(result).toEqual({
          items: [expect.objectContaining({ labCount: 2 })],
          total: 1,
        });
      });
      test('should ignore null labs', async () => {
        const team = {
          ...getContentfulGraphqlTeam(),
          linkedFrom: {
            teamMembershipCollection: {
              total: 1,
              items: [
                {
                  role: 'Project Manager',
                  inactiveSinceDate: null,
                  linkedFrom: {
                    usersCollection: {
                      total: 1,
                      items: [
                        {
                          ...getContentfulGraphqlTeamMembers(),
                          labsCollection: {
                            items: [null, { sys: { id: 'lab-2' } }],
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          teamsCollection: {
            total: 1,
            items: [team],
          },
        });

        const result = await teamDataProvider.fetch({});

        expect(result).toEqual({
          items: [expect.objectContaining({ labCount: 1 })],
          total: 1,
        });
      });
      test('should include only unique labs in the lab count', async () => {
        const team = {
          ...getContentfulGraphqlTeam(),
          linkedFrom: {
            teamMembershipCollection: {
              total: 2,
              items: [
                {
                  role: 'Key Personnel',
                  inactiveSinceDate: null,
                  linkedFrom: {
                    usersCollection: {
                      total: 1,
                      items: [
                        {
                          ...getContentfulGraphqlTeamMembers(),
                          labsCollection: {
                            items: [
                              { sys: { id: 'lab-1' } },
                              { sys: { id: 'lab-2' } },
                              { sys: { id: 'lab-3' } },
                            ],
                          },
                        },
                      ],
                    },
                  },
                },
                {
                  role: 'Project Manager',
                  inactiveSinceDate: null,
                  linkedFrom: {
                    usersCollection: {
                      total: 1,
                      items: [
                        {
                          ...getContentfulGraphqlTeamMembers(),
                          labsCollection: {
                            items: [
                              { sys: { id: 'lab-1' } },
                              { sys: { id: 'lab-2' } },
                              { sys: { id: 'lab-4' } },
                            ],
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          teamsCollection: {
            total: 1,
            items: [team],
          },
        });
        const result = await teamDataProvider.fetch({});

        expect(result).toEqual({
          items: [expect.objectContaining({ labCount: 4 })],
          total: 1,
        });
      });
    });
  });

  describe('FetchPublicTeams method', () => {
    test('Should fetch the list of teams from Contentful GraphQl', async () => {
      const contentfulGraphQLResponse = {
        teamsCollection: {
          total: 1,
          items: [getContentfulGraphqlPublicTeam()],
        },
      };

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await teamDataProvider.fetchPublicTeams({});

      expect(result).toEqual({
        total: 1,
        items: [getPublicTeamListItemDataObject()],
      });
    });

    test('Should return an empty result when no teams exist', async () => {
      const contentfulGraphQLResponse = getContentfulTeamsGraphqlResponse();
      contentfulGraphQLResponse.teamsCollection!.total = 0;
      contentfulGraphQLResponse.teamsCollection!.items = [];

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await teamDataProvider.fetchPublicTeams({});

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should return an empty result when the query is returned as null', async () => {
      const contentfulGraphQLResponse = getContentfulTeamsGraphqlResponse();
      contentfulGraphQLResponse.teamsCollection = null;

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await teamDataProvider.fetchPublicTeams({});

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should throw an error with a specific error message when the graphql client throws one', async () => {
      contentfulGraphqlClientMock.request.mockRejectedValueOnce(
        new GraphQLError('some error message'),
      );

      await expect(teamDataProvider.fetchPublicTeams({})).rejects.toThrow(
        'some error message',
      );
    });

    test('Should use default query params when request does not have any', async () => {
      const contentfulGraphQLResponse = {
        teamsCollection: {
          total: 1,
          items: [getContentfulGraphqlPublicTeam()],
        },
      };

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await teamDataProvider.fetchPublicTeams({});

      expect(result).toEqual({
        total: 1,
        items: [getPublicTeamListItemDataObject()],
      });

      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          limit: 8,
          order: ['displayName_ASC'],
          skip: 0,
        }),
      );
    });

    describe('team members', () => {
      test('should ignore falsy items in the team membership list', async () => {
        const team = {
          ...getContentfulGraphqlPublicTeam(),
          linkedFrom: {
            teamMembershipCollection: {
              total: 3,
              items: [
                null,
                {
                  role: 'Project Manager',
                  inactiveSinceDate: null,
                  linkedFrom: {
                    usersCollection: {
                      total: 1,
                      items: [null],
                    },
                  },
                },
                {
                  role: 'Project Manager',
                  inactiveSinceDate: null,
                  linkedFrom: {
                    usersCollection: {
                      total: 1,
                      items: [
                        {
                          ...getContentfulGraphqlTeamMembers(),
                          alumniSinceDate: null,
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          teamsCollection: {
            total: 1,
            items: [team],
          },
        });

        const result = await teamDataProvider.fetchPublicTeams({});

        expect(result).toEqual({
          items: [expect.objectContaining({ noOfTeamMembers: 1 })],
          total: 1,
        });
      });

      test('should filter out non onboarded users', async () => {
        const team = {
          ...getContentfulGraphqlPublicTeam(),
          linkedFrom: {
            teamMembershipCollection: {
              total: 1,
              items: [
                {
                  role: 'Key Personnel',
                  inactiveSinceDate: null,
                  linkedFrom: {
                    usersCollection: {
                      total: 1,
                      items: [
                        {
                          ...getContentfulGraphqlTeamMembers(),
                          alumniSinceDate: null,
                          onboarded: false,
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          teamsCollection: {
            total: 1,
            items: [team],
          },
        });

        const result = await teamDataProvider.fetchPublicTeams({});

        expect(result).toEqual({
          items: [expect.objectContaining({ noOfTeamMembers: 0 })],
          total: 1,
        });
      });

      test('should return all members as inactive if team is inactive', async () => {
        const team = {
          ...getContentfulGraphqlPublicTeam(),
          inactiveSince: '2020-09-23T20:45:22.000Z',
          linkedFrom: {
            teamMembershipCollection: {
              total: 1,
              items: [
                {
                  role: 'Key Personnel',
                  inactiveSinceDate: null,
                  linkedFrom: {
                    usersCollection: {
                      total: 1,
                      items: [
                        {
                          ...getContentfulGraphqlTeamMembers(),
                          sys: {
                            id: 'user-id-1',
                          },
                          alumniSinceDate: null,
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          teamsCollection: {
            total: 1,
            items: [team],
          },
        });

        const result = await teamDataProvider.fetchPublicTeams({});

        expect(result).toEqual({
          items: [
            expect.objectContaining({
              noOfTeamMembers: 0,
              inactiveTeamMembers: ['user-id-1'],
            }),
          ],
          total: 1,
        });
      });
    });
  });

  describe('Fetch-by-id method', () => {
    test('Should fetch the team from Contentful GraphQl', async () => {
      const teamId = 'team-id-0';
      const teamName = 'Team A';

      const expectedResult = getTeamDataObject();
      expectedResult.manuscripts[0]!.versions[0]!.teams[0]!.id = teamId;
      expectedResult.manuscripts[0]!.versions[0]!.teams[0]!.displayName =
        teamName;
      expectedResult.manuscripts[1]!.versions[0]!.teams[0]!.id = teamId;
      expectedResult.manuscripts[1]!.versions[0]!.teams[0]!.displayName =
        teamName;

      const teamById = true;
      const contentfulGraphqlClientMockServer =
        getContentfulGraphqlClientMockServer({
          ...getContentfulGraphql(teamById, teamId),
          ManuscriptVersionsTeamsCollection: () => ({
            items: [{ sys: { id: teamId }, displayName: teamName }],
          }),
        });

      const teamByIdDataProviderMock = new TeamContentfulDataProvider(
        contentfulGraphqlClientMockServer,
        contentfulRestClientMock,
      );

      const result = await teamByIdDataProviderMock.fetchById(teamId);

      expect(result).toMatchObject(expectedResult);
    });

    test('should sort manuscripts so that Compliant and Closed (other) are last', async () => {
      const teamId = 'team-id';

      const team = {
        ...getContentfulGraphqlTeamById(teamId),
        linkedFrom: getUnsortedManuscripts(teamId),
      };

      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        teams: team,
      });

      const result = await teamDataProvider.fetchById(teamId);

      expect(result?.manuscripts.map((m) => m.status)).toEqual([
        'Waiting for Report',
        'Submit Final Publication',
        'Compliant',
        'Closed (other)',
      ]);
    });

    test('Should return null when the team is not found', async () => {
      const teamId = 'not-found';

      const contentfulGraphQLResponse = getContentfulTeamsGraphqlResponse();
      contentfulGraphQLResponse.teamsCollection = null;

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      expect(await teamDataProvider.fetchById(teamId)).toBeNull();
    });

    test('Should throw an error with a specific error message when the graphql client throws one', async () => {
      const id = 'some-id';
      contentfulGraphqlClientMock.request.mockRejectedValueOnce(
        new GraphQLError('some error message'),
      );

      await expect(teamDataProvider.fetchById(id)).rejects.toThrow(
        'some error message',
      );
    });

    describe('team members', () => {
      test('should ignore falsy items in the team membership list', async () => {
        const id = 'some-id';
        const contentfulGraphQLResponse = {
          teams: {
            ...getContentfulGraphqlTeamById(),
            linkedFrom: {
              teamMembershipCollection: {
                total: 3,
                items: [
                  null,
                  {
                    role: 'Project Manager',
                    inactiveSinceDate: null,
                    linkedFrom: {
                      usersCollection: {
                        total: 1,
                        items: [null],
                      },
                    },
                  },
                  {
                    role: 'Project Manager',
                    inactiveSinceDate: null,
                    linkedFrom: {
                      usersCollection: {
                        total: 1,
                        items: [getContentfulGraphqlTeamMembers()],
                      },
                    },
                  },
                ],
              },
            },
          },
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          contentfulGraphQLResponse,
        );

        const result = await teamDataProvider.fetchById(id);

        expect(result?.members).toHaveLength(1);
        expect(result?.members[0]?.firstName).toEqual('Tom');
        expect(result?.members[0]?.lastName).toEqual('Hardy');
      });

      test('should filter non onboarded users', async () => {
        const id = 'some-id';
        const contentfulGraphQLResponse = {
          teams: {
            ...getContentfulGraphqlTeamById(),
            linkedFrom: {
              teamMembershipCollection: {
                total: 3,
                items: [
                  {
                    role: 'Collaborating PI',
                    inactiveSinceDate: null,
                    linkedFrom: {
                      usersCollection: {
                        total: 1,
                        items: [getContentfulGraphqlTeamMembers()],
                      },
                    },
                  },
                  {
                    role: 'Key Personnel',
                    inactiveSinceDate: null,
                    linkedFrom: {
                      usersCollection: {
                        total: 1,
                        items: [
                          {
                            ...getContentfulGraphqlTeamMembers(),
                            onboarded: false,
                          },
                        ],
                      },
                    },
                  },
                  {
                    role: 'Project Manager',
                    inactiveSinceDate: null,
                    linkedFrom: {
                      usersCollection: {
                        total: 1,
                        items: [getContentfulGraphqlTeamMembers()],
                      },
                    },
                  },
                ],
              },
            },
          },
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          contentfulGraphQLResponse,
        );

        const result = await teamDataProvider.fetchById(id);

        expect(result?.members).toHaveLength(2);
        expect(result?.members[0]?.role).toEqual('Project Manager');
        expect(result?.members[1]?.role).toEqual('Collaborating PI');
      });

      test('should sort team members by role priority', async () => {
        const contentfulGraphQLResponse = {
          teams: {
            ...getContentfulGraphqlTeamById(),
            linkedFrom: {
              teamMembershipCollection: {
                total: 1,
                items: [
                  {
                    role: 'Key Personnel',
                    inactiveSinceDate: null,
                    linkedFrom: {
                      usersCollection: {
                        total: 1,
                        items: [
                          {
                            ...getContentfulGraphqlTeamMembers(),
                            sys: {
                              id: '1',
                            },
                          },
                        ],
                      },
                    },
                  },
                  {
                    role: 'Lead PI (Core Leadership)',
                    inactiveSinceDate: null,
                    linkedFrom: {
                      usersCollection: {
                        total: 1,
                        items: [
                          {
                            ...getContentfulGraphqlTeamMembers(),
                            sys: {
                              id: '2',
                            },
                          },
                        ],
                      },
                    },
                  },
                  {
                    role: 'Project Manager',
                    inactiveSinceDate: null,
                    linkedFrom: {
                      usersCollection: {
                        total: 1,
                        items: [
                          {
                            ...getContentfulGraphqlTeamMembers(),
                            sys: {
                              id: '3',
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
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          contentfulGraphQLResponse,
        );
        const result = await teamDataProvider.fetchById('1');
        expect(result?.members).toEqual([
          expect.objectContaining({
            role: 'Lead PI (Core Leadership)',
            id: '2',
          }),
          expect.objectContaining({ role: 'Project Manager', id: '3' }),
          expect.objectContaining({ role: 'Key Personnel', id: '1' }),
        ]);
      });

      test('should sort team members with the same role priority by last name', async () => {
        const contentfulGraphQLResponse = {
          teams: {
            ...getContentfulGraphqlTeamById(),
            linkedFrom: {
              teamMembershipCollection: {
                total: 1,
                items: [
                  {
                    role: 'Key Personnel',
                    inactiveSinceDate: null,
                    linkedFrom: {
                      usersCollection: {
                        total: 1,
                        items: [
                          {
                            ...getContentfulGraphqlTeamMembers(),
                            lastName: 'Baker',
                            sys: {
                              id: '1',
                            },
                          },
                        ],
                      },
                    },
                  },
                  {
                    role: 'Key Personnel',
                    inactiveSinceDate: null,
                    linkedFrom: {
                      usersCollection: {
                        total: 1,
                        items: [
                          {
                            ...getContentfulGraphqlTeamMembers(),
                            lastName: 'Cooper',
                            sys: {
                              id: '2',
                            },
                          },
                        ],
                      },
                    },
                  },
                  {
                    role: 'Key Personnel',
                    inactiveSinceDate: null,
                    linkedFrom: {
                      usersCollection: {
                        total: 1,
                        items: [
                          {
                            ...getContentfulGraphqlTeamMembers(),
                            lastName: 'Anderson',
                            sys: {
                              id: '3',
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
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          contentfulGraphQLResponse,
        );
        const result = await teamDataProvider.fetchById('1');
        expect(result?.members).toEqual([
          expect.objectContaining({ lastName: 'Anderson' }),
          expect.objectContaining({ lastName: 'Baker' }),
          expect.objectContaining({ lastName: 'Cooper' }),
        ]);
      });
    });

    describe('labs', () => {
      test('should add a lab count to the team response', async () => {
        const id = 'some-id';
        const contentfulGraphQLResponse = {
          teams: getContentfulGraphqlTeamById(),
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          contentfulGraphQLResponse,
        );

        const result = await teamDataProvider.fetchById(id);

        expect(result?.labCount).toEqual(2);
      });
      test('should ignore null labs', async () => {
        const id = 'some-id';
        const contentfulGraphQLResponse = {
          teams: {
            ...getContentfulGraphqlTeamById(),
            linkedFrom: {
              teamMembershipCollection: {
                total: 1,
                items: [
                  {
                    role: 'Project Manager',
                    inactiveSinceDate: null,
                    linkedFrom: {
                      usersCollection: {
                        total: 1,
                        items: [
                          {
                            ...getContentfulGraphqlTeamMembers(),
                            labsCollection: {
                              total: 2,
                              items: [
                                null,
                                ...getContentfulGraphqlTeamMemberLabs()!.items,
                              ],
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
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          contentfulGraphQLResponse,
        );

        const result = await teamDataProvider.fetchById(id);

        expect(result?.labCount).toEqual(2);
      });
      test('should include only unique labs in the lab count', async () => {
        const id = 'some-id';
        const contentfulGraphQLResponse = {
          teams: {
            ...getContentfulGraphqlTeamById(),
            linkedFrom: {
              teamMembershipCollection: {
                total: 2,
                items: [
                  {
                    role: 'Project Manager',
                    inactiveSinceDate: null,
                    linkedFrom: {
                      usersCollection: {
                        total: 1,
                        items: [
                          {
                            ...getContentfulGraphqlTeamMembers(),
                            labsCollection:
                              getContentfulGraphqlTeamMemberLabs(),
                          },
                        ],
                      },
                    },
                  },
                  {
                    role: 'Project Manager',
                    inactiveSinceDate: null,
                    linkedFrom: {
                      usersCollection: {
                        total: 1,
                        items: [
                          {
                            sys: {
                              id: 'user-id-2',
                            },
                            email: 'T@rdy.io',
                            firstName: 'Tim',
                            lastName: 'Hardy',
                            avatar: null,
                            alumniSinceDate: null,
                            labsCollection:
                              getContentfulGraphqlTeamMemberLabs(),
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          },
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          contentfulGraphQLResponse,
        );

        const result = await teamDataProvider.fetchById(id);

        expect(result?.labCount).toEqual(2);
      });
    });

    describe('point of contact', () => {
      type GetTeamMembershipProps = {
        userId?: string;
        role?: TeamRole;
        inactiveSinceDate?: string | null;
        alumniSinceDate?: string | null;
      };

      const getTeamMembership = ({
        userId = 'user-id-1',
        role = 'Collaborating PI',
        inactiveSinceDate = null,
        alumniSinceDate = null,
      }: GetTeamMembershipProps) => {
        return {
          role,
          inactiveSinceDate,
          linkedFrom: {
            usersCollection: {
              total: 1,
              items: [
                {
                  sys: {
                    id: userId,
                  },
                  email: 'T@rdy.io',
                  firstName: 'Tim',
                  lastName: 'Hardy',
                  avatar: null,
                  alumniSinceDate,
                  labsCollection: getContentfulGraphqlTeamMemberLabs(),
                  onboarded: true,
                },
              ],
            },
          },
        };
      };

      test('should return point of contact in team response when there is one active PM', async () => {
        const id = 'some-id';
        const contentfulGraphQLResponse = {
          teams: {
            ...getContentfulGraphqlTeamById(),
            linkedFrom: {
              teamMembershipCollection: {
                total: 3,
                items: [
                  getTeamMembership({ userId: 'non-pm-user' }),
                  getTeamMembership({
                    userId: 'inactive-pm-user',
                    inactiveSinceDate: '2022-02-28T17:00:00.000Z',
                    role: 'Project Manager',
                  }),
                  getTeamMembership({
                    userId: 'active-pm-user',
                    role: 'Project Manager',
                  }),
                ],
              },
            },
          },
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          contentfulGraphQLResponse,
        );

        const result = await teamDataProvider.fetchById(id);

        expect(result!.pointOfContact).toEqual(
          expect.objectContaining({
            id: 'active-pm-user',
            role: 'Project Manager',
            alumniSinceDate: null,
            inactiveSinceDate: undefined,
          }),
        );
      });

      test('should return point of contact as undefined when there is a PM but it is inactive', async () => {
        const id = 'some-id';
        const contentfulGraphQLResponse = {
          teams: {
            ...getContentfulGraphqlTeamById(),
            linkedFrom: {
              teamMembershipCollection: {
                total: 2,
                items: [
                  getTeamMembership({ userId: 'non-pm-user' }),
                  getTeamMembership({
                    userId: 'pm-user',
                    inactiveSinceDate: '2022-02-28T17:00:00.000Z',
                    role: 'Project Manager',
                  }),
                ],
              },
            },
          },
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          contentfulGraphQLResponse,
        );

        const result = await teamDataProvider.fetchById(id);

        expect(result!.pointOfContact).toBeUndefined();
      });

      test('should return point of contact as undefined when there is a PM but it is an alumni', async () => {
        const id = 'some-id';
        const contentfulGraphQLResponse = {
          teams: {
            ...getContentfulGraphqlTeamById(),
            linkedFrom: {
              teamMembershipCollection: {
                total: 2,
                items: [
                  getTeamMembership({ userId: 'non-pm-user' }),
                  getTeamMembership({
                    userId: 'pm-user',
                    alumniSinceDate: '2022-02-28T17:00:00.000Z',
                    role: 'Project Manager',
                  }),
                ],
              },
            },
          },
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          contentfulGraphQLResponse,
        );

        const result = await teamDataProvider.fetchById(id);

        expect(result!.pointOfContact).toBeUndefined();
      });
    });

    describe('supplementGrant', () => {
      const startDate = '2024-09-01T00:00:00.000-03:00';
      const endDate = '2024-09-16T00:00:00.000-03:00';
      beforeAll(() => {
        jest.useFakeTimers();
      });

      afterAll(() => {
        jest.useRealTimers();
      });

      beforeEach(async () => {
        const afterStartDate = DateTime.fromISO(startDate)
          .plus({ minutes: 1 })
          .toJSDate();
        jest.setSystemTime(afterStartDate);
      });

      test('should return supplementGrant when it exists and it has started', async () => {
        const id = 'some-id';
        const contentfulGraphQLResponse = getContentfulGraphqlTeamById();
        contentfulGraphQLResponse.supplementGrant = {
          title: 'Grant Title',
          description: 'Grant Description',
          startDate,
          endDate,
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          teams: contentfulGraphQLResponse,
        });

        const result = await teamDataProvider.fetchById(id);

        expect(result!.supplementGrant).toEqual({
          description: 'Grant Description',
          proposalURL: undefined,
          title: 'Grant Title',
          startDate,
          endDate,
        });
      });

      test('should not return supplementGrant when it exists but it has not started', async () => {
        const beforeStartDate = DateTime.fromISO(startDate)
          .minus({ minutes: 1 })
          .toJSDate();
        jest.setSystemTime(beforeStartDate);

        const id = 'some-id';
        const contentfulGraphQLResponse = getContentfulGraphqlTeamById();
        contentfulGraphQLResponse.supplementGrant = {
          title: 'Grant Title',
          description: 'Grant Description',
          startDate,
          endDate,
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          teams: contentfulGraphQLResponse,
        });

        const result = await teamDataProvider.fetchById(id);

        expect(result!.supplementGrant).toEqual(undefined);
      });

      test('should return supplementGrant proposal when it exists', async () => {
        const id = 'some-id';
        const contentfulGraphQLResponse = getContentfulGraphqlTeamById();
        contentfulGraphQLResponse.supplementGrant = {
          title: 'Grant Title',
          description: 'Grant Description',
          proposal: {
            sys: {
              id: 'proposal-id',
            },
          },
          startDate,
          endDate,
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          teams: contentfulGraphQLResponse,
        });

        const result = await teamDataProvider.fetchById(id);

        expect(result!.supplementGrant).toEqual({
          description: 'Grant Description',
          proposalURL: 'proposal-id',
          title: 'Grant Title',
          startDate,
          endDate,
        });
      });

      test('should return supplementGrant as undefined when title is not set', async () => {
        const id = 'some-id';
        const contentfulGraphQLResponse = getContentfulGraphqlTeamById();
        contentfulGraphQLResponse.supplementGrant = {
          title: null,
          description: null,
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          teams: contentfulGraphQLResponse,
        });

        const result = await teamDataProvider.fetchById(id);

        expect(result!.supplementGrant).toBeUndefined();
      });
    });

    describe('proposalURL', () => {
      test('should return proposalURL in team response when there is one', async () => {
        const id = 'some-id';
        const contentfulGraphQLResponse = {
          teams: {
            ...getContentfulGraphqlTeamById(),
            proposal: {
              sys: {
                id: 'research-output-id',
              },
            },
          },
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          contentfulGraphQLResponse,
        );

        const result = await teamDataProvider.fetchById(id);

        expect(result!.proposalURL).toEqual('research-output-id');
      });

      test('should return proposalURL as undefined when there is not one', async () => {
        const id = 'some-id';
        const contentfulGraphQLResponse = {
          teams: {
            ...getContentfulGraphqlTeamById(),
            proposal: null,
          },
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          contentfulGraphQLResponse,
        );

        const result = await teamDataProvider.fetchById(id);

        expect(result!.proposalURL).toBeUndefined();
      });
    });

    describe('Tools', () => {
      const tools = [
        {
          url: 'testUrl',
          name: 'slack',
          description: 'this is a test',
        },
      ];

      test('Should return team tools by default', async () => {
        const id = 'some-id';
        const contentfulGraphQLResponse = {
          teams: {
            ...getContentfulGraphqlTeamById(),
            toolsCollection: {
              total: 1,
              items: tools,
            },
          },
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          contentfulGraphQLResponse,
        );

        const result = await teamDataProvider.fetchById(id);

        expect(result!.tools).toEqual(tools);
      });

      test('should only return team tools with name and url defined', async () => {
        const id = 'some-id';
        const brokenUrlTools = [
          ...tools,
          {
            url: null,
            name: 'testTool',
            description: 'tool description',
          },
        ];

        const contentfulGraphQLResponse = {
          teams: {
            ...getContentfulGraphqlTeamById(),
            toolsCollection: {
              total: 2,
              items: brokenUrlTools,
            },
          },
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          contentfulGraphQLResponse,
        );

        const result = await teamDataProvider.fetchById(id);

        expect(result!.tools).toEqual(tools);
      });
    });
  });

  describe('Update method', () => {
    test("Should update the team when there isn't tools previously", async () => {
      const teamId = 'team-id-1';
      const tool = {
        name: 'Youtube Channel',
        description: 'Youtube channel with team videos',
        url: 'http://www.youtube.com/abcde',
      };

      const toolMock = getEntry({});
      environmentMock.createEntry.mockResolvedValueOnce(toolMock);
      toolMock.publish = jest.fn().mockResolvedValueOnce(toolMock);

      const teamMock = getEntry({});
      environmentMock.getEntry.mockResolvedValueOnce(teamMock);
      const teamMockUpdated = getEntry({});
      teamMock.patch = jest.fn().mockResolvedValueOnce(teamMockUpdated);

      await teamDataProviderMock.update(teamId, { tools: [tool] });

      expect(environmentMock.getEntry).toHaveBeenCalledWith(teamId);
      expect(environmentMock.createEntry).toHaveBeenCalledWith(
        'externalTools',
        {
          fields: {
            description: { 'en-US': tool.description },
            name: { 'en-US': tool.name },
            url: { 'en-US': tool.url },
          },
        },
      );
      expect(teamMock.patch).toHaveBeenCalledWith([
        {
          op: 'add',
          path: '/fields/tools',
          value: {
            'en-US': [
              {
                sys: {
                  id: 'entry-id',
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
            ],
          },
        },
      ]);

      expect(teamMockUpdated.publish).toHaveBeenCalled();
    });

    test('Should update the team when the field tools is populated previously', async () => {
      const teamId = 'team-id-1';
      const tool = {
        name: 'Youtube Channel',
        description: 'Youtube channel with team videos',
        url: 'http://www.youtube.com/abcde',
      };

      const toolMock = getEntry({});
      toolMock.sys.id = 'new-tool';
      environmentMock.createEntry.mockResolvedValueOnce(toolMock);
      toolMock.publish = jest.fn().mockResolvedValueOnce(toolMock);

      const teamMock = getEntry({
        tools: {
          'en-US': [
            {
              sys: {
                id: 'old-tool-1',
                linkType: 'Entry',
                type: 'Link',
              },
            },
            {
              sys: {
                id: 'old-tool-2',
                linkType: 'Entry',
                type: 'Link',
              },
            },
          ],
        },
      });
      environmentMock.getEntry.mockResolvedValueOnce(teamMock);
      const teamMockUpdated = getEntry({});
      teamMock.patch = jest.fn().mockResolvedValueOnce(teamMockUpdated);

      await teamDataProviderMock.update(teamId, { tools: [tool] });

      expect(environmentMock.getEntry).toHaveBeenCalledWith(teamId);
      expect(environmentMock.createEntry).toHaveBeenCalledWith(
        'externalTools',
        {
          fields: {
            description: { 'en-US': tool.description },
            name: { 'en-US': tool.name },
            url: { 'en-US': tool.url },
          },
        },
      );
      expect(teamMock.patch).toHaveBeenCalledWith([
        {
          op: 'replace',
          path: '/fields/tools',
          value: {
            'en-US': [
              {
                sys: {
                  id: 'old-tool-1',
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
              {
                sys: {
                  id: 'old-tool-2',
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
              {
                sys: {
                  id: 'new-tool',
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
            ],
          },
        },
      ]);

      expect(teamMockUpdated.publish).toHaveBeenCalled();
    });

    test('Should clean tool payload by removing a property with empty string', async () => {
      const teamId = 'team-id-1';
      const tool = {
        url: 'https://example.com',
        name: 'good link',
        description: ' ',
      };

      const toolMock = getEntry({});
      environmentMock.createEntry.mockResolvedValueOnce(toolMock);
      toolMock.publish = jest.fn().mockResolvedValueOnce(toolMock);

      const teamMock = getEntry({});
      const teamMockUpdated = getEntry({});
      teamMock.patch = jest.fn().mockResolvedValueOnce(teamMockUpdated);

      environmentMock.getEntry.mockResolvedValueOnce(teamMock);

      await teamDataProviderMock.update(teamId, { tools: [tool] });

      expect(environmentMock.getEntry).toHaveBeenCalledWith(teamId);
      expect(environmentMock.createEntry).toHaveBeenCalledWith(
        'externalTools',
        {
          fields: {
            name: { 'en-US': tool.name },
            url: { 'en-US': tool.url },
          },
        },
      );
      expect(teamMock.patch).toHaveBeenCalledWith([
        {
          op: 'add',
          path: '/fields/tools',
          value: {
            'en-US': [
              {
                sys: {
                  id: 'entry-id',
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
            ],
          },
        },
      ]);
      expect(teamMockUpdated.publish).toHaveBeenCalled();
    });
  });
});
