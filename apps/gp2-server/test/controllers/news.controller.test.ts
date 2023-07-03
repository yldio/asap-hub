import News from '../../src/controllers/news.controller';
import {
  getListNewsDataObject,
  getListNewsResponse,
} from '../fixtures/news.fixtures';
import { newsDataProviderMock } from '../mocks/news.data-provider.mock';

describe('News controller', () => {
  const newsController = new News(newsDataProviderMock);

  describe('Fetch method', () => {
    test('Should return an empty result when no news exist', async () => {
      newsDataProviderMock.fetch.mockResolvedValue({
        total: 0,
        items: [],
      });
      const result = await newsController.fetch();

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should fetch the news', async () => {
      newsDataProviderMock.fetch.mockResolvedValue(getListNewsDataObject());

      const result = await newsController.fetch();

      expect(result).toMatchObject(getListNewsResponse());
    });
  });
});
