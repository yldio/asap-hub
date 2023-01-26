import { ListNewsResponse } from '@asap-hub/model';
import { NewsDataProvider } from '../data-providers/news.data-provider';

export interface NewsController {
  fetch: () => Promise<ListNewsResponse>;
}

export default class News implements NewsController {
  constructor(private newsDataProvider: NewsDataProvider) {}

  async fetch(): Promise<ListNewsResponse> {
    const { total, items } = await this.newsDataProvider.fetch();

    return {
      total,
      items,
    };
  }
}
