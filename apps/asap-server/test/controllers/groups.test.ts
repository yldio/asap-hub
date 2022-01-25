import Groups from '../../src/controllers/groups';
import { FetchOptions } from '../../src/utils/types';
import {
  getGroupResponse,
  getListGroupResponse,
  getSquidexGroupGraphqlResponse,
  getSquidexGroupsGraphqlResponse,
} from '../fixtures/groups.fixtures';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';

describe('Group controller', () => {
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();
  const groupController = new Groups(squidexGraphqlClientMock);

  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const groupControllerMockGraphql = new Groups(squidexGraphqlClientMockServer);

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch method', () => {
    test('Should fetch the groups from squidex graphql', async () => {
      const result = await groupControllerMockGraphql.fetch({});

      expect(result).toMatchObject(getListGroupResponse());
    });

    test('Should return an empty result when the client returns an empty list', async () => {
      const squidexGraphqlResponse = getSquidexGroupsGraphqlResponse();
      squidexGraphqlResponse.queryGroupsContentsWithTotal!.total = 0;
      squidexGraphqlResponse.queryGroupsContentsWithTotal!.items = [];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await groupController.fetch({});
      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should return an empty result when the client returns a response with queryGroupsContentsWithTotal property set to null', async () => {
      const squidexGraphqlResponse = getSquidexGroupsGraphqlResponse();
      squidexGraphqlResponse.queryGroupsContentsWithTotal = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await groupController.fetch({});
      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should return an empty result when the client returns a response with items property set to null', async () => {
      const squidexGraphqlResponse = getSquidexGroupsGraphqlResponse();
      squidexGraphqlResponse.queryGroupsContentsWithTotal!.items = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await groupController.fetch({});
      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should query with filters and return the groups', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexGroupsGraphqlResponse(),
      );

      const fetchOptions: FetchOptions = {
        take: 12,
        skip: 2,
        search: 'first last',
      };
      const expectedFilter =
        "(contains(data/name/iv, 'first')" +
        " or contains(data/description/iv, 'first')" +
        " or contains(data/tags/iv, 'first'))" +
        ' and' +
        " (contains(data/name/iv, 'last')" +
        " or contains(data/description/iv, 'last')" +
        " or contains(data/tags/iv, 'last'))";

      const result = await groupController.fetch(fetchOptions);

      expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          filter: expectedFilter,
          top: 12,
          skip: 2,
        },
      );
      expect(result).toEqual(getListGroupResponse());
    });

    test('Should sanitise single quotes by doubling them and encoding to hex', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexGroupsGraphqlResponse(),
      );

      const fetchOptions: FetchOptions = {
        take: 12,
        skip: 2,
        search: "'",
      };
      const expectedFilter =
        "(contains(data/name/iv, '%27%27')" +
        " or contains(data/description/iv, '%27%27')" +
        " or contains(data/tags/iv, '%27%27'))";

      await groupController.fetch(fetchOptions);

      expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          filter: expectedFilter,
          top: 12,
          skip: 2,
        },
      );
    });

    test('Should sanitise double quotation mark by encoding to hex', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexGroupsGraphqlResponse(),
      );

      const fetchOptions: FetchOptions = {
        take: 12,
        skip: 2,
        search: '"',
      };
      const expectedFilter =
        "(contains(data/name/iv, '%22')" +
        " or contains(data/description/iv, '%22')" +
        " or contains(data/tags/iv, '%22'))";

      await groupController.fetch(fetchOptions);

      expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          filter: expectedFilter,
          top: 12,
          skip: 2,
        },
      );
    });
  });

  describe('Fetch by id method', () => {
    const groupId = 'some-group-id';

    test('Should fetch the groups from squidex graphql', async () => {
      const result = await groupControllerMockGraphql.fetchById('group-id-1');

      expect(result).toMatchObject(getGroupResponse());
    });

    test("Should return 404 when the group doesn't exist", async () => {
      const squidexGraphqlResponse = getSquidexGroupGraphqlResponse();
      squidexGraphqlResponse.findGroupsContent = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      await expect(groupController.fetchById(groupId)).rejects.toThrow(
        'Not Found',
      );
    });

    test('Should return the group when the leader user is undefined (ie entity marked as a draft) and skip the leader', async () => {
      const squidexGraphqlResponse = getSquidexGroupGraphqlResponse();
      squidexGraphqlResponse.findGroupsContent!.flatData!.leaders![0]!.user =
        [];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await groupController.fetchById(groupId);

      const expectedGroupResponse = getGroupResponse();

      expect(result).toEqual(
        expect.objectContaining({
          leaders: [expectedGroupResponse.leaders[1]],
        }),
      );
    });
  });

  describe('Fetch-by-team-ID method', () => {
    const teamId = 'eb531b6e-195c-46e2-b347-58fb86715033';

    test('Should fetch the groups from squidex graphql', async () => {
      const result = await groupControllerMockGraphql.fetchByTeamId(teamId, {});

      expect(result).toMatchObject(getListGroupResponse());
    });

    test('Should return an empty result when the client returns an empty list', async () => {
      const squidexGraphqlResponse = getSquidexGroupsGraphqlResponse();
      squidexGraphqlResponse.queryGroupsContentsWithTotal!.total = 0;
      squidexGraphqlResponse.queryGroupsContentsWithTotal!.items = [];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await groupController.fetchByTeamId(teamId, {});
      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should apply the team and pagination filters', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexGroupsGraphqlResponse(),
      );

      await groupController.fetchByTeamId(teamId, { take: 13, skip: 3 });

      const expectedFilter = `data/teams/iv eq '${teamId}'`;
      expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          filter: expectedFilter,
          top: 13,
          skip: 3,
        },
      );
    });

    test('Should filter by multiple team IDs', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexGroupsGraphqlResponse(),
      );

      const teamIds = [teamId, 'dc312b6e-195c-46e2-b347-58fb86715033'];
      await groupController.fetchByTeamId(teamIds, { take: 13, skip: 3 });

      const expectedFilter = `data/teams/iv in ['${teamIds[0]}', '${teamIds[1]}']`;
      expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          filter: expectedFilter,
          top: 13,
          skip: 3,
        },
      );
    });
  });

  describe('Fetch-by-user-ID method', () => {
    const userId = 'eb531b6e-195c-46e2-b347-58fb86715033';
    const teamIds = ['team-id-1', 'team-id-3'];

    test('Should fetch the groups from squidex graphql', async () => {
      const result = await groupControllerMockGraphql.fetchByUserId(
        userId,
        teamIds,
        {},
      );

      expect(result).toMatchObject(getListGroupResponse());
    });

    test('Should apply the team and user filters', async () => {
      const userFilter = `data/leaders/iv/user eq '${userId}'`;
      const teamFilter = `data/teams/iv in ['${teamIds[0]}', '${teamIds[1]}']`;

      squidexGraphqlClientMock.request.mockResolvedValue(
        getSquidexGroupsGraphqlResponse(),
      );

      await groupController.fetchByUserId(userId, teamIds, {});

      expect(squidexGraphqlClientMock.request).toHaveBeenCalledTimes(2);
      expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          filter: userFilter,
          top: 50,
          skip: 0,
        },
      );
      expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          filter: teamFilter,
          top: 50,
          skip: 0,
        },
      );
    });

    test('Should return the deduped result', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexGroupsGraphqlResponse(),
      );
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexGroupsGraphqlResponse(),
      );

      const result = await groupController.fetchByUserId(userId, teamIds, {});

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result).toMatchObject(getListGroupResponse());
    });
  });
});
