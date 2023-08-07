import { gp2 } from '@asap-hub/model';
import { NewsDataProvider } from '../data-providers/types';

export default class NewsController {
  constructor(private newsDataProvider: NewsDataProvider) {}

  async fetch(options?: gp2.FetchNewsOptions): Promise<gp2.ListNewsResponse> {
    const { total, items } = await this.newsDataProvider.fetch({
      ...options,
    });

    return {
      total,
      items,
    };
  }
}
