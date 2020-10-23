import { Squidex } from '@asap-hub/services-common';
import { ListNewsAndEventsResponse } from '@asap-hub/model';

import { CMSNewsAndEvents, parse } from '../entities/news-and-events';

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
      filter: {
        path: 'data.type.iv',
        op: 'ne',
        value: 'Training',
      },
      sort: [{ order: 'descending', path: 'created' }],
    });

    return {
      total,
      items: items.map(parse),
    };
  }
}
