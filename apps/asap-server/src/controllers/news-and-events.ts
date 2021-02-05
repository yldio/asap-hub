import {
  ListNewsAndEventsResponse,
  NewsOrEventResponse,
} from '@asap-hub/model';
import { RestNewsOrEvent } from '@asap-hub/squidex';

import { InstrumentedSquidex } from '../utils/instrumented-client';
import { parseNewsAndEvents } from '../entities';

export default class NewsAndEvents implements NewsAndEventsController {
  newsAndEvents: InstrumentedSquidex<RestNewsOrEvent>;

  constructor(ctxHeaders?: Record<string, string>) {
    this.newsAndEvents = new InstrumentedSquidex('news-and-events', ctxHeaders);
  }

  async fetch(options: {
    take: number;
    skip: number;
  }): Promise<ListNewsAndEventsResponse> {
    const { total, items } = await this.newsAndEvents.fetch({
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
      items: items.map(parseNewsAndEvents),
    };
  }

  async fetchById(id: string): Promise<NewsOrEventResponse> {
    const result = await this.newsAndEvents.fetchById(id);
    return parseNewsAndEvents(result);
  }
}

export interface NewsAndEventsController {
  fetch: (options: {
    take: number;
    skip: number;
  }) => Promise<ListNewsAndEventsResponse>;
  fetchById: (id: string) => Promise<NewsOrEventResponse>;
}
