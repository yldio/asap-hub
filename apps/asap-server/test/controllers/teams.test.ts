import nock from 'nock';
import { config, SquidexGraphql } from '@asap-hub/squidex';
import { print } from 'graphql';
import {
  getGraphQlTeamsResponse,
  getListTeamResponse,
  fetchTeamByIdExpectation,
  graphQlTeamResponse,
  getUpdateTeamResponse,
  getGraphQlTeamResponse,
  updateExpectation,
  referencingUsersContentsResponse,
  GraphTeamTool,
  getGraphqlTeam,
  getTeamResponse,
  GraphTeamOutputs,
} from '../fixtures/teams.fixtures';
import Teams from '../../src/controllers/teams';
import { identity } from '../helpers/squidex';
import { getGraphQLUser } from '../fixtures/users.fixtures';
import { FETCH_TEAM, FETCH_TEAMS } from '../../src/queries/teams.queries';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';

describe('Team controller', () => {
  const squidexGraphqlClient = new SquidexGraphql();
  const teamController = new Teams(squidexGraphqlClient);

  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const teamControllerMockGraphql = new Teams(squidexGraphqlClientMockServer);

  beforeAll(() => {
    identity();
  });

  describe('Fetch method', () => {
    describe('with mock-server', () => {
      test('Should fetch the teams from squidex graphql', async () => {
        const result = await teamControllerMockGraphql.fetch({
          take: 10,
          skip: 8,
        });

        expect(result).toMatchObject(getListTeamResponse());
      });
    });

    describe('with intercepted http layer', () => {
      afterEach(() => {
        expect(nock.isDone()).toBe(true);
      });

      afterEach(() => {
        nock.cleanAll();
      });

      test('Should return an empty result', async () => {
        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_TEAMS),
            variables: {
              filter: '',
              top: 10,
              skip: 8,
            },
          })
          .reply(200, {
            data: {
              queryTeamsContentsWithTotal: {
                total: 0,
                items: [],
              },
            },
          });

        const result = await teamController.fetch({ take: 10, skip: 8 });

        expect(result).toEqual({ items: [], total: 0 });
      });
      test('Should return an empty result when the client returns a response with queryTeamsContentsWithTotal property set to null', async () => {
        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_TEAMS),
            variables: {
              filter: '',
              top: 10,
              skip: 8,
            },
          })
          .reply(200, {
            data: {
              queryTeamsContentsWithTotal: null,
            },
          });

        const result = await teamController.fetch({ take: 10, skip: 8 });

        expect(result).toEqual({ items: [], total: 0 });
      });
      test('Should return an empty result when the client returns a response with items property set to null', async () => {
        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_TEAMS),
            variables: {
              filter: '',
              top: 10,
              skip: 8,
            },
          })
          .reply(200, {
            data: {
              queryTeamsContentsWithTotal: {
                total: 0,
                items: null,
              },
            },
          });

        const result = await teamController.fetch({ take: 10, skip: 8 });

        expect(result).toEqual({ items: [], total: 0 });
      });

      describe('Text search', () => {
        test('Should search by name and return the teams', async () => {
          const searchQ =
            "(contains(data/displayName/iv, 'Cristiano')" +
            " or contains(data/projectTitle/iv, 'Cristiano')" +
            " or contains(data/expertiseAndResourceTags/iv, 'Cristiano'))" +
            ' and' +
            " (contains(data/displayName/iv, 'Ronaldo')" +
            " or contains(data/projectTitle/iv, 'Ronaldo')" +
            " or contains(data/expertiseAndResourceTags/iv, 'Ronaldo'))";

          nock(config.baseUrl)
            .post(`/api/content/${config.appName}/graphql`, {
              query: print(FETCH_TEAMS),
              variables: {
                filter: searchQ,
                top: 8,
                skip: 0,
              },
            })
            .reply(200, getGraphQlTeamsResponse);

          const result = await teamController.fetch({
            take: 8,
            skip: 0,
            search: 'Cristiano Ronaldo',
          });

          expect(result).toEqual({
            total: 1,
            items: getListTeamResponse().items.slice(0, 1),
          });
        });

        test('Should sanitise single quotes by doubling them and encoding to hex', async () => {
          const expectedSearchFilter =
            `(contains(data/displayName/iv, '%27%27')` +
            ` or contains(data/projectTitle/iv, '%27%27')` +
            ` or contains(data/expertiseAndResourceTags/iv, '%27%27'))`;

          nock(config.baseUrl)
            .post(`/api/content/${config.appName}/graphql`, {
              query: print(FETCH_TEAMS),
              variables: {
                filter: expectedSearchFilter,
                top: 8,
                skip: 0,
              },
            })
            .reply(200, getGraphQlTeamsResponse);

          const result = await teamController.fetch({
            take: 8,
            skip: 0,
            search: "'",
          });

          expect(result).toEqual({
            total: 1,
            items: getListTeamResponse().items.slice(0, 1),
          });
        });

        test('Should sanitise double quotation mark by encoding to hex', async () => {
          const expectedSearchFilter =
            `(contains(data/displayName/iv, '%22')` +
            ` or contains(data/projectTitle/iv, '%22')` +
            ` or contains(data/expertiseAndResourceTags/iv, '%22'))`;

          nock(config.baseUrl)
            .post(`/api/content/${config.appName}/graphql`, {
              query: print(FETCH_TEAMS),
              variables: {
                filter: expectedSearchFilter,
                top: 8,
                skip: 0,
              },
            })
            .reply(200, getGraphQlTeamsResponse);

          const result = await teamController.fetch({
            take: 8,
            skip: 0,
            search: '"',
          });

          expect(result).toEqual({
            total: 1,
            items: getListTeamResponse().items.slice(0, 1),
          });
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

        test('Should return all the team tools by default', async () => {
          const squidexTeamResponse = getGraphQlTeamsResponse();
          const team1 = getGraphqlTeam({});
          const team2 = getGraphqlTeam({});
          const team3 = getGraphqlTeam({});
          team1.flatData!.tools = [];
          team2.flatData!.tools = tools;
          team3.flatData!.tools = tools;
          squidexTeamResponse.data.queryTeamsContentsWithTotal!.items = [
            team1,
            team2,
            team3,
          ];

          nock(config.baseUrl)
            .post(`/api/content/${config.appName}/graphql`, {
              query: print(FETCH_TEAMS),
              variables: {
                filter: '',
                top: 8,
                skip: 0,
              },
            })
            .reply(200, squidexTeamResponse);

          const result = await teamController.fetch({
            take: 8,
            skip: 0,
          });

          // should return empty arrays too
          expect(result.items[0]!.tools).toEqual([]);
          expect(result.items[1]!.tools).toEqual(tools);
          expect(result.items[2]!.tools).toEqual(tools);
        });

        test('should only return team tools with name and url defined', async () => {
          const brokenUrlTools = [
            ...tools,
            {
              url: null,
              name: 'testTool',
              description: 'tool description',
            },
          ];
          const brokenNameTools = [
            ...tools,
            {
              url: 'testUrl',
              name: null,
              description: 'tool description',
            },
          ];
          const fullTools = [
            ...tools,
            {
              url: 'testUrl',
              name: 'testTool',
              description: 'tool description',
            },
          ];

          const squidexTeamResponse = getGraphQlTeamsResponse();
          const team1 = getGraphqlTeam({});
          const team2 = getGraphqlTeam({});
          const team3 = getGraphqlTeam({});
          team1.flatData!.tools = brokenUrlTools;
          team2.flatData!.tools = brokenNameTools;
          team3.flatData!.tools = fullTools;
          squidexTeamResponse.data.queryTeamsContentsWithTotal!.items = [
            team1,
            team2,
            team3,
          ];

          nock(config.baseUrl)
            .post(`/api/content/${config.appName}/graphql`, {
              query: print(FETCH_TEAMS),
              variables: {
                filter: '',
                top: 8,
                skip: 0,
              },
            })
            .reply(200, squidexTeamResponse);

          const result = await teamController.fetch({
            take: 8,
            skip: 0,
          });

          // should return empty arrays too
          expect(result.items[0]!.tools).toEqual(tools);
          expect(result.items[1]!.tools).toEqual(tools);
          expect(result.items[2]!.tools).toEqual(fullTools);
        });

        test('Should select the teams for which the tools should be returned and mark the rest of them as undefined', async () => {
          const squidexTeamResponse = getGraphQlTeamsResponse();
          const team1 = getGraphqlTeam({ id: 'team-id-1' });
          const team2 = getGraphqlTeam({ id: 'team-id-2' });
          const team3 = getGraphqlTeam({ id: 'team-id-3' });
          team1.flatData!.tools = tools;
          team2.flatData!.tools = tools;
          team3.flatData!.tools = [];
          squidexTeamResponse.data.queryTeamsContentsWithTotal!.items = [
            team1,
            team2,
            team3,
          ];

          nock(config.baseUrl)
            .post(`/api/content/${config.appName}/graphql`, {
              query: print(FETCH_TEAMS),
              variables: {
                filter: '',
                top: 8,
                skip: 0,
              },
            })
            .reply(200, squidexTeamResponse);

          const result = await teamController.fetch({
            take: 8,
            skip: 0,
            showTeamTools: [team1.id, team3.id],
          });

          expect(result.items[0]!.tools).toEqual(tools);
          expect(result.items[1]!.tools).toBeUndefined();
          // should return empty array as empty array, not undefined
          expect(result.items[2]!.tools).toEqual([]);
        });
      });
    });
  });

  describe('Fetch-by-id method', () => {
    describe('with mock-server', () => {
      test('Should fetch the teams from squidex graphql', async () => {
        const teamId = 'team-id-1';
        const result = await teamControllerMockGraphql.fetchById(teamId);

        expect(result).toMatchObject(getTeamResponse());
      });
    });

    describe('with intercepted http layer', () => {
      afterEach(() => {
        expect(nock.isDone()).toBe(true);
      });

      afterEach(() => {
        nock.cleanAll();
      });

      test('Should throw a Not Found error when the team is not found', async () => {
        const teamId = 'not-found';

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_TEAM),
            variables: {
              id: teamId,
            },
          })
          .reply(200, {
            data: {
              findTeamsContent: null,
            },
          });

        await expect(teamController.fetchById(teamId)).rejects.toThrow(
          'Not Found',
        );
      });

      test('Should return the team even when team members are not found', async () => {
        const teamId = 'team-id-1';

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_TEAM),
            variables: {
              id: teamId,
            },
          })
          .reply(200, {
            ...graphQlTeamResponse,
            data: {
              ...graphQlTeamResponse.data,
              findTeamsContent: {
                ...graphQlTeamResponse.data.findTeamsContent,
                referencingUsersContents: [],
              },
            },
          });

        const result = await teamController.fetchById(teamId);
        expect(result).toEqual({
          ...fetchTeamByIdExpectation,
          members: [],
          labCount: 0,
        });
      });

      test('Should return the team even when team members do not exist', async () => {
        const teamId = 'team-id-1';

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_TEAM),
            variables: {
              id: teamId,
            },
          })
          .reply(200, {
            ...graphQlTeamResponse,
            data: {
              ...graphQlTeamResponse.data,
              findTeamsContent: {
                ...graphQlTeamResponse.data.findTeamsContent,
                referencingUsersContents: [],
              },
            },
          });

        const result = await teamController.fetchById(teamId);

        expect(result).toEqual({
          ...fetchTeamByIdExpectation,
          members: [],
          labCount: 0,
        });
      });

      test('Should return the result when the team exists', async () => {
        const teamId = 'team-id-1';

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_TEAM),
            variables: {
              id: teamId,
            },
          })
          .reply(200, graphQlTeamResponse);

        const result = await teamController.fetchById(teamId);

        expect(result).toEqual(fetchTeamByIdExpectation);
      });

      describe('Tools', () => {
        test('Should return the tools as an empty array when they are defined as null in squidex', async () => {
          const teamId = 'team-id-1';

          const tools = null as unknown as GraphTeamTool[];

          nock(config.baseUrl)
            .post(`/api/content/${config.appName}/graphql`, {
              query: print(FETCH_TEAM),
              variables: {
                id: teamId,
              },
            })
            .reply(200, getGraphQlTeamResponse({ tools }));

          const result = await teamController.fetchById(teamId);

          expect(result.tools).toEqual([]);
        });

        test('Should return the tools when the showTools parameter is missing', async () => {
          const teamId = 'team-id-1';

          const tools = [
            {
              url: 'https://example.com',
              name: 'good link',
              // squidex graphql api typings aren't perfect
              description: null,
            },
          ];

          nock(config.baseUrl)
            .post(`/api/content/${config.appName}/graphql`, {
              query: print(FETCH_TEAM),
              variables: {
                id: teamId,
              },
            })
            .reply(200, getGraphQlTeamResponse({ tools }));

          const result = await teamController.fetchById(teamId);

          expect(result.tools).toEqual([
            {
              url: 'https://example.com',
              name: 'good link',
            },
          ]);
        });

        test('Should return the tools when the showTools parameter is set to true', async () => {
          const teamId = 'team-id-1';

          const tools = [
            {
              url: 'https://example.com',
              name: 'good link',
              description: null,
            },
          ];

          nock(config.baseUrl)
            .post(`/api/content/${config.appName}/graphql`, {
              query: print(FETCH_TEAM),
              variables: {
                id: teamId,
              },
            })
            .reply(200, getGraphQlTeamResponse({ tools }));

          const result = await teamController.fetchById(teamId, {
            showTools: true,
          });

          expect(result.tools).toEqual([
            {
              url: 'https://example.com',
              name: 'good link',
            },
          ]);
        });

        test('Should return the an empty array when the showTools parameter is missing but no tools are present', async () => {
          const teamId = 'team-id-1';
          const tools: GraphTeamTool[] = [];

          nock(config.baseUrl)
            .post(`/api/content/${config.appName}/graphql`, {
              query: print(FETCH_TEAM),
              variables: {
                id: teamId,
              },
            })
            .reply(200, getGraphQlTeamResponse({ tools }));

          const result = await teamController.fetchById(teamId);

          expect(result.tools).toEqual([]);
        });

        test('Should return the tools as undefined you when the "showTools" parameter is set to false', async () => {
          const teamId = 'team-id-1';

          const tools = [
            {
              url: 'https://example.com',
              name: 'good link',
              description: null,
            },
          ];

          nock(config.baseUrl)
            .post(`/api/content/${config.appName}/graphql`, {
              query: print(FETCH_TEAM),
              variables: {
                id: teamId,
              },
            })
            .reply(200, getGraphQlTeamResponse({ tools }));

          const result = await teamController.fetchById(teamId, {
            showTools: false,
          });

          expect(result.tools).toBeUndefined();
        });
      });

      describe('Labs', () => {
        test('Should return the lab count', async () => {
          const teamId = 'team-id-1';
          const teamResponse = getGraphQlTeamResponse();
          // create a user with labs
          const graphqlUser1 = getGraphQLUser();
          graphqlUser1.flatData!.labs = [
            {
              id: 'lab-id-1',
              flatData: {
                name: 'lab name',
              },
            },
            {
              id: 'lab-id-2',
              flatData: {
                name: 'lab name',
              },
            },
          ];
          // create another user with labs one of which is a duplicate of the first user's lab
          const graphqlUser2 = getGraphQLUser();
          graphqlUser2.flatData!.labs = [
            {
              id: 'lab-id-2',
              flatData: {
                name: 'lab name',
              },
            },
            {
              id: 'lab-id-3',
              flatData: {
                name: 'lab name',
              },
            },
          ];

          teamResponse.data.findTeamsContent!.referencingUsersContents = [
            graphqlUser1,
            graphqlUser2,
          ];

          nock(config.baseUrl)
            .post(`/api/content/${config.appName}/graphql`, {
              query: print(FETCH_TEAM),
              variables: {
                id: teamId,
              },
            })
            .reply(200, teamResponse);

          const result = await teamController.fetchById(teamId);

          expect(result.labCount).toEqual(3);
        });

        test('Should return the team member lab list', async () => {
          const teamId = 'team-id-1';
          const teamResponse = getGraphQlTeamResponse();
          // create a user with labs
          const graphqlUser1 = getGraphQLUser();
          graphqlUser1.flatData!.labs = [
            {
              id: 'lab-id-1',
              flatData: {
                name: 'lab name',
              },
            },
            {
              id: 'lab-id-2',
              flatData: {
                name: 'lab name',
              },
            },
          ];

          teamResponse.data.findTeamsContent!.referencingUsersContents = [
            graphqlUser1,
          ];

          nock(config.baseUrl)
            .post(`/api/content/${config.appName}/graphql`, {
              query: print(FETCH_TEAM),
              variables: {
                id: teamId,
              },
            })
            .reply(200, teamResponse);

          const result = await teamController.fetchById(teamId);

          expect(result.members[0]!.labs).toEqual([
            {
              id: 'lab-id-1',
              name: 'lab name',
            },
            {
              id: 'lab-id-2',
              name: 'lab name',
            },
          ]);
        });

        test('Should skip the team member lab if the name is empty', async () => {
          const teamId = 'team-id-1';
          const teamResponse = getGraphQlTeamResponse();
          // create a user with labs
          const graphqlUser1 = getGraphQLUser();
          graphqlUser1.flatData!.labs = [
            {
              id: 'lab-id-1',
              flatData: {
                name: null,
              },
            },
            {
              id: 'lab-id-2',
              flatData: {
                name: 'lab name',
              },
            },
          ];

          teamResponse.data.findTeamsContent!.referencingUsersContents = [
            graphqlUser1,
          ];

          nock(config.baseUrl)
            .post(`/api/content/${config.appName}/graphql`, {
              query: print(FETCH_TEAM),
              variables: {
                id: teamId,
              },
            })
            .reply(200, teamResponse);

          const result = await teamController.fetchById(teamId);

          expect(result.members[0]!.labs).toEqual([
            {
              id: 'lab-id-2',
              name: 'lab name',
            },
          ]);
        });
      });

      describe('Avatar', () => {
        test('Should parse the team user correctly when the avatar is null', async () => {
          const teamId = 'team-id-1';

          nock(config.baseUrl)
            .post(`/api/content/${config.appName}/graphql`, {
              query: print(FETCH_TEAM),
              variables: {
                id: teamId,
              },
            })
            .reply(200, {
              ...graphQlTeamResponse,
              data: {
                ...graphQlTeamResponse.data,
                findTeamsContent: {
                  ...graphQlTeamResponse.data.findTeamsContent,
                  referencingUsersContents: referencingUsersContentsResponse({
                    avatar: null,
                  }),
                },
              },
            });

          const result = await teamController.fetchById(teamId);

          const expectedResponse = {
            ...fetchTeamByIdExpectation,
            members: [
              {
                ...fetchTeamByIdExpectation.members[0],
                avatarUrl: undefined,
              },
            ],
          };

          expect(result).toEqual(expectedResponse);
        });

        test('Should parse the team user correctly when the avatar is undefined', async () => {
          const teamId = 'team-id-1';

          nock(config.baseUrl)
            .post(`/api/content/${config.appName}/graphql`, {
              query: print(FETCH_TEAM),
              variables: {
                id: teamId,
              },
            })
            .reply(200, {
              ...graphQlTeamResponse,
              data: {
                ...graphQlTeamResponse.data,
                findTeamsContent: {
                  ...graphQlTeamResponse.data.findTeamsContent,
                  referencingUsersContents: referencingUsersContentsResponse({
                    avatar: undefined,
                  }),
                },
              },
            });

          const result = await teamController.fetchById(teamId);

          const expectedResponse = {
            ...fetchTeamByIdExpectation,
            members: [
              {
                ...fetchTeamByIdExpectation.members[0],
                avatarUrl: undefined,
              },
            ],
          };

          expect(result).toEqual(expectedResponse);
        });
      });
    });
  });

  describe('Update method', () => {
    test('Should throw a Not Found error when the team does not exist', async () => {
      const teamId = 'team-id-1';
      nock(config.baseUrl)
        .patch(`/api/content/${config.appName}/teams/${teamId}`)
        .reply(404);

      await expect(teamController.update(teamId, [])).rejects.toThrow(
        'Not Found',
      );
    });

    test('Should remove the tools are return the team', async () => {
      const teamId = 'team-id-1';

      nock(config.baseUrl)
        .patch(`/api/content/${config.appName}/teams/${teamId}`, {
          tools: { iv: [] },
        })
        .reply(200, getUpdateTeamResponse()) // response is not used
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_TEAM),
          variables: {
            id: teamId,
          },
        })
        .reply(200, graphQlTeamResponse);

      const result = await teamController.update(teamId, []);

      expect(result).toEqual(updateExpectation);
    });

    test('Should remove a field are return the team', async () => {
      const teamId = 'team-id-1';
      const toolsUpdate = [
        {
          url: 'https://example.com',
          name: 'good link',
        },
      ];
      const toolsResponse = [
        {
          url: 'https://example.com',
          name: 'good link',
          description: null,
        },
      ];

      nock(config.baseUrl)
        .patch(`/api/content/${config.appName}/teams/${teamId}`, {
          tools: { iv: toolsUpdate },
        })
        .reply(200, getUpdateTeamResponse(toolsUpdate)) // response is not used
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_TEAM),
          variables: {
            id: teamId,
          },
        })
        .reply(200, getGraphQlTeamResponse({ tools: toolsResponse }));

      const result = await teamController.update(teamId, [
        {
          url: 'https://example.com',
          name: 'good link',
          description: '',
        },
      ]);

      expect(result.tools).toEqual([
        {
          url: 'https://example.com',
          name: 'good link',
        },
      ]);
    });
  });
  describe('merge method', () => {
    test('Should merge the output field and maintains existing fields', async () => {
      const teamId = 'team-id-1';
      const existingOutputs = [{ id: 'output-1' }] as GraphTeamOutputs;

      const firstResponse = getGraphQlTeamResponse({
        outputs: existingOutputs,
      });
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_TEAM),
          variables: {
            id: teamId,
          },
        })
        .reply(200, firstResponse)
        .patch(`/api/content/${config.appName}/teams/${teamId}`, {
          outputs: { iv: ['output-1', 'output-2'] },
        })
        .reply(200, getUpdateTeamResponse()) // response is not used
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_TEAM),
          variables: {
            id: teamId,
          },
        })
        .reply(
          200,
          getGraphQlTeamResponse({
            outputs: [
              { id: 'output-1' },
              { id: 'output-2' },
            ] as unknown as GraphTeamOutputs,
          }),
        );

      const result = await teamController.merge(teamId, ['output-2']);

      expect(result.outputs).toEqual([{ id: 'output-1' }, { id: 'output-2' }]);
    });
    test('Should not create duplicate', async () => {
      const teamId = 'team-id-1';
      const existingOutputs = [{ id: 'output-1' }] as GraphTeamOutputs;

      const firstResponse = getGraphQlTeamResponse({
        outputs: existingOutputs,
      });
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_TEAM),
          variables: {
            id: teamId,
          },
        })
        .reply(200, firstResponse)
        .patch(`/api/content/${config.appName}/teams/${teamId}`, {
          outputs: { iv: ['output-1'] },
        })
        .reply(200, getUpdateTeamResponse()) // response is not used
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_TEAM),
          variables: {
            id: teamId,
          },
        })
        .reply(
          200,
          getGraphQlTeamResponse({
            outputs: [{ id: 'output-1' }] as unknown as GraphTeamOutputs,
          }),
        );

      const result = await teamController.merge(teamId, ['output-1']);

      expect(result.outputs).toEqual([{ id: 'output-1' }]);
    });
  });
});
