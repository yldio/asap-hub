import {
  ListNewsResponse,
  NewsResponse,
  FetchNewsOptions,
  NewsFrequency,
} from '@asap-hub/model';
import { RestNews, SquidexRestClient, Filter, Query } from '@asap-hub/squidex';

import { parseNews } from '../entities';

const notTutorialFilter: Filter = {
  path: 'data.type.iv',
  op: 'ne',
  value: 'Tutorial',
};

const getFrequencyFilter = (frequencyFilter: NewsFrequency[]) => {
  const selectByFrequencyFilter = {
    path: 'data.frequency.iv',
    op: 'in',
    value: frequencyFilter,
  };

  // Select news that were created before
  // frequency field was created
  const selectNewsArticlesFilter = {
    path: 'data.frequency.iv',
    op: 'empty',
    value: null,
  };

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
};

const getFiltersQuery = (options?: FetchNewsOptions) => {
  const textSearchFilter = {
    path: 'data.title.iv',
    op: 'contains',
    value: options?.search,
  };

  if (options?.filter?.frequency) {
    const filterQuery = getFrequencyFilter(options.filter.frequency);

    return options?.search
      ? { and: [...filterQuery.and, textSearchFilter] }
      : filterQuery;
  }
  return options?.search
    ? { and: [notTutorialFilter, textSearchFilter] }
    : notTutorialFilter;
};

export default class News implements NewsController {
  newsSquidexRestClient: SquidexRestClient<RestNews>;

  constructor(newsSquidexRestClient: SquidexRestClient<RestNews>) {
    this.newsSquidexRestClient = newsSquidexRestClient;
  }

  async fetch(options?: FetchNewsOptions): Promise<ListNewsResponse> {
    const { search: _search, ...optionsWithoutSearch } = options || {};

    const { total, items } = await this.newsSquidexRestClient.fetch({
      ...optionsWithoutSearch,
      filter: getFiltersQuery(options) as Query['filter'],
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
