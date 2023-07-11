import { gp2 } from '@asap-hub/model';
import { NewsDataProvider } from '../data-providers/types';

export default class NewsController {
  constructor(private newsDataProvider: NewsDataProvider) {}

  async fetch(): Promise<gp2.ListNewsResponse> {
    const { total, items } = await this.newsDataProvider.fetch({});

    return {
      total,
      items,
    };
  }
}
