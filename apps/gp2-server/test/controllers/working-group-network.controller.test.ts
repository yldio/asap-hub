import WorkingGroupNetworkGroups from '../../src/controllers/working-group-network.controller';
import {
  getListWorkingGroupNetworkDataObject,
  getListWorkingGroupNetworkResponse,
} from '../fixtures/working-group-network.fixtures';
import { workingGroupNetworkDataProviderMock } from '../mocks/working-group-network-data-provider.mock';

describe('Working Group Network controller', () => {
  const workingGroupnetworkController = new WorkingGroupNetworkGroups(
    workingGroupNetworkDataProviderMock,
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch', () => {
    test('Should return the working group network', async () => {
      workingGroupNetworkDataProviderMock.fetch.mockResolvedValue(
        getListWorkingGroupNetworkDataObject(),
      );
      const result = await workingGroupnetworkController.fetch();

      expect(result).toEqual(getListWorkingGroupNetworkResponse());
    });

    test('Should return empty list when there are no working groups', async () => {
      workingGroupNetworkDataProviderMock.fetch.mockResolvedValue({
        total: 0,
        items: [],
      });
      const result = await workingGroupnetworkController.fetch();

      expect(result).toEqual({ items: [], total: 0 });
    });
  });
});
