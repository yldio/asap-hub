import { NotFoundError } from '@asap-hub/errors';
import {
  ListNewsDataObject,
  NewsDataObject,
  NewsFrequency,
} from '@asap-hub/model';
import {
  parseDate,
  Query,
  RestNews,
  SquidexRestClient,
} from '@asap-hub/squidex';
import { createUrl } from '../utils/urls';
import { NewsDataProvider, FetchNewsProviderOptions } from './types';

export class NewsSquidexDataProvider implements NewsDataProvider {
  constructor(private newsSquidexRestClient: SquidexRestClient<RestNews>) {}

  async fetchById(id: string): Promise<NewsDataObject | null> {
    try {
      const result = await this.newsSquidexRestClient.fetchById(id);
      return parseRestNews(result);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return null;
      }
      throw error;
    }
  }

  async fetch(options?: FetchNewsProviderOptions): Promise<ListNewsDataObject> {
    const { total, items } = await this.newsSquidexRestClient.fetch({
      ...options,
      filter: getFiltersQuery(options) as Query['filter'],
      sort: [{ order: 'descending', path: 'created' }],
    });

    return {
      total,
      items: items.map(parseRestNews),
    };
  }
}

const parseRestNews = (item: RestNews): NewsDataObject => ({
  id: item.id,
  created: parseDate(item.created).toISOString(),
  shortText: item.data.shortText?.iv,
  text: item.data.text?.iv,
  frequency: item.data.frequency?.iv,
  link: item.data.link?.iv,
  linkText: item.data.linkText?.iv,
  thumbnail: item.data.thumbnail?.iv
    ? createUrl(item.data.thumbnail.iv)[0]
    : undefined,
  title: item.data.title.iv,
  type: item.data.type.iv,
});

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
      or: [selectNewsArticlesFilter, selectByFrequencyFilter],
    };
  }

  return {
    ...selectByFrequencyFilter,
  };
};

const getFiltersQuery = (options?: FetchNewsProviderOptions) => {
  const textSearchFilter = {
    path: 'data.title.iv',
    op: 'contains',
    value: options?.filter?.title,
  };

  if (options?.filter?.frequency) {
    const filterQuery = getFrequencyFilter(options.filter.frequency);

    return options?.filter?.title
      ? { and: [filterQuery, textSearchFilter] }
      : filterQuery;
  }
  return options?.filter?.title && textSearchFilter;
};
