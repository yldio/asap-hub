import nock from 'nock';
import { RestTeam, SquidexRest } from '@asap-hub/squidex';
import { appName, baseUrl } from '../../src/config';
import { TeamSquidexDataProvider } from '../../src/data-providers/teams.data-provider';
import { getAuthToken } from '../../src/utils/auth';
import {
  getInputTeam,
  getSquidexGraphqlTeam,
  getSquidexTeamGraphqlResponse,
  getSquidexTeamsGraphqlResponse,
  getTeamCreateDataObject,
  getTeamDataObject,
} from '../fixtures/teams.fixtures';
import { getGraphQLUser } from '../fixtures/users.fixtures';
import { identity } from '../helpers/squidex';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';
import { GenericError, NotFoundError } from '@asap-hub/errors';

describe('Team Data Provider', () => {
  const teamRestclient = new SquidexRest<RestTeam>(getAuthToken, 'teams', {
    appName,
    baseUrl,
  });
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();
  const teamDataProvider = new TeamSquidexDataProvider(
    squidexGraphqlClientMock,
    teamRestclient,
  );

  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const teamDataProviderMockGraphql = new TeamSquidexDataProvider(
    squidexGraphqlClientMockServer,
    teamRestclient,
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch method', () => {
    test('Should fetch the teams from squidex graphql', async () => {
      const result = await teamDataProviderMockGraphql.fetch({
        take: 10,
        skip: 8,
      });

      expect(result).toMatchObject({ total: 1, items: [getTeamDataObject()] });
    });

    test('Should return an empty result', async () => {
      const squidexGraphqlResponse = getSquidexTeamsGraphqlResponse();
      squidexGraphqlResponse.queryTeamsContentsWithTotal!.total = 0;
      squidexGraphqlResponse.queryTeamsContentsWithTotal!.items = [];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await teamDataProvider.fetch({ take: 10, skip: 8 });

      expect(result).toEqual({ items: [], total: 0 });
    });
    test('Should return an empty result when the client returns a response with queryTeamsContentsWithTotal property set to null', async () => {
      const squidexGraphqlResponse = getSquidexTeamsGraphqlResponse();
      squidexGraphqlResponse.queryTeamsContentsWithTotal = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await teamDataProvider.fetch({ take: 10, skip: 8 });

      expect(result).toEqual({ items: [], total: 0 });
    });
    test('Should return an empty result when the client returns a response with items property set to null', async () => {
      const squidexGraphqlResponse = getSquidexTeamsGraphqlResponse();
      squidexGraphqlResponse.queryTeamsContentsWithTotal!.total = 0;
      squidexGraphqlResponse.queryTeamsContentsWithTotal!.items = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await teamDataProvider.fetch({ take: 10, skip: 8 });

      expect(result).toEqual({ items: [], total: 0 });
    });

    describe('Text search', () => {
      test('Should search by name and return the teams', async () => {
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          getSquidexTeamsGraphqlResponse(),
        );
        const searchQ =
          "(contains(data/displayName/iv, 'Tony')" +
          " or contains(data/projectTitle/iv, 'Tony')" +
          " or contains(data/expertiseAndResourceTags/iv, 'Tony'))" +
          ' and' +
          " (contains(data/displayName/iv, 'Stark')" +
          " or contains(data/projectTitle/iv, 'Stark')" +
          " or contains(data/expertiseAndResourceTags/iv, 'Stark'))";

        const result = await teamDataProvider.fetch({
          take: 8,
          skip: 0,
          search: 'Tony Stark',
        });

        expect(result).toEqual({
          total: 1,
          items: [getTeamDataObject()],
        });
        expect(squidexGraphqlClientMock.request).toHaveBeenCalledTimes(1);
        expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          {
            filter: searchQ,
            top: 8,
            skip: 0,
          },
        );
      });

      test('Should sanitise single quotes by doubling them and encoding to hex', async () => {
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          getSquidexTeamsGraphqlResponse(),
        );
        const expectedSearchFilter =
          `(contains(data/displayName/iv, '%27%27')` +
          ` or contains(data/projectTitle/iv, '%27%27')` +
          ` or contains(data/expertiseAndResourceTags/iv, '%27%27'))`;

        const result = await teamDataProvider.fetch({
          take: 8,
          skip: 0,
          search: "'",
        });

        expect(result).toEqual({
          total: 1,
          items: [getTeamDataObject()],
        });
        expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          {
            filter: expectedSearchFilter,
            top: 8,
            skip: 0,
          },
        );
      });

      test('Should sanitise double quotation mark by encoding to hex', async () => {
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          getSquidexTeamsGraphqlResponse(),
        );
        const expectedSearchFilter =
          `(contains(data/displayName/iv, '%22')` +
          ` or contains(data/projectTitle/iv, '%22')` +
          ` or contains(data/expertiseAndResourceTags/iv, '%22'))`;

        const result = await teamDataProvider.fetch({
          take: 8,
          skip: 0,
          search: '"',
        });

        expect(result).toEqual({
          total: 1,
          items: [getTeamDataObject()],
        });
        expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          {
            filter: expectedSearchFilter,
            top: 8,
            skip: 0,
          },
        );
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
        const squidexTeamsResponse = getSquidexTeamsGraphqlResponse();
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexTeamsResponse,
        );
        const team1 = getSquidexGraphqlTeam({});
        const team2 = getSquidexGraphqlTeam({});
        const team3 = getSquidexGraphqlTeam({});
        team1.flatData!.tools = [];
        team2.flatData!.tools = tools;
        team3.flatData!.tools = tools;
        squidexTeamsResponse.queryTeamsContentsWithTotal!.items = [
          team1,
          team2,
          team3,
        ];

        const result = await teamDataProvider.fetch({
          take: 8,
          skip: 0,
        });

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

        const squidexTeamsResponse = getSquidexTeamsGraphqlResponse();
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexTeamsResponse,
        );
        const team1 = getSquidexGraphqlTeam({});
        const team2 = getSquidexGraphqlTeam({});
        const team3 = getSquidexGraphqlTeam({});
        team1.flatData!.tools = brokenUrlTools;
        team2.flatData!.tools = brokenNameTools;
        team3.flatData!.tools = fullTools;
        squidexTeamsResponse.queryTeamsContentsWithTotal!.items = [
          team1,
          team2,
          team3,
        ];

        const result = await teamDataProvider.fetch({
          take: 8,
          skip: 0,
        });

        expect(result.items[0]!.tools).toEqual(tools);
        expect(result.items[1]!.tools).toEqual(tools);
        expect(result.items[2]!.tools).toEqual(fullTools);
      });
    });
  });

  describe('Fetch-by-id method', () => {
    test('Should fetch the teams from squidex graphql', async () => {
      const teamId = 'team-id-1';
      const result = await teamDataProviderMockGraphql.fetchById(teamId);

      expect(result).toMatchObject(getTeamDataObject());
    });

    test('Should return nul when the team is not found', async () => {
      const teamId = 'not-found';
      const squidexGraphqlResponse = getSquidexTeamGraphqlResponse();
      squidexGraphqlResponse.findTeamsContent = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      expect(await teamDataProvider.fetchById(teamId)).toBeNull();
    });

    test('Should return the team even when team members are not found', async () => {
      const teamId = 'team-id-1';
      const squidexGraphqlResponse = getSquidexTeamGraphqlResponse();
      squidexGraphqlResponse.findTeamsContent!.referencingUsersContents = [];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await teamDataProvider.fetchById(teamId);
      expect(result).toEqual({
        ...getTeamDataObject(),
        members: [],
        labCount: 0,
      });
    });

    test('Should return the team even when team members do not exist', async () => {
      const teamId = 'team-id-1';
      const squidexGraphqlResponse = getSquidexTeamGraphqlResponse();
      squidexGraphqlResponse.findTeamsContent!.referencingUsersContents = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await teamDataProvider.fetchById(teamId);

      expect(result).toEqual({
        ...getTeamDataObject(),
        members: [],
        labCount: 0,
      });
    });

    test('Should return the result when the team exists', async () => {
      const teamId = 'team-id-1';
      const squidexGraphqlResponse = getSquidexTeamGraphqlResponse();
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await teamDataProvider.fetchById(teamId);

      expect(result).toEqual(getTeamDataObject());
    });

    test('Should return the tools as an empty array when they are defined as null in squidex', async () => {
      const teamId = 'team-id-1';

      const squidexGraphqlResponse = getSquidexTeamGraphqlResponse();
      squidexGraphqlResponse.findTeamsContent!.flatData.tools = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await teamDataProvider.fetchById(teamId);

      expect(result!.tools).toEqual([]);
    });

    describe('Labs', () => {
      test('Should return the lab count', async () => {
        const teamId = 'team-id-1';
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

        const squidexGraphqlResponse = getSquidexTeamGraphqlResponse();
        squidexGraphqlResponse.findTeamsContent!.referencingUsersContents = [
          graphqlUser1,
          graphqlUser2,
        ];
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await teamDataProvider.fetchById(teamId);

        expect(result!.labCount).toEqual(3);
      });

      test('Should return the team member lab list', async () => {
        const teamId = 'team-id-1';
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

        const squidexGraphqlResponse = getSquidexTeamGraphqlResponse();
        squidexGraphqlResponse.findTeamsContent!.referencingUsersContents = [
          graphqlUser1,
        ];
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await teamDataProvider.fetchById(teamId);

        expect(result!.members[0]!.labs).toEqual([
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

        const squidexGraphqlResponse = getSquidexTeamGraphqlResponse();
        squidexGraphqlResponse.findTeamsContent!.referencingUsersContents = [
          graphqlUser1,
        ];
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await teamDataProvider.fetchById(teamId);

        expect(result!.members[0]!.labs).toEqual([
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
        const squidexGraphqlResponse = getSquidexTeamGraphqlResponse();
        const graphqlUser1 = getGraphQLUser();
        graphqlUser1.flatData!.avatar = null;
        squidexGraphqlResponse.findTeamsContent!.referencingUsersContents = [
          graphqlUser1,
        ];
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await teamDataProvider.fetchById(teamId);

        const expectedResponse = {
          ...getTeamDataObject(),
          members: [
            {
              ...getTeamDataObject().members[0],
              avatarUrl: undefined,
            },
          ],
        };

        expect(result).toEqual(expectedResponse);
      });

      test('Should parse the team user correctly when the avatar is undefined', async () => {
        const teamId = 'team-id-1';
        const squidexGraphqlResponse = getSquidexTeamGraphqlResponse();
        const graphqlUser1 = getGraphQLUser();
        (graphqlUser1.flatData!.avatar as unknown) = undefined;
        squidexGraphqlResponse.findTeamsContent!.referencingUsersContents = [
          graphqlUser1,
        ];
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await teamDataProvider.fetchById(teamId);

        const expectedResponse = {
          ...getTeamDataObject(),
          members: [
            {
              ...getTeamDataObject().members[0],
              avatarUrl: undefined,
            },
          ],
        };

        expect(result).toEqual(expectedResponse);
      });
    });
  });

  describe('Update method', () => {
    beforeAll(() => {
      identity();
    });

    afterEach(() => {
      expect(nock.isDone()).toBe(true);
    });

    afterEach(() => {
      nock.cleanAll();
    });

    test('Should throw a Not Found error when the team does not exist', async () => {
      const teamId = 'team-id-1';
      nock(baseUrl).patch(`/api/content/${appName}/teams/${teamId}`).reply(404);

      await expect(
        teamDataProvider.update(teamId, { tools: [] }),
      ).rejects.toThrow(NotFoundError);
    });

    test('Should update the team', async () => {
      const teamId = 'team-id-1';
      const squidexGraphqlResponse = getSquidexTeamGraphqlResponse();
      squidexGraphqlClientMock.request.mockResolvedValue(
        squidexGraphqlResponse,
      );

      nock(baseUrl)
        .patch(`/api/content/${appName}/teams/${teamId}`, {
          tools: { iv: [] },
        })
        .reply(200, {}); // response is not used

      await teamDataProvider.update(teamId, { tools: [] });
    });

    test('Should clean tool payload by removing a property set to null', async () => {
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

      const squidexGraphqlResponse = getSquidexTeamGraphqlResponse();
      squidexGraphqlResponse.findTeamsContent!.flatData.tools = toolsResponse;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );
      nock(baseUrl)
        .patch(`/api/content/${appName}/teams/${teamId}`, {
          tools: { iv: toolsUpdate },
        })
        .reply(200, {}); // response is not used

      await teamDataProvider.update(teamId, {
        tools: [
          {
            url: 'https://example.com',
            name: 'good link',
            description: '',
          },
        ],
      });
    });
  });

  describe('Create method', () => {
    const teamId = 'some-team-id';

    beforeAll(() => {
      identity();
      nock.cleanAll();
    });

    afterEach(() => {
      expect(nock.isDone()).toBe(true);
    });

    afterEach(() => {
      nock.cleanAll();
    });

    test('Should create a team', async () => {
      nock(baseUrl)
        .post(
          `/api/content/${appName}/teams?publish=true`,
          getInputTeam() as any,
        )
        .reply(201, { id: teamId });

      const result = await teamDataProvider.create(getTeamCreateDataObject());
      expect(result).toEqual(teamId);
    });

    test('Should throw when it fails to create the team', async () => {
      nock(baseUrl)
        .post(`/api/content/${appName}/teams?publish=true`)
        .reply(500);

      await expect(
        teamDataProvider.create(getTeamCreateDataObject()),
      ).rejects.toThrow(GenericError);
    });
  });
});
