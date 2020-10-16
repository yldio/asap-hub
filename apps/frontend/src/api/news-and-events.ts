import { ListNewsAndEventsResponse } from '@asap-hub/model';

import { useGetList } from './get-list';

export const useNewsAndEvents = () =>
  useGetList<ListNewsAndEventsResponse>(`news-and-events`);
