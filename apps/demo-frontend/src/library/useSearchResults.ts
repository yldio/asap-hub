import { useQueries } from '@tanstack/react-query';

import { useApi } from '../api/ApiProvider';
import type { Folder, Video } from '../api/types';
import { matchesQuery } from './state';

export type SearchResult = { readonly video: Video; readonly folderId: string };

export const useSearchResults = (
  folders: readonly Folder[],
  query: string,
): { results: SearchResult[]; isLoading: boolean } => {
  const api = useApi();
  const enabled = query.trim().length > 0;

  const queries = useQueries({
    queries: folders.map((folder) => ({
      queryKey: ['videos', folder.id],
      queryFn: () => api.listVideos(folder.id),
      enabled,
      staleTime: 30 * 1000,
    })),
  });

  if (!enabled) return { results: [], isLoading: false };

  const results = queries.flatMap((result, index) =>
    (result.data ?? [])
      .filter((video) => matchesQuery(video, query))
      .map((video) => ({ video, folderId: folders[index]?.id ?? '' })),
  );

  return { results, isLoading: queries.some(({ isLoading }) => isLoading) };
};
