import { gp2 } from '@asap-hub/model';
import { useSuspenseQuery } from '@tanstack/react-query';

import { useAuthorization } from '../../auth/useAuthorization';
import { getCalendars } from './api';

export const calendarQueryKeys = {
  all: ['calendars'] as const,
};

export const useCalendars = (): gp2.ListCalendarResponse => {
  const getAuthorization = useAuthorization();
  return useSuspenseQuery({
    queryKey: calendarQueryKeys.all,
    queryFn: async () => getCalendars(await getAuthorization()),
  }).data;
};
