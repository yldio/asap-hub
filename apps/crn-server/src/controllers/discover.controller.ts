import { DiscoverResponse } from '@asap-hub/model';
import { DiscoverDataProvider } from '../data-providers/types';

export default class DiscoverController {
  constructor(private discoverDataProvider: DiscoverDataProvider) {}

  async fetch(): Promise<DiscoverResponse> {
    return this.discoverDataProvider.fetch();
  }
}
