import { useRecoilValue, atom, selector } from 'recoil';
import { ListCalendarResponse } from '@asap-hub/model';

import { authorizationState } from '@asap-hub/frontend/src/auth/state';
import { getCalendars } from './api';

export const refreshCalendarsState = atom({
  key: 'refreshCalendars',
  default: 0,
});

const calendarsState = selector<ListCalendarResponse>({
  key: 'calendars',
  get: async ({ get }) => {
    get(refreshCalendarsState);
    const authorization = get(authorizationState);
    return getCalendars(authorization);
  },
});

export const useCalendars = () => useRecoilValue(calendarsState);
