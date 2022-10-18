import { NotFoundError } from '@asap-hub/errors';
import {
  ListNewsResponse,
  NewsResponse,
  FetchNewsOptions,
} from '@asap-hub/model';
import { NewsDataProvider } from '../data-providers/news.data-provider';

export interface NewsController {
  fetch: (options?: FetchNewsOptions) => Promise<ListNewsResponse>;
  fetchById: (id: string) => Promise<NewsResponse>;
}

export default class News implements NewsController {
  constructor(private newsDataProvider: NewsDataProvider) {}

  async fetch(options?: FetchNewsOptions): Promise<ListNewsResponse> {
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

  async fetchById(newsId: string): Promise<NewsResponse> {
    const news = await this.newsDataProvider.fetchById(newsId);

    if (!news) {
      throw new NotFoundError(undefined, `News with id ${newsId} not found`);
    }

    return news;
  }
}
