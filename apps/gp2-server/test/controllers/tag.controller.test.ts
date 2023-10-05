import Tag from '../../src/controllers/tag.controller';
import {
  getListTagsDataObject,
  getListTagsResponse,
} from '../fixtures/tag.fixtures';
import { tagDataProviderMock } from '../mocks/tag.data-provider.mock';

describe('Tag controller', () => {
  const tagController = new Tag(tagDataProviderMock);

  describe('Fetch method', () => {
    test('Should return an empty result when no tags exist', async () => {
      tagDataProviderMock.fetch.mockResolvedValue({
        total: 0,
        items: [],
      });
      const result = await tagController.fetch();

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should fetch the tags', async () => {
      tagDataProviderMock.fetch.mockResolvedValue(getListTagsDataObject());

      const result = await tagController.fetch();

      expect(result).toMatchObject(getListTagsResponse());
    });
  });
});
