import {
  FETCH_PAGES,
  FetchPagesQuery,
  FetchPagesQueryVariables,
  GraphQLClient,
  parseRichText,
  RichTextFromQuery,
} from '@asap-hub/contentful';
import { ListPageDataObject, PageDataObject } from '@asap-hub/model';
import { FetchPagesProviderOptions, PageDataProvider } from '../types';

export class PageContentfulDataProvider implements PageDataProvider {
  constructor(private contentfulClient: GraphQLClient) {}

  async fetchById(): Promise<null> {
    throw new Error('Method not implemented.');
  }
  async fetch(
    options?: FetchPagesProviderOptions,
  ): Promise<ListPageDataObject> {
    const { pagesCollection } = await this.contentfulClient.request<
      FetchPagesQuery,
      FetchPagesQueryVariables
    >(FETCH_PAGES, {
      where: { path: options?.filter?.path || null },
    });

    if (!pagesCollection) {
      return {
        total: 0,
        items: [],
      };
    }

    return {
      total: pagesCollection?.total,
      items: pagesCollection?.items
        .filter((x): x is PageItem => x !== null)
        .map(parseContentfulGraphQlPages),
    };
  }
}

export type PageItem = NonNullable<
  NonNullable<FetchPagesQuery['pagesCollection']>['items'][number]
>;

export const parseContentfulGraphQlPages = (
  item: PageItem,
): PageDataObject => ({
  id: item.sys.id,
  title: item.title || '',
  path: item.path || '',
  shortText: item.shortText || '',
  link: item.link ?? undefined,
  linkText: item.linkText ?? undefined,
  text: item.text ? parseRichText(item?.text as RichTextFromQuery) : '',
});
