import { getContentfulGraphqlClientMockServer } from '@asap-hub/contentful';
import { FetchOptions } from '@asap-hub/model';
import { CategoryContentfulDataProvider } from '../../../src/data-providers/contentful/category.data-provider';
import { CategoryDataProvider } from '../../../src/data-providers/types';
import {
  getContentfulGraphqlCategories,
  getListCategoriesResponse,
  getContentfulGraphqlCategoriesResponse,
} from '../../fixtures/category.fixtures';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';

describe('Category data provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();

  const categoryDataProvider: CategoryDataProvider =
    new CategoryContentfulDataProvider(contentfulGraphqlClientMock);

  const contentfulGraphqlClientMockServer =
    getContentfulGraphqlClientMockServer({
      Category: () => getContentfulGraphqlCategories(),
    });

  const categoryDataProviderMockGraphql = new CategoryContentfulDataProvider(
    contentfulGraphqlClientMockServer,
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch', () => {
    test('Should fetch the list of categories from Contentful GraphQl', async () => {
      const result = await categoryDataProviderMockGraphql.fetch({});

      expect(result).toMatchObject(getListCategoriesResponse());
    });

    test('Should query with search query and return categories', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        getContentfulGraphqlCategoriesResponse(),
      );
      const fetchOptions: FetchOptions<string[]> = {
        search: 'category name',
      };
      await categoryDataProvider.fetch(fetchOptions);
      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          limit: 10,
          skip: null,
          where: {
            AND: [{ name_contains: 'category' }, { name_contains: 'name' }],
          },
        },
      );
    });

    test('Should return an empty array when the client returns null', async () => {
      const graphqlResponse = getContentfulGraphqlCategoriesResponse();
      graphqlResponse.categoryCollection = null;
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        graphqlResponse,
      );
      const result = await categoryDataProvider.fetch({});
      expect(result).toMatchObject({ items: [], total: 0 });
    });

    test('Should return an empty array when items is empty', async () => {
      const graphqlResponse = getContentfulGraphqlCategoriesResponse();
      graphqlResponse.categoryCollection = {
        total: 0,
        items: [],
      };
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        graphqlResponse,
      );
      const result = await categoryDataProvider.fetch({});
      expect(result).toMatchObject({ items: [], total: 0 });
    });
  });

  describe('Fetch by ID', () => {
    test('not implemented', async () => {
      await expect(
        categoryDataProviderMockGraphql.fetchById(),
      ).rejects.toThrow();
    });
  });
});
