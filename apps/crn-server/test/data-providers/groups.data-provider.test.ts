import { FetchGroupOptions } from '@asap-hub/model';
import { GroupSquidexDataProvider } from '../../src/data-providers/groups.data-provider';
import {
  getGroupDataObject,
  getListGroupResponse,
  getSquidexGroupGraphqlResponse,
  getSquidexGroupsGraphqlResponse,
} from '../fixtures/groups.fixtures';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';

describe('Group Data Provider', () => {
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();
  const groupDataProvider = new GroupSquidexDataProvider(
    squidexGraphqlClientMock,
  );

  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const groupDataProviderMockGraphql = new GroupSquidexDataProvider(
    squidexGraphqlClientMockServer,
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch method', () => {
    test('Should fetch the groups from squidex graphql', async () => {
      const result = await groupDataProviderMockGraphql.fetch({});

      expect(result).toMatchObject({ total: 1, items: [getGroupDataObject()] });
    });

    test('Should return an empty result when the client returns an empty list', async () => {
      const squidexGraphqlResponse = getSquidexGroupsGraphqlResponse();
      squidexGraphqlResponse.queryGroupsContentsWithTotal!.total = 0;
      squidexGraphqlResponse.queryGroupsContentsWithTotal!.items = [];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await groupDataProvider.fetch({});
      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should return an empty result when the client returns a response with queryGroupsContentsWithTotal property set to null', async () => {
      const squidexGraphqlResponse = getSquidexGroupsGraphqlResponse();
      squidexGraphqlResponse.queryGroupsContentsWithTotal = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await groupDataProvider.fetch({});
      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should return an empty result when the client returns a response with items property set to null', async () => {
      const squidexGraphqlResponse = getSquidexGroupsGraphqlResponse();
      squidexGraphqlResponse.queryGroupsContentsWithTotal!.items = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await groupDataProvider.fetch({});
      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should query with filters and return the groups', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexGroupsGraphqlResponse(),
      );

      const fetchOptions: FetchGroupOptions = {
        take: 12,
        skip: 2,
        search: 'first last',
      };
      const expectedFilter =
        "((contains(data/name/iv,'first'))" +
        " or (contains(data/description/iv,'first'))" +
        " or (contains(data/tags/iv,'first')))" +
        ' and' +
        " ((contains(data/name/iv,'last'))" +
        " or (contains(data/description/iv,'last'))" +
        " or (contains(data/tags/iv,'last')))";

      const result = await groupDataProvider.fetch(fetchOptions);

      expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          filter: expectedFilter,
          top: 12,
          skip: 2,
        },
      );
      expect(result).toEqual({ total: 1, items: [getGroupDataObject()] });
    });

    test('Should sanitise single quotes by doubling them and encoding to hex', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexGroupsGraphqlResponse(),
      );

      const fetchOptions: FetchGroupOptions = {
        take: 12,
        skip: 2,
        search: "'",
      };
      const expectedFilter =
        "((contains(data/name/iv,''''))" +
        " or (contains(data/description/iv,''''))" +
        " or (contains(data/tags/iv,'''')))";

      await groupDataProvider.fetch(fetchOptions);

      expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          filter: expectedFilter,
          top: 12,
          skip: 2,
        },
      );
    });

    test('Should sanitise double quotation mark by escaping it', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexGroupsGraphqlResponse(),
      );

      const fetchOptions: FetchGroupOptions = {
        take: 12,
        skip: 2,
        search: '"',
      };
      const expectedFilter =
        "((contains(data/name/iv,'\"'))" +
        " or (contains(data/description/iv,'\"'))" +
        " or (contains(data/tags/iv,'\"')))";

      await groupDataProvider.fetch(fetchOptions);

      expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          filter: expectedFilter,
          top: 12,
          skip: 2,
        },
      );
    });

    test('Should apply the team and pagination filters', async () => {
      const teamId = 'eb531b6e-195c-46e2-b347-58fb86715033';
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexGroupsGraphqlResponse(),
      );

      await groupDataProvider.fetch({
        filter: { teamId: [teamId] },
        take: 13,
        skip: 3,
      });

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
      const teamIds = [
        'eb531b6e-195c-46e2-b347-58fb86715033',
        'dc312b6e-195c-46e2-b347-58fb86715033',
      ];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexGroupsGraphqlResponse(),
      );

      await groupDataProvider.fetch({
        filter: { teamId: teamIds },
        take: 13,
        skip: 3,
      });

      const expectedFilter = `data/teams/iv in ('${teamIds[0]}','${teamIds[1]}')`;
      expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          filter: expectedFilter,
          top: 13,
          skip: 3,
        },
      );
    });

    test('Should filter by user ID', async () => {
      const userId = 'eb531b6e-195c-46e2-b347-58fb86715033';
      squidexGraphqlClientMock.request.mockResolvedValue(
        getSquidexGroupsGraphqlResponse(),
      );

      await groupDataProvider.fetch({ filter: { userId } });

      const userFilter = `data/leaders/iv/user eq '${userId}'`;
      expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          filter: userFilter,
          top: 50,
          skip: 0,
        },
      );
    });

    test('Should apply the team and user filters', async () => {
      const userId = 'eb531b6e-195c-46e2-b347-58fb86715033';
      const teamIds = ['team-id-1', 'team-id-3'];

      squidexGraphqlClientMock.request.mockResolvedValue(
        getSquidexGroupsGraphqlResponse(),
      );

      await groupDataProvider.fetch({ filter: { userId, teamId: teamIds } });

      const teamFilter = `data/teams/iv in ('${teamIds[0]}','${teamIds[1]}')`;
      const userFilter = `data/leaders/iv/user eq '${userId}'`;
      expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          filter: [teamFilter, userFilter].join(' and '),
          top: 50,
          skip: 0,
        },
      );
    });

    test('Should return the deduped result', async () => {
      const userId = 'eb531b6e-195c-46e2-b347-58fb86715033';
      const teamIds = ['team-id-1', 'team-id-3'];

      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexGroupsGraphqlResponse(),
      );
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexGroupsGraphqlResponse(),
      );

      const result = await groupDataProvider.fetch({
        filter: { userId, teamId: teamIds },
      });

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result).toMatchObject(getListGroupResponse());
    });
  });

  describe('Fetch by id method', () => {
    const groupId = 'some-group-id';

    test('Should fetch the groups from squidex graphql', async () => {
      const result = await groupDataProviderMockGraphql.fetchById('group-id-1');

      expect(result).toMatchObject(getGroupDataObject());
    });

    test("Should return null when the group doesn't exist", async () => {
      const squidexGraphqlResponse = getSquidexGroupGraphqlResponse();
      squidexGraphqlResponse.findGroupsContent = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      expect(await groupDataProvider.fetchById(groupId)).toBeNull();
    });

    test('Should return the group when the leader user is undefined (ie entity marked as a draft) and skip the leader', async () => {
      const squidexGraphqlResponse = getSquidexGroupGraphqlResponse();
      squidexGraphqlResponse.findGroupsContent!.flatData!.leaders![0]!.user =
        [];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await groupDataProvider.fetchById(groupId);

      const expectedGroupDataObject = getGroupDataObject();

      expect(result).toEqual(
        expect.objectContaining({
          leaders: [expectedGroupDataObject.leaders[1]],
        }),
      );
    });
  });
});
