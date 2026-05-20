import {
  CRNTagSearchEntities,
  EMPTY_ALGOLIA_RESPONSE,
} from '@asap-hub/algolia';
import { ListResponse, TagSearchResponse } from '@asap-hub/model';
import { useSuspenseQuery } from '@tanstack/react-query';

import { useAlgolia } from '../hooks/algolia';
import { getTagSearch, TagSearchListOptions } from './api';

export type TagSearchResult = ListResponse<TagSearchResponse> & {
  algoliaQueryId?: string;
  algoliaIndexName?: string;
};

export const useTagSearch = <ResponsesKey extends CRNTagSearchEntities>(
  entityTypes: ResponsesKey[],
  options: TagSearchListOptions,
): TagSearchResult => {
  const { client } = useAlgolia();
  const skip = options.searchQuery === '' && options.tags.length === 0;

  const { data } = useSuspenseQuery({
    queryKey: ['tagSearch', { ...options, entityTypes }] as const,
    queryFn: async (): Promise<TagSearchResult> => {
      if (skip) return EMPTY_ALGOLIA_RESPONSE;
      try {
        const result = await getTagSearch(client, entityTypes, options);
        return {
          total: result.nbHits,
          items: result.hits,
          algoliaQueryId: result.queryID,
          algoliaIndexName: result.index,
        };
      } catch (error) {
        if (error instanceof Error) throw error;
        return EMPTY_ALGOLIA_RESPONSE;
      }
    },
  });

  return data;
};
