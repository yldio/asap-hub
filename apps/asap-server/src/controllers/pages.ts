import { RestPage, SquidexRest, SquidexRestClient } from '@asap-hub/squidex';
import { PageResponse } from '@asap-hub/model';

import { parsePage } from '../entities';

export default class Pages implements PageController {
  pageSquidexRestClient: SquidexRestClient<RestPage>;

  constructor() {
    this.pageSquidexRestClient = new SquidexRest('pages');
  }

  async fetchByPath(path: string): Promise<PageResponse> {
    const page = await this.pageSquidexRestClient.fetchOne({
      filter: { path: 'data.path.iv', op: 'eq', value: path },
    });

    return parsePage(page);
  }
}

export interface PageController {
  fetchByPath: (path: string) => Promise<PageResponse>;
}
