import { gp2 } from '@asap-hub/model';
import { NewsDataProvider } from '../data-providers/news.data-provider';

export interface NewsController {
  fetch: () => Promise<gp2.ListNewsResponse>;
}

export default class News implements NewsController {
  constructor(private newsDataProvider: NewsDataProvider) {}

  async fetch(): Promise<gp2.ListNewsResponse> {
    const { total, items } = await this.newsDataProvider.fetch();

    return {
      total,
      items,
    };
  }
}
