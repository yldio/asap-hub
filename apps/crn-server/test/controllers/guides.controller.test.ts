import Guides from '../../src/controllers/guide.controller';
import { getGuidesResponse } from '../fixtures/guides.fixture';
import { getDataProviderMock } from '../mocks/data-provider.mock';

describe('Guide controller', () => {
  const guidesDataProviderMock = getDataProviderMock();
  const guides = new Guides(guidesDataProviderMock);

  describe('Fetch method', () => {
    test('Should return an empty result when the data provider returns an empty list', async () => {
      guidesDataProviderMock.fetchByCollectionTitle.mockResolvedValue({
        items: [],
        total: 0,
      });

      const result = await guides.fetchByCollectionTitle('Home');

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should return the guides data', async () => {
      guidesDataProviderMock.fetchByCollectionTitle.mockResolvedValue(
        getGuidesResponse(),
      );

      const result = await guides.fetchByCollectionTitle('Home');

      expect(result).toEqual(getGuidesResponse());
    });
  });
});
