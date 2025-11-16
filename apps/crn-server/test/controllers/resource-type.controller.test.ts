import ResourceTypeController from '../../src/controllers/resource-type.controller';
import { ResourceTypeDataProvider } from '../../src/data-providers/types';
import {
  getResourceTypeDataObject,
  getResourceTypeResponse,
} from '../fixtures/resource-type.fixtures';
import { getDataProviderMock } from '../mocks/data-provider.mock';

describe('ResourceType controller', () => {
  const resourceTypeDataProvider = getDataProviderMock();
  const resourceTypeController = new ResourceTypeController(
    resourceTypeDataProvider,
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch method', () => {
    test('Should return an empty list when there are no resource types', async () => {
      resourceTypeDataProvider.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });
      const result = await resourceTypeController.fetch();

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should return the resource types', async () => {
      resourceTypeDataProvider.fetch.mockResolvedValueOnce({
        total: 1,
        items: [getResourceTypeDataObject()],
      });

      const result = await resourceTypeController.fetch();

      expect(result).toEqual({
        items: [getResourceTypeResponse()],
        total: 1,
      });
    });

    test('Should call the data provider with correct parameters', async () => {
      await resourceTypeController.fetch({
        take: 10,
        skip: 5,
      });

      const expectedParameters: Parameters<
        ResourceTypeDataProvider['fetch']
      >[0] = {
        skip: 5,
        take: 10,
      };
      expect(resourceTypeDataProvider.fetch).toHaveBeenCalledWith(
        expectedParameters,
      );
    });

    test('Should use default parameters when none provided', async () => {
      await resourceTypeController.fetch({});

      const expectedParameters: Parameters<
        ResourceTypeDataProvider['fetch']
      >[0] = {
        skip: 0,
        take: 100,
      };
      expect(resourceTypeDataProvider.fetch).toHaveBeenCalledWith(
        expectedParameters,
      );
    });
  });
});

