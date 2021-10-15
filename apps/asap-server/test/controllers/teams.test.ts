import nock from 'nock';
import { config } from '@asap-hub/squidex';
import { print } from 'graphql';
import { TeamTool } from '@asap-hub/model';
import {
  graphQlTeamsResponseSingle,
  getListTeamResponse,
  getGraphQlTeamsResponse,
  fetchTeamByIdExpectation,
  graphQlTeamResponse,
  getUpdateTeamResponse,
  getGraphQlTeamResponse,
  updateExpectation,
  referencingUsersContentsResponse,
} from '../fixtures/teams.fixtures';
import Teams from '../../src/controllers/teams';
import { identity } from '../helpers/squidex';
import { getGraphQLUser } from '../fixtures/users.fixtures';
import { FETCH_TEAM, FETCH_TEAMS } from '../../src/queries/teams.queries';

describe('Team controller', () => {
  const teams = new Teams();

  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('Fetch method', () => {
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

      const result = await teams.fetch({ take: 10, skip: 8 });

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

      const result = await teams.fetch({ take: 10, skip: 8 });

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

      const result = await teams.fetch({ take: 10, skip: 8 });

      expect(result).toEqual({ items: [], total: 0 });
    });

    describe('Text search', () => {
      test('Should search by name and return the teams', async () => {
        const searchQ =
          "(contains(data/displayName/iv, 'Cristiano')" +
          " or contains(data/projectTitle/iv, 'Cristiano')" +
          " or contains(data/skills/iv, 'Cristiano'))" +
          ' and' +
          " (contains(data/displayName/iv, 'Ronaldo')" +
          " or contains(data/projectTitle/iv, 'Ronaldo')" +
          " or contains(data/skills/iv, 'Ronaldo'))";

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_TEAMS),
            variables: {
              filter: searchQ,
              top: 8,
              skip: 0,
            },
          })
          .reply(200, graphQlTeamsResponseSingle);

        const result = await teams.fetch({
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
          ` or contains(data/skills/iv, '%27%27'))`;

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_TEAMS),
            variables: {
              filter: expectedSearchFilter,
              top: 8,
              skip: 0,
            },
          })
          .reply(200, graphQlTeamsResponseSingle);

        const result = await teams.fetch({ take: 8, skip: 0, search: "'" });

        expect(result).toEqual({
          total: 1,
          items: getListTeamResponse().items.slice(0, 1),
        });
      });

      test('Should sanitise double quotation mark by encoding to hex', async () => {
        const expectedSearchFilter =
          `(contains(data/displayName/iv, '%22')` +
          ` or contains(data/projectTitle/iv, '%22')` +
          ` or contains(data/skills/iv, '%22'))`;

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_TEAMS),
            variables: {
              filter: expectedSearchFilter,
              top: 8,
              skip: 0,
            },
          })
          .reply(200, graphQlTeamsResponseSingle);

        const result = await teams.fetch({ take: 8, skip: 0, search: '"' });

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
        squidexTeamResponse.data.queryTeamsContentsWithTotal.items[0].flatData!.tools =
          [];
        squidexTeamResponse.data.queryTeamsContentsWithTotal.items[1].flatData!.tools =
          tools;
        squidexTeamResponse.data.queryTeamsContentsWithTotal.items[2].flatData!.tools =
          tools;

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

        const result = await teams.fetch({
          take: 8,
          skip: 0,
        });

        // should return empty arrays too
        expect(result.items[0].tools).toEqual([]);
        expect(result.items[1].tools).toEqual(tools);
        expect(result.items[2].tools).toEqual(tools);
      });

      test('Should select the teams for which the tools should be returned and mark the rest of them as undefined', async () => {
        const squidexTeamResponse = getGraphQlTeamsResponse();
        squidexTeamResponse.data.queryTeamsContentsWithTotal.items[0].flatData!.tools =
          tools;
        squidexTeamResponse.data.queryTeamsContentsWithTotal.items[1].flatData!.tools =
          tools;
        squidexTeamResponse.data.queryTeamsContentsWithTotal.items[2].flatData!.tools =
          [];

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

        const result = await teams.fetch({
          take: 8,
          skip: 0,
          showTeamTools: [
            squidexTeamResponse.data.queryTeamsContentsWithTotal.items[0].id,
            squidexTeamResponse.data.queryTeamsContentsWithTotal.items[2].id,
          ],
        });

        expect(result.items[0].tools).toEqual(tools);
        expect(result.items[1].tools).toBeUndefined();
        // should return empty array as empty array, not undefined
        expect(result.items[2].tools).toEqual([]);
      });
    });
  });

  describe('Fetch-by-id method', () => {
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

      await expect(teams.fetchById(teamId)).rejects.toThrow('Not Found');
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

      const result = await teams.fetchById(teamId);
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

      const result = await teams.fetchById(teamId);

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

      const result = await teams.fetchById(teamId);

      expect(result).toEqual(fetchTeamByIdExpectation);
    });

    describe('Tools', () => {
      test('Should return the tools as an empty array when they are defined as null in squidex', async () => {
        const teamId = 'team-id-1';

        const tools = null;

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_TEAM),
            variables: {
              id: teamId,
            },
          })
          .reply(200, getGraphQlTeamResponse(tools));

        const result = await teams.fetchById(teamId);

        expect(result).toEqual({
          ...fetchTeamByIdExpectation,
          tools: [],
        });
      });

      test('Should return the tools when the showTools parameter is missing', async () => {
        const teamId = 'team-id-1';

        const tools = [
          {
            url: 'https://example.com',
            name: 'good link',
            // squidex graphql api typings aren't perfect
            description: null as unknown as undefined,
          },
        ];

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_TEAM),
            variables: {
              id: teamId,
            },
          })
          .reply(200, getGraphQlTeamResponse(tools));

        const result = await teams.fetchById(teamId);

        expect(result).toEqual({
          ...fetchTeamByIdExpectation,
          tools: [
            {
              url: 'https://example.com',
              name: 'good link',
            },
          ],
        });
      });

      test('Should return the tools when the showTools parameter is set to true', async () => {
        const teamId = 'team-id-1';

        const tools = [
          {
            url: 'https://example.com',
            name: 'good link',
            // squidex graphql api typings aren't perfect
            description: null as unknown as undefined,
          },
        ];

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_TEAM),
            variables: {
              id: teamId,
            },
          })
          .reply(200, getGraphQlTeamResponse(tools));

        const result = await teams.fetchById(teamId, { showTools: true });

        expect(result).toEqual({
          ...fetchTeamByIdExpectation,
          tools: [
            {
              url: 'https://example.com',
              name: 'good link',
            },
          ],
        });
      });

      test('Should return the an empty array when the showTools parameter is missing but no tools are present', async () => {
        const teamId = 'team-id-1';
        const tools: TeamTool[] = [];

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_TEAM),
            variables: {
              id: teamId,
            },
          })
          .reply(200, getGraphQlTeamResponse(tools));

        const result = await teams.fetchById(teamId);

        expect(result).toEqual({
          ...fetchTeamByIdExpectation,
          tools: [],
        });
      });

      test('Should return the tools as undefined you when the "showTools" parameter is set to false', async () => {
        const teamId = 'team-id-1';

        const tools = [
          {
            url: 'https://example.com',
            name: 'good link',
            // squidex graphql api typings aren't perfect
            description: null as unknown as undefined,
          },
        ];

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_TEAM),
            variables: {
              id: teamId,
            },
          })
          .reply(200, getGraphQlTeamResponse(tools));

        const result = await teams.fetchById(teamId, { showTools: false });

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

        teamResponse.data.findTeamsContent.referencingUsersContents = [
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

        const result = await teams.fetchById(teamId);

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

        teamResponse.data.findTeamsContent.referencingUsersContents = [
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

        const result = await teams.fetchById(teamId);

        expect(result.members[0].labs).toEqual([
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

        teamResponse.data.findTeamsContent.referencingUsersContents = [
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

        const result = await teams.fetchById(teamId);

        expect(result.members[0].labs).toEqual([
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

        const result = await teams.fetchById(teamId);

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

        const result = await teams.fetchById(teamId);

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

  describe('Update method', () => {
    test('Should throw a Not Found error when the team does not exist', async () => {
      const teamId = 'team-id-1';
      nock(config.baseUrl)
        .patch(`/api/content/${config.appName}/teams/${teamId}`)
        .reply(404);

      await expect(teams.update(teamId, [])).rejects.toThrow('Not Found');
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
        .reply(200, getGraphQlTeamResponse());

      const result = await teams.update(teamId, []);

      expect(result).toEqual(updateExpectation);
    });

    test('Should remove a field are return the team', async () => {
      const teamId = 'team-id-1';
      const tools = [
        {
          url: 'https://example.com',
          name: 'good link',
        },
      ];

      nock(config.baseUrl)
        .patch(`/api/content/${config.appName}/teams/${teamId}`, {
          tools: { iv: tools },
        })
        .reply(200, getUpdateTeamResponse(tools)) // response is not used
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_TEAM),
          variables: {
            id: teamId,
          },
        })
        .reply(200, getGraphQlTeamResponse(tools));

      const result = await teams.update(teamId, [
        {
          url: 'https://example.com',
          name: 'good link',
          description: '',
        },
      ]);

      expect(result).toEqual({ ...updateExpectation, tools });
    });
  });
});
