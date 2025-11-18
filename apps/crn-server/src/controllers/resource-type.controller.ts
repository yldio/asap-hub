import {
  FetchResourceTypesOptions,
  ListResourceTypeResponse,
} from '@asap-hub/model';
import { ResourceTypeDataProvider } from '../data-providers/types';

export default class ResourceTypeController {
  constructor(private resourceTypeDataProvider: ResourceTypeDataProvider) {}

  async fetch(
    options: FetchResourceTypesOptions = {},
  ): Promise<ListResourceTypeResponse> {
    const { take = 100, skip = 0 } = options;

    return this.resourceTypeDataProvider.fetch({
      take,
      skip,
    });
  }
}
