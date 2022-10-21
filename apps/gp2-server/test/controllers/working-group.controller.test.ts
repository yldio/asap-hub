import { NotFoundError } from '@asap-hub/errors';
import WorkingGroups from '../../src/controllers/working-group.controller';
import {
  getListWorkingGroupDataObject,
  getListWorkingGroupsResponse,
  getWorkingGroupDataObject,
  getWorkingGroupResponse,
} from '../fixtures/working-group.fixtures';
import { workingGroupDataProviderMock } from '../mocks/working-group-data-provider.mock';

describe('Working Group controller', () => {
  const workingGroupController = new WorkingGroups(
    workingGroupDataProviderMock,
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch', () => {
    test('Should return the working group', async () => {
      workingGroupDataProviderMock.fetch.mockResolvedValue(
        getListWorkingGroupDataObject(),
      );
      const result = await workingGroupController.fetch('11');

      expect(result).toEqual(getListWorkingGroupsResponse());
    });

    test('Should return empty list when there are no working groups', async () => {
      workingGroupDataProviderMock.fetch.mockResolvedValue({
        total: 0,
        items: [],
      });
      const result = await workingGroupController.fetch('11');

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should remove the resource if the user is not a member of the working group', async () => {
      const list = getListWorkingGroupDataObject();

      const nonMemberWorkingGroup = {
        ...getWorkingGroupDataObject(),
        members: [
          {
            userId: '7',
            firstName: 'Peter',
            lastName: 'Parker',
            role: 'Lead' as const,
          },
        ],
      };
      const listWithNonMemberWorkingGroup = {
        total: 2,
        items: [...list.items, nonMemberWorkingGroup],
      };
      workingGroupDataProviderMock.fetch.mockResolvedValue(
        listWithNonMemberWorkingGroup,
      );
      const result = await workingGroupController.fetch('11');

      const expectedItems = getListWorkingGroupsResponse().items;
      const { resources: _, ...expectedWorkingGroup } =
        getWorkingGroupResponse();

      expect(result.items).toStrictEqual([
        ...expectedItems,
        {
          ...expectedWorkingGroup,
          members: [
            {
              userId: '7',
              firstName: 'Peter',
              lastName: 'Parker',
              role: 'Lead',
            },
          ],
        },
      ]);
    });
  });
  describe('FetchById', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('Should throw when working group is not found', async () => {
      workingGroupDataProviderMock.fetchById.mockResolvedValue(null);

      await expect(
        workingGroupController.fetchById('not-found', '11'),
      ).rejects.toThrow(NotFoundError);
    });

    test('Should return the working group when it finds it', async () => {
      workingGroupDataProviderMock.fetchById.mockResolvedValue(
        getWorkingGroupDataObject(),
      );
      const result = await workingGroupController.fetchById(
        'working-group-id',
        '11',
      );

      expect(result).toEqual(getWorkingGroupResponse());
    });

    test('Should not return the resource when the user is not part of the working group', async () => {
      workingGroupDataProviderMock.fetchById.mockResolvedValue({
        ...getWorkingGroupDataObject(),
        members: [
          {
            userId: '7',
            firstName: 'Peter',
            lastName: 'Parker',
            role: 'Lead' as const,
          },
        ],
      });
      const result = await workingGroupController.fetchById(
        'working-group-id',
        '11',
      );

      const { resources: _, ...expectedWorkingGroup } =
        getWorkingGroupResponse();
      expect(result).toStrictEqual({
        ...expectedWorkingGroup,
        members: [
          {
            userId: '7',
            firstName: 'Peter',
            lastName: 'Parker',
            role: 'Lead',
          },
        ],
      });
    });
  });
});
