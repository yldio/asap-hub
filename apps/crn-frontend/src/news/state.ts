import {
  createQueryKeys,
  GetListOptions,
  nullOnUndefined,
} from '@asap-hub/frontend-utils';
import { NewsResponse } from '@asap-hub/model';
import { useSuspenseQuery } from '@tanstack/react-query';

import { useAuthorization } from '../auth/useAuthorization';
import { getNews, getNewsById } from './api';

export const newsQueryKeys = createQueryKeys<GetListOptions>('news');

export const useNews = (options: GetListOptions) => {
  const getAuthorization = useAuthorization();
  return useSuspenseQuery({
    queryKey: newsQueryKeys.list(options),
    queryFn: async () => getNews(options, await getAuthorization()),
  }).data;
};

export const useNewsById = (id: string): NewsResponse | undefined => {
  const getAuthorization = useAuthorization();
  const { data } = useSuspenseQuery({
    queryKey: newsQueryKeys.detail(id),
    queryFn: () =>
      nullOnUndefined(async () => getNewsById(id, await getAuthorization())),
  });
  return data ?? undefined;
};
