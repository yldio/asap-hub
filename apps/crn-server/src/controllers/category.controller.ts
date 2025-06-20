import { FetchOptions, ListCategoriesResponse } from '@asap-hub/model';
import { CategoryDataProvider } from '../data-providers/types';

export default class CategoryController {
  constructor(private categoryDataProvider: CategoryDataProvider) {}

  async fetch(options: FetchOptions): Promise<ListCategoriesResponse> {
    const { take = 8, skip = 0, search } = options;

    return this.categoryDataProvider.fetch({
      take,
      skip,
      search,
    });
  }
}
