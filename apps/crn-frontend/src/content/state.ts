import { nullOnUndefined } from '@asap-hub/frontend-utils';
import { useQuery } from '@tanstack/react-query';

import { getPageByPath } from './api';

export const pageQueryKeys = {
  all: ['pages'] as const,
  details: () => [...pageQueryKeys.all, 'detail'] as const,
  detail: (path: string) => [...pageQueryKeys.details(), path] as const,
};

// Non-suspending read: content/Content.tsx branches on the loading state
// manually.
export const usePageByPageId = (pageId: string) =>
  useQuery({
    queryKey: pageQueryKeys.detail(pageId),
    queryFn: () => nullOnUndefined(() => getPageByPath(pageId)),
  });
