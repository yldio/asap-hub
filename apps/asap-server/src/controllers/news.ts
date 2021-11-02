import { ListNewsResponse, NewsResponse } from '@asap-hub/model';
import { RestNews } from '@asap-hub/squidex';

import { InstrumentedSquidex } from '../utils/instrumented-client';
import { parseNews } from '../entities';

export default class News implements NewsController {
  news: InstrumentedSquidex<RestNews>;

  constructor(ctxHeaders?: Record<string, string>) {
    this.news = new InstrumentedSquidex('news-and-events', ctxHeaders);
  }

  async fetch(options: {
    take: number;
    skip: number;
  }): Promise<ListNewsResponse> {
    const { total, items } = await this.news.fetch({
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
    const result = await this.news.fetchById(id);
    return parseNews(result);
  }
}

export interface NewsController {
  fetch: (options: { take: number; skip: number }) => Promise<ListNewsResponse>;
  fetchById: (id: string) => Promise<NewsResponse>;
}
