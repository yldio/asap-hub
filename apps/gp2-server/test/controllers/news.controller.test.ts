import { NotFoundError } from '@asap-hub/errors';
import News from '../../src/controllers/news.controller';
import { NewsDataProvider } from '../../src/data-providers/types';
import {
  getListNewsDataObject,
  getListNewsResponse,
  getNewsDataObject,
  getNewsResponse,
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

    test('Should call the data provider with correct parameters', async () => {
      newsDataProviderMock.fetch.mockResolvedValueOnce(getListNewsDataObject());

      const parameters: Parameters<typeof newsController.fetch>[0] = {
        search: 'search-value',
        skip: 13,
        take: 9,
        filter: { type: ['news'] },
      };

      await newsController.fetch(parameters);

      const expectedParameters: Parameters<NewsDataProvider['fetch']>[0] = {
        skip: 13,
        take: 9,
        search: 'search-value',
        filter: { type: ['news'] },
      };
      expect(newsDataProviderMock.fetch).toBeCalledWith(expectedParameters);
    });
  });
  describe('FetchById', () => {
    beforeEach(jest.resetAllMocks);

    test('Should throw when project is not found', async () => {
      newsDataProviderMock.fetchById.mockResolvedValue(null);

      await expect(newsController.fetchById('not-found')).rejects.toThrow(
        NotFoundError,
      );
    });

    test('Should return the project when it finds it', async () => {
      newsDataProviderMock.fetchById.mockResolvedValue(getNewsDataObject());
      const result = await newsController.fetchById('project-id');

      expect(result).toEqual(getNewsResponse());
    });
  });
});
