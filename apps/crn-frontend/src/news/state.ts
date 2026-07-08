import { GetListOptions, normalizeListOptions } from '@asap-hub/frontend-utils';
import { NewsResponse } from '@asap-hub/model';
import { useSuspenseQuery } from '@tanstack/react-query';

import { useAuthorization } from '../auth/useAuthorization';
import { getNews, getNewsById } from './api';

export const newsQueryKeys = {
  all: ['news'] as const,
  lists: () => [...newsQueryKeys.all, 'list'] as const,
  list: (options: GetListOptions) =>
    [...newsQueryKeys.lists(), normalizeListOptions(options)] as const,
  details: () => [...newsQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...newsQueryKeys.details(), id] as const,
};

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
    // getNewsById resolves `undefined` on 404, but a queryFn must not return
    // undefined — cache `null` and map it back for the consumer.
    queryFn: async () =>
      (await getNewsById(id, await getAuthorization())) ?? null,
  });
  return data ?? undefined;
};
