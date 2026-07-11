import { gp2 } from '@asap-hub/model';
import { normalizeListOptions } from '@asap-hub/frontend-utils';
import { useSuspenseQuery } from '@tanstack/react-query';

import { getTagSearchResults, TagSearchOptions } from './api';
import { useAlgolia } from '../hooks/algolia';

// Distinct root from shared/state.ts's `tagsQueryKeys` (['tags']) — this is
// the tag *search* namespace and must not collide with the shared tags cache.
export const tagSearchQueryKeys = {
  all: ['tag-search'] as const,
  lists: () => [...tagSearchQueryKeys.all, 'list'] as const,
  list: (options: TagSearchOptions) =>
    [...tagSearchQueryKeys.lists(), normalizeListOptions(options)] as const,
};

export const useTagSearchResults = (options: TagSearchOptions) => {
  const { client } = useAlgolia();
  return useSuspenseQuery({
    queryKey: tagSearchQueryKeys.list(options),
    queryFn: async (): Promise<gp2.ListEntityResponse> => {
      try {
        const data = await getTagSearchResults(client, options);
        return {
          total: data.nbHits ?? 0,
          items: data.hits,
          algoliaQueryId: data.queryID,
          algoliaIndexName: data.index,
        };
      } catch (error) {
        // Errors re-throw to the error boundary; non-Error rejections
        // become an empty list so the page keeps rendering.
        if (error instanceof Error) {
          throw error;
        }
        return { total: 0, items: [] };
      }
    },
  }).data;
};
