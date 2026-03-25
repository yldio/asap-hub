import { useQuery } from '@tanstack/react-query';
import { getPageByPath } from './api';

export const usePageByPageId = (pageId: string) =>
  useQuery({
    queryKey: ['page', pageId],
    queryFn: async () => (await getPageByPath(pageId)) ?? null,
  });
