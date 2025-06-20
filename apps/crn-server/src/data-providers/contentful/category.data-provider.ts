import {
  GraphQLClient,
  CategoryFilter,
  FetchCategoriesQuery,
  FetchCategoriesQueryVariables,
  FETCH_CATEGORIES,
} from '@asap-hub/contentful';
import {
  CategoryDataObject,
  FetchOptions,
  ListCategoryDataObject,
} from '@asap-hub/model';

import { CategoryDataProvider } from '../types';

export type CategoryItem = NonNullable<
  NonNullable<FetchCategoriesQuery['categoryCollection']>['items'][number]
>;

export class CategoryContentfulDataProvider implements CategoryDataProvider {
  constructor(private contentfulClient: GraphQLClient) {}

  async fetchById(): Promise<CategoryDataObject | null> {
    throw new Error('Method not implemented.');
  }

  async fetch(
    options: FetchOptions<string[]>,
  ): Promise<ListCategoryDataObject> {
    const { take = 10, skip = 0, search } = options;

    const searchTerms = (search || '').split(' ').filter(Boolean);
    const searchQuery: CategoryFilter = searchTerms.length
      ? {
          AND: searchTerms.map((term) => ({
            name_contains: term,
          })),
        }
      : {};

    const { categoryCollection } = await this.contentfulClient.request<
      FetchCategoriesQuery,
      FetchCategoriesQueryVariables
    >(FETCH_CATEGORIES, {
      limit: take || null,
      skip: skip || null,
      where: searchQuery,
    });

    if (!categoryCollection?.items) {
      return {
        total: 0,
        items: [],
      };
    }

    return {
      total: categoryCollection?.total,
      items: categoryCollection?.items
        .filter((x): x is CategoryItem => x !== null)
        .map(parseContentfulGraphQlCategories),
    };
  }
}

export const parseContentfulGraphQlCategories = (
  item: CategoryItem,
): CategoryDataObject => ({
  id: item.sys.id ?? '',
  name: item.name ?? '',
});
