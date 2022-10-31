import {
  ListNewsDataObject,
  NewsDataObject,
  FetchNewsFilter,
  FetchPaginationOptions,
} from '@asap-hub/model';
import { NotFoundError } from '@asap-hub/errors';

import {
  getClient,
  ContentfulRestNews,
  News,
  parseRichText,
} from '@asap-hub/contentful';

export interface NewsDataProvider {
  fetchById(id: string): Promise<NewsDataObject | null>;
  fetch: (options?: FetchNewsProviderOptions) => Promise<ListNewsDataObject>;
}

export class NewsContentfulDataProvider {
  constructor(private contentfulClient: ReturnType<typeof getClient>) {}

  async fetch(options?: FetchNewsProviderOptions) {
    const { total, items } = await this.contentfulClient.getEntries<News>({
      content_type: 'news',
      'fields.title[match]': options?.filter?.title,
      'fields.frequency[in]': options?.filter?.frequency?.join(','),
      limit: options?.take,
      skip: options?.skip,
      order: '-sys.createdAt',
    });

    return {
      total,
      items: items.map(parsetNews),
    };
  }

  async fetchById(id: string) {
    try {
      const res = await this.contentfulClient.getEntries<News>({
        content_type: 'news',
        'fields.id': id,
      });

      return res.items[0] ? parsetNews(res.items[0]) : null;
    } catch (error) {
      if (error instanceof NotFoundError) {
        return null;
      }
      throw error;
    }
  }
}

export type FetchNewsProviderOptions = FetchPaginationOptions & {
  filter?: FetchNewsFilter & {
    title?: string;
  };
};

const parsetNews = (item: ContentfulRestNews): NewsDataObject => ({
  id: item.fields.id,
  title: item.fields.title,
  type: 'News',
  frequency: item.fields.frequency,
  shortText: item.fields.shortText,
  thumbnail: item.fields.thumbnail?.fields?.file?.url,
  link: item.fields.link,
  linkText: item.fields.linkText,
  text: item.fields.text ? parseRichText(item.fields.text) : undefined,
  created: item.sys.createdAt,
});
