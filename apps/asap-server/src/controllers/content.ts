import Boom from '@hapi/boom';
import { ContentResponse } from '@asap-hub/model';
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
    const res = await this.cms.content.fetchBySlug(contentType, slug);
    if (res.length === 0) {
      throw Boom.notFound();
    }

    return transform(res[0]);
  }
}
