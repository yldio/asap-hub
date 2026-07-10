import { gp2 } from '@asap-hub/model';
import { normalizeListOptions } from '@asap-hub/frontend-utils';
import { useSuspenseQuery } from '@tanstack/react-query';

import { getAlgoliaNews, NewsListOptions } from './api';
import { useAlgolia } from '../hooks/algolia';

export const newsQueryKeys = {
  all: ['news'] as const,
  lists: () => [...newsQueryKeys.all, 'list'] as const,
  list: (options: NewsListOptions) =>
    [...newsQueryKeys.lists(), normalizeListOptions(options)] as const,
};

export const useNews = (options: NewsListOptions) => {
  const { client } = useAlgolia();
  return useSuspenseQuery({
    queryKey: newsQueryKeys.list(options),
    queryFn: async (): Promise<gp2.ListNewsResponse> => {
      try {
        const data = await getAlgoliaNews(client, options);
        return {
          total: data.nbHits ?? 0,
          items: data.hits,
          algoliaQueryId: data.queryID,
          algoliaIndexName: data.index,
        };
      } catch (error) {
        // Preserved from the recoil hook's `.catch(setNews)`: an Error
        // rejection was cached and re-thrown to the error boundary, while a
        // non-Error rejection was swallowed (stored, so the page kept
        // rendering). Map non-Errors to an empty list.
        if (error instanceof Error) {
          throw error;
        }
        return { total: 0, items: [] };
      }
    },
  }).data;
};
