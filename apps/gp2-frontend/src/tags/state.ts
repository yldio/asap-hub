import { gp2 } from '@asap-hub/model';
import {
  createListQueryKeys,
  withEmptyListFallback,
} from '@asap-hub/frontend-utils';
import { useSuspenseQuery } from '@tanstack/react-query';

import { getTagSearchResults, TagSearchOptions } from './api';
import { useAlgolia } from '../hooks/algolia';

// Distinct root from shared/state.ts's `tagsQueryKeys` (['tags']) — this is
// the tag *search* namespace and must not collide with the shared tags cache.
export const tagSearchQueryKeys =
  createListQueryKeys<TagSearchOptions>('tag-search');

export const useTagSearchResults = (options: TagSearchOptions) => {
  const { client } = useAlgolia();
  return useSuspenseQuery({
    queryKey: tagSearchQueryKeys.list(options),
    queryFn: (): Promise<gp2.ListEntityResponse> =>
      withEmptyListFallback<gp2.ListEntityResponse>(
        async () => {
          const data = await getTagSearchResults(client, options);
          return {
            total: data.nbHits ?? 0,
            items: data.hits,
            algoliaQueryId: data.queryID,
            algoliaIndexName: data.index,
          };
        },
        { total: 0, items: [] },
      ),
  }).data;
};
