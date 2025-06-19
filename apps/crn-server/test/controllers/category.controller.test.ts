import CategoryController from '../../src/controllers/category.controller';
import { CategoryDataProvider } from '../../src/data-providers/types';
import {
  getListCategoriesResponse,
  getListCategoryDataObject,
} from '../fixtures/category.fixtures';
import { getDataProviderMock } from '../mocks/data-provider.mock';

describe('Category Controller', () => {
  const categoryDataProviderMock = getDataProviderMock();
  const categoryController = new CategoryController(categoryDataProviderMock);

  describe('fetch', () => {
    test('Should return the categories', async () => {
      categoryDataProviderMock.fetch.mockResolvedValueOnce(
        getListCategoryDataObject(),
      );

      const result = await categoryController.fetch({});

      expect(result).toEqual(getListCategoriesResponse());
    });

    test('Should return an empty list when there are no categories', async () => {
      categoryDataProviderMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });
      const result = await categoryController.fetch({});

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should call the data provider with correct parameters', async () => {
      categoryDataProviderMock.fetch.mockResolvedValueOnce(
        getListCategoryDataObject(),
      );
      await categoryController.fetch({
        search: 'some-search',
        skip: 13,
        take: 9,
      });

      expect(categoryDataProviderMock.fetch).toHaveBeenCalledWith({
        search: 'some-search',
        skip: 13,
        take: 9,
      } satisfies Parameters<CategoryDataProvider['fetch']>[0]);
    });
  });
});
