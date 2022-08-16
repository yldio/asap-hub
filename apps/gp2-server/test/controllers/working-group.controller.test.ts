import WorkingGroup from '../../src/controllers/working-group.controller';
import {
  getListWorkingGroupDataObject,
  getListWorkingGroupResponse,
} from '../fixtures/working-group.fixtures';
import { workingGroupDataProviderMock } from '../mocks/working-group-data-provider.mock';

describe('Working Group controller', () => {
  const workingGroupController = new WorkingGroup(workingGroupDataProviderMock);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('Should return the users', async () => {
      workingGroupDataProviderMock.fetch.mockResolvedValue(
        getListWorkingGroupDataObject(),
      );
      const result = await workingGroupController.fetch();

      expect(result).toEqual(getListWorkingGroupResponse());
    });

    test('Should return empty list when there are no users', async () => {
      workingGroupDataProviderMock.fetch.mockResolvedValue({
        total: 0,
        items: [],
      });
      const result = await workingGroupController.fetch();

      expect(result).toEqual({ items: [], total: 0 });
    });
  });
});
