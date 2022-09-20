import {
  ListNewsResponse,
  NewsResponse,
  FetchNewsOptions,
} from '@asap-hub/model';
import {
  RestNews,
  SquidexRestClient,
  Filter,
  LogicalFilter,
} from '@asap-hub/squidex';

import { parseNews } from '../entities';

const notTutorialFilter: Filter = {
  path: 'data.type.iv',
  op: 'ne',
  value: 'Tutorial',
};

export default class News implements NewsController {
  newsSquidexRestClient: SquidexRestClient<RestNews>;

  constructor(newsSquidexRestClient: SquidexRestClient<RestNews>) {
    this.newsSquidexRestClient = newsSquidexRestClient;
  }

  async fetch(options?: FetchNewsOptions): Promise<ListNewsResponse> {
    const { total, items } = await this.newsSquidexRestClient.fetch({
      ...options,
      filter: options?.filter?.frequency
        ? !options?.filter?.frequency.includes('News Articles')
          ? {
              and: [
                notTutorialFilter,
                {
                  path: 'data.frequency.iv',
                  op: 'in',
                  value: options.filter.frequency,
                },
              ],
            }
          : {
              and: [
                notTutorialFilter,
                {
                  or: [
                    {
                      path: 'data.frequency.iv',
                      op: 'empty',
                      value: null,
                    },
                    {
                      path: 'data.frequency.iv',
                      op: 'in',
                      value: options.filter.frequency,
                    },
                  ],
                } as LogicalFilter,
              ],
            }
        : notTutorialFilter,
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
  fetch: (options?: FetchNewsOptions) => Promise<ListNewsResponse>;
  fetchById: (id: string) => Promise<NewsResponse>;
}
