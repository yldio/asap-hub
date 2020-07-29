import Boom from '@hapi/boom';
import { Base, BaseOptions } from '@asap-hub/services-common';
import { CMSContent } from '../entities/content';

export default class ContentCMS extends Base {
  constructor(CMSConfig: BaseOptions) {
    super(CMSConfig);
  }

  async fetchBySlug(contentType: string, slug: string): Promise<CMSContent> {
    const { items } = await this.client
      .get(contentType, {
        searchParams: {
          q: JSON.stringify({
            filter: {
              path: 'data.slug.iv',
              op: 'eq',
              value: slug,
            },
          }),
        },
      })
      .json();

    if (items.length === 0) {
      throw Boom.notFound();
    }

    return items[0];
  }
}
