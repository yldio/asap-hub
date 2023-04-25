import Labs from '../../src/controllers/labs';
import { LabDataProvider } from '../../src/data-providers/labs.data-provider';
import {
  getListLabDataObject,
  getListLabsResponse,
} from '../fixtures/labs.fixtures';
import { getDataProviderMock } from '../mocks/data-provider.mock';

describe('Lab Controller', () => {
  const labDataProviderMock = getDataProviderMock();
  const labController = new Labs(labDataProviderMock);

  describe('fetch', () => {
    test('Should return the labs', async () => {
      labDataProviderMock.fetch.mockResolvedValueOnce(getListLabDataObject());

      const result = await labController.fetch({});

      expect(result).toEqual(getListLabsResponse());
    });

    test('Should return an empty list when there are no working groups', async () => {
      labDataProviderMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });
      const result = await labController.fetch({});

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should call the data provider with correct parameters', async () => {
      labDataProviderMock.fetch.mockResolvedValueOnce(getListLabDataObject());
      await labController.fetch({ search: 'some-search', skip: 13, take: 9 });

      expect(labDataProviderMock.fetch).toBeCalledWith({
        search: 'some-search',
        skip: 13,
        take: 9,
      } satisfies Parameters<LabDataProvider['fetch']>[0]);
    });
  });
});
