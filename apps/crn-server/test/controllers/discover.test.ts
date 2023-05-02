import Discover from '../../src/controllers/discover';
import {
  getDiscoverResponse,
  getDiscoverDataObject,
} from '../fixtures/discover.fixtures';
import { getDataProviderMock } from '../mocks/data-provider.mock';

describe('Discover controller', () => {
  const discoverDataProviderMock = getDataProviderMock();
  const discover = new Discover(discoverDataProviderMock);

  describe('Fetch method', () => {
    test('Should return an empty result when the data provider returns an empty list', async () => {
      discoverDataProviderMock.fetch.mockResolvedValue({
        aboutUs: '',
        training: [],
        members: [],
        scientificAdvisoryBoard: [],
        pages: [],
      });

      const result = await discover.fetch();

      expect(result).toEqual({
        aboutUs: '',
        training: [],
        members: [],
        scientificAdvisoryBoard: [],
        pages: [],
      });
    });

    test('Should return the discover data', async () => {
      discoverDataProviderMock.fetch.mockResolvedValue(getDiscoverDataObject());

      const result = await discover.fetch();

      expect(result).toEqual(getDiscoverResponse());
    });
  });
});
