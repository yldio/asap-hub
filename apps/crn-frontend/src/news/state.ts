import { GetListOptions } from '@asap-hub/frontend-utils';
import { useAuth0CRN } from '@asap-hub/react-context';
import { useQuery } from '@tanstack/react-query';
import { getNews, getNewsById } from './api';

export const useNews = (options: GetListOptions) => {
  const auth0 = useAuth0CRN();
  return useQuery({
    queryKey: ['news', options],
    queryFn: async () => {
      const token = await auth0.getTokenSilently();
      return getNews(options, `Bearer ${token}`);
    },
  });
};

export const useNewsById = (id: string) => {
  const auth0 = useAuth0CRN();
  return useQuery({
    queryKey: ['news', id],
    queryFn: async () => {
      const token = await auth0.getTokenSilently();
      const result = await getNewsById(id, `Bearer ${token}`);
      // TanStack Query v5 forbids returning undefined from a queryFn
      return result ?? null;
    },
  });
};
