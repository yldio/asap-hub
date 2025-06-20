import ImpactController from '../../src/controllers/impact.controller';
import { ImpactDataProvider } from '../../src/data-providers/types';
import {
  getListImpactDataObject,
  getListImpactsResponse,
} from '../fixtures/impact.fixtures';
import { getDataProviderMock } from '../mocks/data-provider.mock';

describe('Impact Controller', () => {
  const impactDataProviderMock = getDataProviderMock();
  const impactController = new ImpactController(impactDataProviderMock);

  describe('fetch', () => {
    test('Should return the impacts', async () => {
      impactDataProviderMock.fetch.mockResolvedValueOnce(
        getListImpactDataObject(),
      );

      const result = await impactController.fetch({});

      expect(result).toEqual(getListImpactsResponse());
    });

    test('Should return an empty list when there are no impacts', async () => {
      impactDataProviderMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });
      const result = await impactController.fetch({});

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should call the data provider with correct parameters', async () => {
      impactDataProviderMock.fetch.mockResolvedValueOnce(
        getListImpactDataObject(),
      );
      await impactController.fetch({
        search: 'some-search',
        skip: 13,
        take: 9,
      });

      expect(impactDataProviderMock.fetch).toHaveBeenCalledWith({
        search: 'some-search',
        skip: 13,
        take: 9,
      } satisfies Parameters<ImpactDataProvider['fetch']>[0]);
    });
  });
});
