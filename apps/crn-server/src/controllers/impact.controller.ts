import { FetchOptions, ListImpactsResponse } from '@asap-hub/model';
import { ImpactDataProvider } from '../data-providers/types';

export default class ImpactController {
  constructor(private impactDataProvider: ImpactDataProvider) {}

  async fetch(options: FetchOptions): Promise<ListImpactsResponse> {
    const { take = 8, skip = 0, search } = options;

    return this.impactDataProvider.fetch({
      take,
      skip,
      search,
    });
  }
}
