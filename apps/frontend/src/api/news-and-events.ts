import {
  ListNewsAndEventsResponse,
  NewsOrEventResponse,
} from '@asap-hub/model';

import { useGetList } from './get-list';
import { useGetOne } from './get-one';

export const useNewsAndEvents = () =>
  useGetList<ListNewsAndEventsResponse>(`news-and-events`, {
    filters: new Set(),
    pageSize: null,
    currentPage: null,
    searchQuery: '',
  });

export const useNewsOrEvent = (id: string) =>
  useGetOne<NewsOrEventResponse>(`news-and-events/${id}`);
