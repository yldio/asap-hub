import nock from 'nock';
import { config, RestUser } from '@asap-hub/squidex';
import { User } from '@asap-hub/auth';
import {
  graphQlTeamsResponseSingle,
  usersResponseTeam1,
  listTeamResponse,
  graphQlTeamsResponse,
  usersResponseTeam2,
  usersResponseTeam3,
  fetchTeamByIdExpectation,
  graphQlTeamResponse,
  fetchByIdUserResponse,
  getUpdateTeamResponse,
  getGraphQlTeamResponse,
  updateResponseTeam,
  updateExpectation,
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
  };

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
          query: buildGraphQLQueryFetchTeams('', 8, 8),
        })
        .reply(200, {
          data: {
            queryTeamsContentsWithTotal: {
              total: 0,
              items: [],
            },
          },
        });

      const result = await teams.fetch({ take: 8, skip: 8 }, mockUser);
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
          query: buildGraphQLQueryFetchTeams(searchQ),
        })
        .reply(200, graphQlTeamsResponseSingle)
        .get(`/api/content/${config.appName}/users`)
        .query({
          $filter: "data/teams/iv/id eq 'team-id-1'",
        })
        .reply(200, usersResponseTeam1);

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
          query: buildGraphQLQueryFetchTeams(expectedSearchFilter),
        })
        .reply(200, graphQlTeamsResponseSingle)
        .get(`/api/content/${config.appName}/users`)
        .query({
          $filter: "data/teams/iv/id eq 'team-id-1'",
        })
        .reply(200, usersResponseTeam1);

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
          query: buildGraphQLQueryFetchTeams(expectedSearchFilter),
        })
        .reply(200, graphQlTeamsResponseSingle)
        .get(`/api/content/${config.appName}/users`)
        .query({
          $filter: "data/teams/iv/id eq 'team-id-1'",
        })
        .reply(200, usersResponseTeam1);

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
        })
        .reply(200, graphQlTeamsResponse)
        .get(`/api/content/${config.appName}/users`)
        .query({
          $filter: "data/teams/iv/id eq 'team-id-1'",
        })
        .reply(200, usersResponseTeam1)
        .get(`/api/content/${config.appName}/users`)
        .query({
          $filter: "data/teams/iv/id eq 'team-id-2'",
        })
        .reply(200, usersResponseTeam2)
        .get(`/api/content/${config.appName}/users`)
        .query({
          $filter: "data/teams/iv/id eq 'team-id-3'",
        })
        .reply(200, usersResponseTeam3);

      const result = await teams.fetch({ take: 8, skip: 0 }, mockUser);

      expect(result).toEqual(listTeamResponse);
    });
  });

  describe('Fetch-by-id method', () => {
    test('Should throw a Not Found error when the team is not found', async () => {
      const teamId = 'not-found';

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchTeam(teamId),
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
          query: buildGraphQLQueryFetchTeam(teamId),
        })
        .reply(200, graphQlTeamResponse)
        .get(`/api/content/${config.appName}/users`)
        .query({
          $filter: `data/teams/iv/id eq '${teamId}'`,
        })
        .reply(404);

      const result = await teams.fetchById(teamId, mockUser);

      expect(result).toEqual({ ...fetchTeamByIdExpectation, members: [] });
    });

    test('Should return the team even when team members do not exist', async () => {
      const teamId = 'team-id-1';

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchTeam(teamId),
        })
        .reply(200, graphQlTeamResponse)
        .get(`/api/content/${config.appName}/users`)
        .query({
          $filter: `data/teams/iv/id eq '${teamId}'`,
        })
        .reply(200, { total: 0, items: [] });

      const result = await teams.fetchById(teamId, mockUser);

      expect(result).toEqual({ ...fetchTeamByIdExpectation, members: [] });
    });

    test('Should return the result when the team exists', async () => {
      const teamId = 'team-id-1';

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchTeam(teamId),
        })
        .reply(200, graphQlTeamResponse)
        .get(`/api/content/${config.appName}/users`)
        .query({
          $filter: `data/teams/iv/id eq '${teamId}'`,
        })
        .reply(200, fetchByIdUserResponse);

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
          query: buildGraphQLQueryFetchTeam(teamId),
        })
        .reply(200, getGraphQlTeamResponse(tools))
        .get(`/api/content/${config.appName}/users`)
        .query({
          $filter: `data/teams/iv/id eq '${teamId}'`,
        })
        .reply(200, fetchByIdUserResponse);

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
      const user: RestUser = {
        ...fetchByIdUserResponse.items[0],
        data: {
          ...fetchByIdUserResponse.items[0].data,
          avatar: { iv: ['test-avatar'] },
        },
      };

      test('Should parse the team user correctly when the avatar is null', async () => {
        const teamId = 'team-id-1';

        user.data.avatar.iv = null as any;

        const userResponse = {
          total: 1,
          items: [user],
        };

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: buildGraphQLQueryFetchTeam(teamId),
          })
          .reply(200, graphQlTeamResponse)
          .get(`/api/content/${config.appName}/users`)
          .query({
            $filter: `data/teams/iv/id eq '${teamId}'`,
          })
          .reply(200, userResponse);

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

        delete (user.data as any).avatar;

        const userResponse = {
          total: 1,
          items: [user],
        };

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: buildGraphQLQueryFetchTeam(teamId),
          })
          .reply(200, graphQlTeamResponse)
          .get(`/api/content/${config.appName}/users`)
          .query({
            $filter: `data/teams/iv/id eq '${teamId}'`,
          })
          .reply(200, userResponse);

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
          query: buildGraphQLQueryFetchTeam(teamId),
        })
        .reply(200, getGraphQlTeamResponse())
        .get(`/api/content/${config.appName}/users`)
        .query({
          $filter: `data/teams/iv/id eq '${teamId}'`,
        })
        .reply(200, updateResponseTeam);

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
          query: buildGraphQLQueryFetchTeam(teamId),
        })
        .reply(200, getGraphQlTeamResponse(tools))
        .get(`/api/content/${config.appName}/users`)
        .query({
          $filter: `data/teams/iv/id eq '${teamId}'`,
        })
        .reply(200, updateResponseTeam);

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
