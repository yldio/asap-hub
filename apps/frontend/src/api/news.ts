import { ListNewsResponse, NewsResponse } from '@asap-hub/model';

import { useGetList } from './get-list';
import { useGetOne } from './get-one';
import { GetListOptions } from '../api-util';

export const useNews = (options: GetListOptions) =>
  useGetList<ListNewsResponse>(`news`, options);

export const useNewsById = (id: string) =>
  useGetOne<NewsResponse>(`news/${id}`);
