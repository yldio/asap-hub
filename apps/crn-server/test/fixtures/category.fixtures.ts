import {
  CategoryDataObject,
  CategoryResponse,
  ListCategoryDataObject,
  ListCategoriesResponse,
} from '@asap-hub/model';
import { FetchCategoriesQuery } from '@asap-hub/contentful';

export const getCategoryDataObject = (): CategoryDataObject => ({
  name: 'Category 1',
  id: '1',
});

export const getListCategoryDataObject = (): ListCategoryDataObject => ({
  total: 1,
  items: [getCategoryDataObject()],
});

export const getCategoryResponse = (): CategoryResponse =>
  getCategoryDataObject();

export const getListCategoriesResponse = (): ListCategoriesResponse => ({
  total: 1,
  items: [getCategoryResponse()],
});

export const getContentfulGraphqlCategories = (): NonNullable<
  NonNullable<FetchCategoriesQuery['categoryCollection']>['items'][number]
> => ({
  sys: {
    id: '1',
  },
  name: 'Category 1',
});

export const getContentfulGraphqlCategoriesResponse =
  (): FetchCategoriesQuery => ({
    categoryCollection: {
      total: 1,
      items: [getContentfulGraphqlCategories()],
    },
  });
