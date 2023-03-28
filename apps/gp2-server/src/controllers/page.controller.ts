import { PageResponse } from '@asap-hub/model';
import { GenericError, NotFoundError } from '@asap-hub/errors';

import { PageDataProvider } from '../data-providers/page.data-provider';

export default class Pages implements PageController {
  constructor(private pageDataProvider: PageDataProvider) {}

  async fetchByPath(path: string): Promise<PageResponse> {
    const result = await this.pageDataProvider.fetch({
      filter: { path },
    });

    if (!result.items[0]) {
      throw new NotFoundError(undefined, `Page with path ${path} not found`);
    }

    if (result.items.length > 1) {
      throw new GenericError(undefined, 'More than one page was returned');
    }

    return result.items[0];
  }
}

export interface PageController {
  fetchByPath: (path: string) => Promise<PageResponse>;
}
