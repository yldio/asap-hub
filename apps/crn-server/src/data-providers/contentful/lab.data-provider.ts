import {
  FetchOptions,
  LabDataObject,
  ListLabDataObject,
} from '@asap-hub/model';

import {
  FetchLabsQuery,
  FetchLabsQueryVariables,
  FETCH_LABS,
  GraphQLClient,
  LabsFilter,
} from '@asap-hub/contentful';

import { LabDataProvider } from '../types';

export type LabItem = NonNullable<
  NonNullable<FetchLabsQuery['labsCollection']>['items'][number]
>;

export class LabContentfulDataProvider implements LabDataProvider {
  constructor(private contentfulClient: GraphQLClient) {}

  async fetchById(): Promise<LabDataObject | null> {
    throw new Error('Method not implemented.');
  }

  async fetch(options: FetchOptions<string[]>): Promise<ListLabDataObject> {
    const { take = 8, skip = 0, search } = options;

    const searchTerms = (search || '').split(' ').filter(Boolean);
    const searchQuery: LabsFilter = searchTerms.length
      ? {
          AND: searchTerms.map((term) => ({
            name_contains: term,
          })),
        }
      : {};

    const { labsCollection } = await this.contentfulClient.request<
      FetchLabsQuery,
      FetchLabsQueryVariables
    >(FETCH_LABS, {
      limit: take || null,
      skip: skip || null,
      where: searchQuery,
    });

    if (!labsCollection?.items) {
      return {
        total: 0,
        items: [],
      };
    }

    return {
      total: labsCollection?.total,
      items: labsCollection?.items
        .filter((x): x is LabItem => x !== null)
        .map(parseContentfulGraphQlLabs),
    };
  }
}

export const parseContentfulGraphQlLabs = (item: LabItem): LabDataObject => ({
  id: item.sys.id ?? '',
  name: item.name ?? '',
});
