import { NotFoundError } from '@asap-hub/errors';
import {
  FetchNewsFilter,
  FetchPaginationOptions,
  ListNewsDataObject,
  NewsDataObject,
  NewsFrequency,
} from '@asap-hub/model';
import {
  Filter,
  parseDate,
  Query,
  RestNews,
  SquidexRestClient,
} from '@asap-hub/squidex';
import { createUrl } from '../utils/urls';

export interface NewsDataProvider {
  fetchById(id: string): Promise<NewsDataObject | null>;
  fetch: (options?: FetchNewsProviderOptions) => Promise<ListNewsDataObject>;
}

export class NewsSquidexDataProvider {
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

export type FetchNewsProviderOptions = FetchPaginationOptions & {
  filter?: FetchNewsFilter & {
    title?: string;
  };
};

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

const getFiltersQuery = (options?: FetchNewsProviderOptions) => {
  const textSearchFilter = {
    path: 'data.title.iv',
    op: 'contains',
    value: options?.filter?.title,
  };

  if (options?.filter?.frequency) {
    const filterQuery = getFrequencyFilter(options.filter.frequency);

    return options?.filter?.title
      ? { and: [...filterQuery.and, textSearchFilter] }
      : filterQuery;
  }
  return options?.filter?.title
    ? { and: [notTutorialFilter, textSearchFilter] }
    : notTutorialFilter;
};
