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
      const result = await workingGroupController.fetch();

      expect(result).toEqual(getListWorkingGroupsResponse());
    });

    test('Should return empty list when there are no working groups', async () => {
      workingGroupDataProviderMock.fetch.mockResolvedValue({
        total: 0,
        items: [],
      });
      const result = await workingGroupController.fetch();

      expect(result).toEqual({ items: [], total: 0 });
    });
  });
  describe('FetchById', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('Should throw when working group is not found', async () => {
      workingGroupDataProviderMock.fetchById.mockResolvedValue(null);

      await expect(
        workingGroupController.fetchById('not-found'),
      ).rejects.toThrow(NotFoundError);
    });

    test('Should return the working group when it finds it', async () => {
      workingGroupDataProviderMock.fetchById.mockResolvedValue(
        getWorkingGroupDataObject(),
      );
      const result = await workingGroupController.fetchById('working-group-id');

      expect(result).toEqual(getWorkingGroupResponse());
    });
  });
});
