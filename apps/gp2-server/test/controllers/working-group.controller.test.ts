import { NotFoundError } from '@asap-hub/errors';
import WorkingGroups from '../../src/controllers/working-group.controller';
import {
  getListWorkingGroupDataObject,
  getListWorkingGroupsResponse,
  getWorkingGroupDataObject,
  getWorkingGroupResponse,
} from '../fixtures/working-group.fixtures';
import { workingGroupDataProviderMock } from '../mocks/working-group.data-provider.mock';

describe('Working Group controller', () => {
  const workingGroupController = new WorkingGroups(
    workingGroupDataProviderMock,
  );

  beforeEach(jest.resetAllMocks);

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

    describe('resources', () => {
      const member = {
        userId: '7',
        firstName: 'Peter',
        lastName: 'Parker',
        displayName: 'Peter Parker',
        role: 'Lead' as const,
      };
      test('Should remove the resource if the user is not a member of the working group', async () => {
        const list = getListWorkingGroupDataObject();

        const nonMemberWorkingGroup = {
          ...getWorkingGroupDataObject(),
          members: [member],
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
            members: [member],
          },
        ]);
      });
      test('Should remove the resource if the user is not specified', async () => {
        const nonMemberWorkingGroup = {
          ...getWorkingGroupDataObject(),
          members: [member],
        };
        const listWithNonMemberWorkingGroup = {
          total: 1,
          items: [nonMemberWorkingGroup],
        };
        workingGroupDataProviderMock.fetch.mockResolvedValue(
          listWithNonMemberWorkingGroup,
        );
        const result = await workingGroupController.fetch();

        const { resources: _, ...expectedWorkingGroup } =
          getWorkingGroupResponse();

        expect(result.items).toStrictEqual([
          {
            ...expectedWorkingGroup,
            members: [member],
          },
        ]);
      });
    });
  });
  describe('FetchById', () => {
    beforeEach(jest.resetAllMocks);

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

    describe('resources', () => {
      const member = {
        userId: '7',
        firstName: 'Peter',
        lastName: 'Parker',
        displayName: 'Peter Parker',
        role: 'Lead' as const,
      };
      test('Should not return the resource when the user is not part of the working group', async () => {
        workingGroupDataProviderMock.fetchById.mockResolvedValue({
          ...getWorkingGroupDataObject(),
          members: [member],
        });
        const result = await workingGroupController.fetchById(
          'working-group-id',
          '11',
        );

        const { resources: _, ...expectedWorkingGroup } =
          getWorkingGroupResponse();
        expect(result).toStrictEqual({
          ...expectedWorkingGroup,
          members: [member],
        });
      });
      test('Should not return the resource when the user is not specified', async () => {
        workingGroupDataProviderMock.fetchById.mockResolvedValue({
          ...getWorkingGroupDataObject(),
          members: [member],
        });
        const result =
          await workingGroupController.fetchById('working-group-id');

        const { resources: _, ...expectedWorkingGroup } =
          getWorkingGroupResponse();
        expect(result).toStrictEqual({
          ...expectedWorkingGroup,
          members: [member],
        });
      });
    });
  });

  describe('update', () => {
    beforeEach(jest.resetAllMocks);

    test('Should return the newly updated working group', async () => {
      const resource = { type: 'Note' as const, title: 'a title to update' };
      const mockResponse = getWorkingGroupDataObject();
      workingGroupDataProviderMock.fetchById.mockResolvedValue(mockResponse);
      const result = await workingGroupController.update(
        '7',
        { resources: [resource] },
        '11',
      );

      expect(result).toEqual(getWorkingGroupResponse());
      expect(workingGroupDataProviderMock.update).toHaveBeenCalledWith('7', {
        resources: [resource],
      });
    });
  });
});
