import { GenericError, NotFoundError } from '@asap-hub/errors';
import { PageResponse } from '@asap-hub/model';
import { PageDataProvider } from '../data-providers/types';

export default class PageController {
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
