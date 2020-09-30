import Boom from '@hapi/boom';
import { ContentResponse } from '@asap-hub/model';
import { Squidex } from '@asap-hub/services-common';
import { CMS } from '../cms';
import { CMSContent } from '../entities/content';

function transform(content: CMSContent): ContentResponse {
  return {
    slug: content.data?.slug?.iv,
    title: content.data?.title?.iv,
    content: content.data?.content?.iv,
  } as ContentResponse;
}

export default class ContentController {
  cms: CMS;

  constructor() {
    this.cms = new CMS();
  }

  async fetchBySlug(
    contentType: string,
    slug: string,
  ): Promise<ContentResponse> {
    const content: Squidex<CMSContent> = new Squidex(contentType);
    const { items } = await content.fetch({
      filter: {
        path: 'data.slug.iv',
        op: 'eq',
        value: slug,
      },
    });

    if (items.length === 0) {
      throw Boom.notFound();
    }

    return transform(items[0]);
  }
}
