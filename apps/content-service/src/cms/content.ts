import { Base, BaseOptions } from '@asap-hub/services-common';
import { Content } from '../entities/content';

export default class ContentCMS extends Base {
  constructor(CMSConfig: BaseOptions) {
    super(CMSConfig);
  }

  async fetchBySlug(contentType: string, slug: string): Promise<Content[]> {
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
    return items;
  }
}
