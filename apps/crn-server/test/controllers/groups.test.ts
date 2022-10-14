import { NotFoundError } from '@asap-hub/errors';
import Groups from '../../src/controllers/groups';
import {
  getGroupDataObject,
  getGroupResponse,
} from '../fixtures/groups.fixtures';
import { getUserDataObject } from '../fixtures/users.fixtures';
import { groupDataProviderMock } from '../mocks/group-data-provider.mock';
import { userDataProviderMock } from '../mocks/user-data-provider.mock';

describe('Group controller', () => {
  const groupController = new Groups(
    groupDataProviderMock,
    userDataProviderMock,
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch', () => {
    test('Should return the groups', async () => {
      groupDataProviderMock.fetch.mockResolvedValueOnce({
        total: 1,
        items: [getGroupDataObject()],
      });

      const result = await groupController.fetch({});

      expect(result).toEqual({ items: [getGroupResponse()], total: 1 });
    });

    test.each`
      filter                    | filterValue
      ${['Active']}             | ${{ filter: { active: true } }}
      ${['Inactive']}           | ${{ filter: { active: false } }}
      ${[]}                     | ${{}}
      ${['Active', 'Inactive']} | ${{}}
    `(
      `Should call data provider with correct filter when filter is $filter`,
      async ({ filter, filterValue }) => {
        groupDataProviderMock.fetch.mockResolvedValueOnce({
          total: 1,
          items: [getGroupDataObject()],
        });

        await groupController.fetch({ filter });

        expect(groupDataProviderMock.fetch).toBeCalledWith(filterValue);
      },
    );

    test('Should return an empty list when there are no groups', async () => {
      groupDataProviderMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });
      const result = await groupController.fetch({});

      expect(result).toEqual({ items: [], total: 0 });
    });
  });

  describe('Fetch-by-ID method', () => {
    test('Should throw when group is not found', async () => {
      groupDataProviderMock.fetchById.mockResolvedValueOnce(null);

      await expect(groupController.fetchById('not-found')).rejects.toThrow(
        NotFoundError,
      );
    });

    test('Should return the group when it finds it', async () => {
      groupDataProviderMock.fetchById.mockResolvedValueOnce(
        getGroupDataObject(),
      );
      const result = await groupController.fetchById('group-id');

      expect(result).toEqual(getGroupResponse());
    });
  });

  describe('Fetch-by-team-ID method', () => {
    const teamId = 'eb531b6e-195c-46e2-b347-58fb86715033';

    test('Should return the group', async () => {
      groupDataProviderMock.fetch.mockResolvedValueOnce({
        total: 1,
        items: [getGroupDataObject()],
      });
      const result = await groupController.fetchByTeamId(teamId, {});

      expect(result).toEqual({ items: [getGroupResponse()], total: 1 });
    });

    test('Should call the data provider with correct parameters', async () => {
      groupDataProviderMock.fetch.mockResolvedValueOnce({
        total: 1,
        items: [getGroupDataObject()],
      });
      await groupController.fetchByTeamId(teamId, {});

      expect(groupDataProviderMock.fetch).toBeCalledWith({
        filter: { teamId: [teamId] },
      });
    });

    test('Should filter by multiple team IDs and add pagination parameters', async () => {
      const teamIds = [teamId, 'dc312b6e-195c-46e2-b347-58fb86715033'];
      const pagination = {
        take: 13,
        skip: 3,
      };
      groupDataProviderMock.fetch.mockResolvedValueOnce({
        total: 1,
        items: [getGroupDataObject()],
      });
      await groupController.fetchByTeamId(teamIds, pagination);

      expect(groupDataProviderMock.fetch).toBeCalledWith({
        filter: { teamId: teamIds },
        ...pagination,
      });
    });
  });

  describe('Fetch-by-user-ID method', () => {
    const userId = 'eb531b6e-195c-46e2-b347-58fb86715033';
    const teamIds = ['team-id-1', 'team-id-3'];

    test('Should throw an error if the user is not found', async () => {
      userDataProviderMock.fetchById.mockResolvedValueOnce(null);

      await expect(groupController.fetchByUserId(userId)).rejects.toThrow(
        NotFoundError,
      );
    });

    test('Should return the groups', async () => {
      userDataProviderMock.fetchById.mockResolvedValueOnce(getUserDataObject());
      groupDataProviderMock.fetch.mockResolvedValue({
        total: 1,
        items: [getGroupDataObject()],
      });
      const result = await groupController.fetchByUserId(userId);

      expect(result).toEqual({ items: [getGroupResponse()], total: 1 });
    });

    test('Should call the data provider with correct parameters', async () => {
      const userDataObject = getUserDataObject();
      userDataObject.teams = [
        {
          id: teamIds[0]!,
          role: 'Lead PI (Core Leadership)',
        },
        {
          id: teamIds[1]!,
          role: 'Lead PI (Core Leadership)',
        },
      ];
      userDataProviderMock.fetchById.mockResolvedValueOnce(userDataObject);
      groupDataProviderMock.fetch.mockResolvedValue({
        total: 1,
        items: [getGroupDataObject()],
      });

      await groupController.fetchByUserId(userId);

      expect(userDataProviderMock.fetchById).toBeCalledWith(userId);
      expect(groupDataProviderMock.fetch).toBeCalledTimes(2);
      expect(groupDataProviderMock.fetch).toBeCalledWith({
        filter: { teamId: teamIds },
      });
      expect(groupDataProviderMock.fetch).toBeCalledWith({
        filter: { userId },
      });
    });

    test('Should return the deduped result', async () => {
      const groupDataObject1 = getGroupDataObject();
      (groupDataObject1.id as string) = 'id-1';
      const groupDataObject2 = getGroupDataObject();
      (groupDataObject2.id as string) = 'id-2';

      userDataProviderMock.fetchById.mockResolvedValueOnce(getUserDataObject());
      groupDataProviderMock.fetch.mockResolvedValueOnce({
        total: 2,
        items: [groupDataObject1, groupDataObject2],
      });
      groupDataProviderMock.fetch.mockResolvedValueOnce({
        total: 1,
        items: [groupDataObject2],
      });
      const result = await groupController.fetchByUserId(userId);

      expect(result).toEqual({
        items: [groupDataObject1, groupDataObject2],
        total: 2,
      });
    });
  });
});
