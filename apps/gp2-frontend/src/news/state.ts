import { gp2 } from '@asap-hub/model';
import {
  createListQueryKeys,
  withEmptyListFallback,
} from '@asap-hub/frontend-utils';
import { useSuspenseQuery } from '@tanstack/react-query';

import { getAlgoliaNews, NewsListOptions } from './api';
import { useAlgolia } from '../hooks/algolia';

export const newsQueryKeys = createListQueryKeys<NewsListOptions>('news');

export const useNews = (options: NewsListOptions) => {
  const { client } = useAlgolia();
  return useSuspenseQuery({
    queryKey: newsQueryKeys.list(options),
    queryFn: (): Promise<gp2.ListNewsResponse> =>
      withEmptyListFallback<gp2.ListNewsResponse>(
        async () => {
          const data = await getAlgoliaNews(client, options);
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
