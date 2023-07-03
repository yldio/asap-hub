import { FetchOptions, ListLabsResponse } from '@asap-hub/model';
import { LabDataProvider } from '../data-providers/lab.data-provider';

export default class LabController {
  constructor(private labDataProvider: LabDataProvider) {}

  async fetch(options: FetchOptions): Promise<ListLabsResponse> {
    const { take = 8, skip = 0, search } = options;

    return this.labDataProvider.fetch({
      take,
      skip,
      search,
    });
  }
}
