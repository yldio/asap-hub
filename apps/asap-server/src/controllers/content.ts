import { ContentResponse } from '@asap-hub/model';
import { Squidex } from '@asap-hub/services-common';
import { CMSContent } from '../entities/content';

function transform(content: CMSContent): ContentResponse {
  return {
    slug: content.data?.slug?.iv,
    title: content.data?.title?.iv,
    content: content.data?.content?.iv,
  } as ContentResponse;
}

export async function fetchBySlug(
  contentType: string,
  slug: string,
): Promise<ContentResponse> {
  const content: Squidex<CMSContent> = new Squidex(contentType);
  const res = await content.fetchOne({
    filter: {
      path: 'data.slug.iv',
      op: 'eq',
      value: slug,
    },
  });

  return transform(res);
}
