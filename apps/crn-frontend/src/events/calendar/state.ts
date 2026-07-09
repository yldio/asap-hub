import { ListCalendarResponse } from '@asap-hub/model';
import {
  useQuery,
  UseQueryResult,
  useSuspenseQuery,
} from '@tanstack/react-query';

import { useAuthorization } from '../../auth/useAuthorization';
import { getCalendars } from './api';

export const calendarQueryKeys = {
  all: ['calendars'] as const,
};

// Non-suspending warm-up (was useRecoilValueLoadable(calendarsState) — R6):
// kicks the fetch off without suspending the caller; useCalendars below picks
// the cached result up from the same key.
export const usePrefetchCalendars =
  (): UseQueryResult<ListCalendarResponse> => {
    const getAuthorization = useAuthorization();
    return useQuery({
      queryKey: calendarQueryKeys.all,
      queryFn: async () => getCalendars(await getAuthorization()),
    });
  };

export const useCalendars = (): ListCalendarResponse => {
  const getAuthorization = useAuthorization();
  return useSuspenseQuery({
    queryKey: calendarQueryKeys.all,
    queryFn: async () => getCalendars(await getAuthorization()),
  }).data;
};
