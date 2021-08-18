import nock from 'nock';
import { config } from '@asap-hub/squidex';
import { User } from '@asap-hub/auth';
import {
  graphQlTeamsResponseSingle,
  listTeamResponse,
  graphQlTeamsResponse,
  fetchTeamByIdExpectation,
  graphQlTeamResponse,
  getUpdateTeamResponse,
  getGraphQlTeamResponse,
  updateExpectation,
  referencingUsersContentsResponse,
} from '../fixtures/teams.fixtures';
import Teams, {
  buildGraphQLQueryFetchTeams,
  buildGraphQLQueryFetchTeam,
} from '../../src/controllers/teams';
import { identity } from '../helpers/squidex';

describe('Team controller', () => {
  const teams = new Teams();
  const mockUser: User = {
    id: 'userId',
    onboarded: true,
    displayName: 'JT',
    email: 'joao.tiago@asap.science',
    firstName: 'Joao',
    lastName: 'Tiago',
    teams: [
      {
        id: 'team-id-1',
        displayName: 'Awesome Team',
        role: 'Project Manager',
      },
      {
        id: 'team-id-3',
        displayName: 'Zac Torres',
        role: 'Collaborating PI',
      },
    ],
    algoliaApiKey: 'test-api-key',
  };

  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });

  describe('Fetch method', () => {
    test('Should return an empty result', async () => {
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchTeams(),
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

      const result = await teams.fetch({ take: 10, skip: 8 }, mockUser);
      expect(result).toEqual({ items: [], total: 0 });
    });

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
          query: buildGraphQLQueryFetchTeams(),
          variables: {
            filter: searchQ,
            top: 8,
            skip: 0,
          },
        })
        .reply(200, graphQlTeamsResponseSingle);

      const result = await teams.fetch(
        { take: 8, skip: 0, search: 'Cristiano Ronaldo' },
        mockUser,
      );

      expect(result).toEqual({
        total: 1,
        items: listTeamResponse.items.slice(0, 1),
      });
    });

    test('Should sanitise single quotes by doubling them and encoding to hex', async () => {
      const expectedSearchFilter =
        `(contains(data/displayName/iv, '%27%27')` +
        ` or contains(data/projectTitle/iv, '%27%27')` +
        ` or contains(data/skills/iv, '%27%27'))`;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchTeams(),
          variables: {
            filter: expectedSearchFilter,
            top: 8,
            skip: 0,
          },
        })
        .reply(200, graphQlTeamsResponseSingle);

      const result = await teams.fetch(
        { take: 8, skip: 0, search: "'" },
        mockUser,
      );

      expect(result).toEqual({
        total: 1,
        items: listTeamResponse.items.slice(0, 1),
      });
    });

    test('Should sanitise double quotation mark by encoding to hex', async () => {
      const expectedSearchFilter =
        `(contains(data/displayName/iv, '%22')` +
        ` or contains(data/projectTitle/iv, '%22')` +
        ` or contains(data/skills/iv, '%22'))`;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchTeams(),
          variables: {
            filter: expectedSearchFilter,
            top: 8,
            skip: 0,
          },
        })
        .reply(200, graphQlTeamsResponseSingle);

      const result = await teams.fetch(
        { take: 8, skip: 0, search: '"' },
        mockUser,
      );

      expect(result).toEqual({
        total: 1,
        items: listTeamResponse.items.slice(0, 1),
      });
    });

    test('Should search by the teams the user belongs to and return the groups', async () => {
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchTeams(),
          variables: {
            filter: '',
            top: 8,
            skip: 0,
          },
        })
        .reply(200, graphQlTeamsResponse);

      const result = await teams.fetch({ take: 8, skip: 0 }, mockUser);

      expect(result).toEqual(listTeamResponse);
    });
  });

  describe('Fetch-by-id method', () => {
    test('Should throw a Not Found error when the team is not found', async () => {
      const teamId = 'not-found';

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchTeam(),
          variables: {
            id: teamId,
          },
        })
        .reply(200, {
          data: {
            findTeamsContent: null,
          },
        });

      await expect(teams.fetchById(teamId, mockUser)).rejects.toThrow(
        'Not Found',
      );
    });

    test('Should return the team even when team members are not found', async () => {
      const teamId = 'team-id-1';

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchTeam(),
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

      const result = await teams.fetchById(teamId, mockUser);
      expect(result).toEqual({ ...fetchTeamByIdExpectation, members: [] });
    });

    test('Should return the team even when team members do not exist', async () => {
      const teamId = 'team-id-1';

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchTeam(),
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

      const result = await teams.fetchById(teamId, mockUser);

      expect(result).toEqual({ ...fetchTeamByIdExpectation, members: [] });
    });

    test('Should return the result when the team exists', async () => {
      const teamId = 'team-id-1';

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchTeam(),
          variables: {
            id: teamId,
          },
        })
        .reply(200, graphQlTeamResponse);

      const result = await teams.fetchById(teamId, mockUser);

      expect(result).toEqual(fetchTeamByIdExpectation);
    });

    test('Should return team information when user is part of the team', async () => {
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
          query: buildGraphQLQueryFetchTeam(),
          variables: {
            id: teamId,
          },
        })
        .reply(200, getGraphQlTeamResponse(tools));

      const result = await teams.fetchById(teamId, mockUser);

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

    describe('Avatar', () => {
      test('Should parse the team user correctly when the avatar is null', async () => {
        const teamId = 'team-id-1';

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: buildGraphQLQueryFetchTeam(),
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

        const result = await teams.fetchById(teamId, mockUser);

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
            query: buildGraphQLQueryFetchTeam(),
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

        const result = await teams.fetchById(teamId, mockUser);

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

      await expect(teams.update(teamId, [], mockUser)).rejects.toThrow(
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
          query: buildGraphQLQueryFetchTeam(),
          variables: {
            id: teamId,
          },
        })
        .reply(200, getGraphQlTeamResponse());

      const result = await teams.update(teamId, [], mockUser);

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
          query: buildGraphQLQueryFetchTeam(),
          variables: {
            id: teamId,
          },
        })
        .reply(200, getGraphQlTeamResponse(tools));

      const result = await teams.update(
        teamId,
        [
          {
            url: 'https://example.com',
            name: 'good link',
            description: '',
          },
        ],
        mockUser,
      );

      expect(result).toEqual({ ...updateExpectation, tools });
    });
  });
});
