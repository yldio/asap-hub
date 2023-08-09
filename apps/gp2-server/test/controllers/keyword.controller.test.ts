import Keyword from '../../src/controllers/keyword.controller';
import {
  getListKeywordsDataObject,
  getListKeywordsResponse,
} from '../fixtures/keyword.fixtures';
import { keywordDataProviderMock } from '../mocks/keyword.data-provider.mock';

describe('Keyword controller', () => {
  const keywordController = new Keyword(keywordDataProviderMock);

  describe('Fetch method', () => {
    test('Should return an empty result when no keywords exist', async () => {
      keywordDataProviderMock.fetch.mockResolvedValue({
        total: 0,
        items: [],
      });
      const result = await keywordController.fetch();

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should fetch the keywords', async () => {
      keywordDataProviderMock.fetch.mockResolvedValue(
        getListKeywordsDataObject(),
      );

      const result = await keywordController.fetch();

      expect(result).toMatchObject(getListKeywordsResponse());
    });
  });
});
