import Guides from '../../src/controllers/guides.controller';
import { getGuidesResponse } from '../fixtures/guides.fixture';
import { getDataProviderMock } from '../mocks/data-provider.mock';

describe('Guide controller', () => {
  const guidesDataProviderMock = getDataProviderMock();
  const guides = new Guides(guidesDataProviderMock);

  describe('Fetch method', () => {
    test('Should return an empty result when the data provider returns an empty list', async () => {
      guidesDataProviderMock.fetch.mockResolvedValue({
        aboutUs: '',
        training: [],
        members: [],
        scientificAdvisoryBoard: [],
        pages: [],
      });

      const result = await guides.fetch();

      expect(result).toEqual({
        aboutUs: '',
        training: [],
        members: [],
        scientificAdvisoryBoard: [],
        pages: [],
      });
    });

    test('Should return the guides data', async () => {
      guidesDataProviderMock.fetch.mockResolvedValue(getGuidesResponse());

      const result = await guides.fetch();

      expect(result).toEqual(getGuidesResponse());
    });
  });
});
