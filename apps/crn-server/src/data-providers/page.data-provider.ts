import { ListPageDataObject } from '@asap-hub/model';
import { RestPage, SquidexRestClient } from '@asap-hub/squidex';
import { parsePage } from './transformers';
import { FetchPagesProviderOptions, PageDataProvider } from './types';

export class PageSquidexDataProvider implements PageDataProvider {
  constructor(
    private readonly pageSquidexRestClient: SquidexRestClient<RestPage>,
  ) {}

  async fetchById(): Promise<null> {
    throw new Error('Method not implemented.');
  }

  async fetch(
    options?: FetchPagesProviderOptions,
  ): Promise<ListPageDataObject> {
    const { total, items } = await this.pageSquidexRestClient.fetch({
      ...(options?.filter?.path
        ? {
            filter: {
              path: 'data.path.iv',
              op: 'eq',
              value: options?.filter?.path,
            },
          }
        : undefined),
    });

    return {
      total,
      items: items.map(parsePage),
    };
  }
}
