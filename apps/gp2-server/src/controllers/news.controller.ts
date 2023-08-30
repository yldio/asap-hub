import { NotFoundError } from '@asap-hub/errors';
import { gp2 } from '@asap-hub/model';
import { NewsDataProvider } from '../data-providers/types';

export default class NewsController {
  constructor(private newsDataProvider: NewsDataProvider) {}

  async fetchById(id: string): Promise<gp2.NewsResponse> {
    const news = await this.newsDataProvider.fetchById(id);
    if (!news) {
      throw new NotFoundError(undefined, `news with id ${id} not found`);
    }

    return news;
  }
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
