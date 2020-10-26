import { Squidex } from '@asap-hub/squidex';
import { PageResponse } from '@asap-hub/model';
import { CMSPage, parsePage } from '../entities';

export default class Pages {
  pages: Squidex<CMSPage>;

  constructor() {
    this.pages = new Squidex('pages');
  }

  async fetchByPath(path: string): Promise<PageResponse> {
    const page = await this.pages.fetchOne({
      filter: { path: 'data.path.iv', op: 'eq', value: path },
    });

    return parsePage(page);
  }
}
