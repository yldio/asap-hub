import { NotFoundError } from '@asap-hub/errors';
import WorkingGroups from '../../src/controllers/working-groups';
import {
  getWorkingGroupDataObject,
  getWorkingGroupResponse,
} from '../fixtures/working-groups.fixtures';
import { workingGroupDataProviderMock } from '../mocks/working-group-data-provider.mock';

describe('Working Group controller', () => {
  const workingGroupController = new WorkingGroups(
    workingGroupDataProviderMock,
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch-by-ID method', () => {
    test('Should throw when working-group is not found', async () => {
      workingGroupDataProviderMock.fetchById.mockResolvedValueOnce(null);

      await expect(
        workingGroupController.fetchById('not-found'),
      ).rejects.toThrow(NotFoundError);
    });

    test('Should return the working-group when it finds it', async () => {
      workingGroupDataProviderMock.fetchById.mockResolvedValueOnce(
        getWorkingGroupDataObject(),
      );
      const result = await workingGroupController.fetchById('group-id');

      expect(result).toEqual(getWorkingGroupResponse());
    });
  });
});
