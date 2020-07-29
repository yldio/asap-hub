import { CMS } from '../cms';
import { CMSContent } from '../entities/content';

interface ReplyContent {
  slug: string;
  title: string;
  content: string;
}
function transform(content: CMSContent): ReplyContent {
  return {
    slug: content.data?.slug?.iv,
    title: content.data?.title?.iv,
    content: content.data?.content?.iv,
  } as ReplyContent;
}

export default class ContentController {
  cms: CMS;

  constructor() {
    this.cms = new CMS();
  }

  async fetchBySlug(contentType: string, slug: string): Promise<ReplyContent> {
    return transform(await this.cms.content.fetchBySlug(contentType, slug));
  }
}
