import { NotFoundError } from '@asap-hub/errors';
import News from '../../src/controllers/news';
import { NewsDataProvider } from '../../src/data-providers/news.data-provider';
import {
  getNewsDataObject,
  getNewsResponse,
  getListNewsDataObject,
  getListNewsResponse,
} from '../fixtures/news.fixtures';
import { newsDataProviderMock } from '../mocks/news-data-provider.mock';

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

    test('Should call the data provider with correct parameters', async () => {
      newsDataProviderMock.fetch.mockResolvedValueOnce(getListNewsDataObject());

      const parameters: Parameters<typeof newsController.fetch>[0] = {
        search: 'some-search',
        skip: 13,
        take: 9,
        filter: { frequency: ['Biweekly Newsletter'] },
      };

      await newsController.fetch(parameters);

      const expectedParameters: Parameters<NewsDataProvider['fetch']>[0] = {
        skip: 13,
        take: 9,
        filter: { frequency: ['Biweekly Newsletter'], title: 'some-search' },
      };
      expect(newsDataProviderMock.fetch).toBeCalledWith(expectedParameters);
    });
  });

  describe('Fetch-by-id method', () => {
    const id = 'some-id';

    test('Should throw a Not Found error when the news is not found', async () => {
      newsDataProviderMock.fetchById.mockResolvedValue(null);

      await expect(newsController.fetchById(id)).rejects.toThrow(NotFoundError);
    });

    test('Should return the result when the news and event exists', async () => {
      newsDataProviderMock.fetchById.mockResolvedValue(getNewsDataObject());

      const result = await newsController.fetchById(id);

      expect(result).toEqual(getNewsResponse());
      expect(newsDataProviderMock.fetchById).toBeCalledWith(id);
    });
  });
});
