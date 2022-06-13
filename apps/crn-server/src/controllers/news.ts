import { ListNewsResponse, NewsResponse } from '@asap-hub/model';
import { RestNews, SquidexRestClient } from '@asap-hub/squidex';

import { parseNews } from '../entities';

export default class News implements NewsController {
  newsSquidexRestClient: SquidexRestClient<RestNews>;

  constructor(newsSquidexRestClient: SquidexRestClient<RestNews>) {
    this.newsSquidexRestClient = newsSquidexRestClient;
  }

  async fetch(options?: {
    take?: number;
    skip?: number;
  }): Promise<ListNewsResponse> {
    const { total, items } = await this.newsSquidexRestClient.fetch({
      ...options,
      filter: {
        path: 'data.type.iv',
        op: 'ne',
        value: 'Training',
      },
      sort: [{ order: 'descending', path: 'created' }],
    });

    return {
      total,
      items: items.map(parseNews),
    };
  }

  async fetchById(id: string): Promise<NewsResponse> {
    const result = await this.newsSquidexRestClient.fetchById(id);
    return parseNews(result);
  }
}

export interface NewsController {
  fetch: (options?: {
    take?: number;
    skip?: number;
  }) => Promise<ListNewsResponse>;
  fetchById: (id: string) => Promise<NewsResponse>;
}
