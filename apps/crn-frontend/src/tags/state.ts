import {
  CRNTagSearchEntities,
  EMPTY_ALGOLIA_RESPONSE,
} from '@asap-hub/algolia';
import {
  normalizeListOptions,
  withEmptyListFallback,
} from '@asap-hub/frontend-utils';
import { ListResponse, TagSearchResponse } from '@asap-hub/model';
import { useSuspenseQuery } from '@tanstack/react-query';

import { useAlgolia } from '../hooks/algolia';
import { getTagSearch, TagSearchListOptions } from './api';

export type TagSearchResult = ListResponse<TagSearchResponse> & {
  readonly algoliaQueryId?: string;
  readonly algoliaIndexName?: string;
};

export const tagQueryKeys = {
  all: ['tags'] as const,
  searches: () => [...tagQueryKeys.all, 'search'] as const,
  search: (
    options: TagSearchListOptions & { entityTypes: CRNTagSearchEntities[] },
  ) => [...tagQueryKeys.searches(), normalizeListOptions(options)] as const,
};

export const useTagSearch = <ResponsesKey extends CRNTagSearchEntities>(
  entityTypes: ResponsesKey[],
  options: TagSearchListOptions,
): TagSearchResult => {
  const { client } = useAlgolia();
  return useSuspenseQuery({
    queryKey: tagQueryKeys.search({ ...options, entityTypes }),
    queryFn: async (): Promise<TagSearchResult> => {
      // an empty search never hits Algolia
      if (options.searchQuery === '' && options.tags.length === 0) {
        return EMPTY_ALGOLIA_RESPONSE;
      }
      return withEmptyListFallback(async () => {
        const data = await getTagSearch(client, entityTypes, options);
        return {
          total: data.nbHits ?? 0,
          items: data.hits,
          algoliaQueryId: data.queryID,
          algoliaIndexName: data.index,
        };
      }, EMPTY_ALGOLIA_RESPONSE);
    },
  }).data;
};
