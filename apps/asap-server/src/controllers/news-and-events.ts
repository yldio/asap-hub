import { Squidex } from '@asap-hub/services-common';
import {
  ListNewsAndEventsResponse,
  NewsAndEventsResponse,
} from '@asap-hub/model';

import { CMSNewsAndEvents } from '../entities/news-and-events';
import { parseDate, createURL } from '../utils/squidex';

function transform(item: CMSNewsAndEvents): NewsAndEventsResponse {
  return {
    id: item.id,
    created: parseDate(item.created),
    subtitle: item.data.subtitle?.iv,
    text: item.data.text?.iv,
    thumbnail: item.data.thumbnail && createURL(item.data.thumbnail?.iv)[0],
    title: item.data.title.iv,
    type: item.data.type.iv,
  } as NewsAndEventsResponse;
}

export default class ResearchOutputs {
  newsAndEvents: Squidex<CMSNewsAndEvents>;

  constructor() {
    this.newsAndEvents = new Squidex('news-and-events');
  }

  async fetch(options: {
    take: number;
    skip: number;
  }): Promise<ListNewsAndEventsResponse> {
    const { total, items } = await this.newsAndEvents.fetch({
      ...options,
      sort: [{ order: 'descending', path: 'created' }],
    });

    return {
      total,
      items: items.map(transform),
    };
  }
}
