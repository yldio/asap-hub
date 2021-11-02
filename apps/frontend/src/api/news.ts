import { ListNewsResponse, NewsResponse } from '@asap-hub/model';

import { useGetList } from './get-list';
import { useGetOne } from './get-one';

export const useNews = () =>
  useGetList<ListNewsResponse>(`news`, {
    filters: new Set(),
    pageSize: null,
    currentPage: null,
    searchQuery: '',
  });

export const useNewsById = (id: string) =>
  useGetOne<NewsResponse>(`news/${id}`);
