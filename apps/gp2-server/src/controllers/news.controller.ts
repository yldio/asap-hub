import { gp2, FetchNewsOptions } from '@asap-hub/model';
import { NewsDataProvider } from '../data-providers/types';

export default class NewsController {
  constructor(private newsDataProvider: NewsDataProvider) {}

  async fetch(options?: FetchNewsOptions): Promise<gp2.ListNewsResponse> {
    const { search, filter, ...paginationOptions } = options || {};

    const { total, items } = await this.newsDataProvider.fetch({
      ...paginationOptions,
      filter: { frequency: filter?.frequency, title: search },
    });

    return {
      total,
      items,
    };
  }
}
