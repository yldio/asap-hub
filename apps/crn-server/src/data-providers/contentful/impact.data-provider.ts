import {
  GraphQLClient,
  ImpactFilter,
  FetchImpactsQuery,
  FetchImpactsQueryVariables,
  FETCH_IMPACTS,
} from '@asap-hub/contentful';
import {
  FetchOptions,
  ImpactDataObject,
  ListImpactDataObject,
} from '@asap-hub/model';

import { ImpactDataProvider } from '../types';

export type ImpactItem = NonNullable<
  NonNullable<FetchImpactsQuery['impactCollection']>['items'][number]
>;

export class ImpactContentfulDataProvider implements ImpactDataProvider {
  constructor(private contentfulClient: GraphQLClient) {}

  async fetchById(): Promise<ImpactDataObject | null> {
    throw new Error('Method not implemented.');
  }

  async fetch(options: FetchOptions<string[]>): Promise<ListImpactDataObject> {
    const { take = 10, skip = 0, search } = options;

    const searchTerms = (search || '').split(' ').filter(Boolean);
    const searchQuery: ImpactFilter = searchTerms.length
      ? {
          AND: searchTerms.map((term) => ({
            name_contains: term,
          })),
        }
      : {};

    const { impactCollection } = await this.contentfulClient.request<
      FetchImpactsQuery,
      FetchImpactsQueryVariables
    >(FETCH_IMPACTS, {
      limit: take || null,
      skip: skip || null,
      where: searchQuery,
    });

    if (!impactCollection?.items) {
      return {
        total: 0,
        items: [],
      };
    }

    return {
      total: impactCollection?.total,
      items: impactCollection?.items
        .filter((x): x is ImpactItem => x !== null)
        .map(parseContentfulGraphQlImpacts),
    };
  }
}

export const parseContentfulGraphQlImpacts = (
  item: ImpactItem,
): ImpactDataObject => ({
  id: item.sys.id ?? '',
  name: item.name ?? '',
});
