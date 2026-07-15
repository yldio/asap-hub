import { gp2 } from '@asap-hub/model';
import { createListQueryKeys } from '@asap-hub/frontend-utils';
import { useSuspenseQuery } from '@tanstack/react-query';

import { getAlgoliaNews, NewsListOptions } from './api';
import { useAlgolia } from '../hooks/algolia';

export const newsQueryKeys = createListQueryKeys<NewsListOptions>('news');

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
