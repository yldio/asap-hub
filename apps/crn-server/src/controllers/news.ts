import {
  ListNewsResponse,
  NewsResponse,
  FetchNewsOptions,
  FetchNewsFilter,
} from '@asap-hub/model';
import { RestNews, SquidexRestClient, Filter } from '@asap-hub/squidex';

import { parseNews } from '../entities';

const notTutorialFilter: Filter = {
  path: 'data.type.iv',
  op: 'ne',
  value: 'Tutorial',
};

const getFiltersQuery = (filter?: FetchNewsFilter) => {
  const frequencyFilter = filter?.frequency;

  const selectByFrequencyFilter = {
    path: 'data.frequency.iv',
    op: 'in',
    value: frequencyFilter,
  } as Filter;

  // Select news that were created before
  // frequency field was created
  const selectNewsArticlesFilter = {
    path: 'data.frequency.iv',
    op: 'empty',
    value: null,
  } as Filter;

  if (frequencyFilter) {
    if (frequencyFilter.includes('News Articles')) {
      return {
        and: [
          notTutorialFilter,
          {
            or: [selectNewsArticlesFilter, selectByFrequencyFilter],
          },
        ],
      };
    }
    return {
      and: [notTutorialFilter, selectByFrequencyFilter],
    };
  }

  return notTutorialFilter;
};

export default class News implements NewsController {
  newsSquidexRestClient: SquidexRestClient<RestNews>;

  constructor(newsSquidexRestClient: SquidexRestClient<RestNews>) {
    this.newsSquidexRestClient = newsSquidexRestClient;
  }

  async fetch(options?: FetchNewsOptions): Promise<ListNewsResponse> {
    const { total, items } = await this.newsSquidexRestClient.fetch({
      ...options,
      filter: getFiltersQuery(options?.filter),
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
