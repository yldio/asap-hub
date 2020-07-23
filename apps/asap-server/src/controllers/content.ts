import Boom from '@hapi/boom';
import { CMS } from '../cms';
import { CMSContent } from '../entities/content';

interface ReplyContent {
  slug: string;
}
function transform(content: CMSContent): ReplyContent {
  return {
    slug: content.data.slug && content.data.slug.iv,
  } as ReplyContent;
}

export default class ContentController {
  cms: CMS;

  constructor() {
    this.cms = new CMS();
  }

  async fetchBySlug(
    contentType: string,
    slug: string,
  ): Promise<ReplyContent[]> {
    const content = await this.cms.content.fetchBySlug(contentType, slug);
    if (!content.length) throw Boom.notFound();
    return content.map(transform);
  }
}
