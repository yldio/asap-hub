import { RestPage } from '@asap-hub/squidex';
import { PageResponse } from '@asap-hub/model';

import { InstrumentedSquidex } from '../utils/instrumented-client';
import { parsePage } from '../entities';

export default class Pages implements PageController {
  pages: InstrumentedSquidex<RestPage>;

  constructor(ctxHeaders?: Record<string, string>) {
    this.pages = new InstrumentedSquidex('pages', ctxHeaders);
  }

  async fetchByPath(path: string): Promise<PageResponse> {
    const page = await this.pages.fetchOne({
      filter: { path: 'data.path.iv', op: 'eq', value: path },
    });

    return parsePage(page);
  }
}

export interface PageController {
  fetchByPath: (path: string) => Promise<PageResponse>;
}
