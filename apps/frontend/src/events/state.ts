import { useRecoilValue, atom, selector } from 'recoil';
import { ListCalendarResponse } from '@asap-hub/model';

import { authorizationState } from '../auth/state';
import { getCalendars } from './api';

export const refreshCalendarState = atom({
  key: 'refreshCalendars',
  default: 0,
});

const calendarState = selector<ListCalendarResponse>({
  key: 'calendars',
  get: async ({ get }) => {
    get(refreshCalendarState);
    const authorization = get(authorizationState);
    return getCalendars(authorization);
  },
});

export const useCalendars = () => useRecoilValue(calendarState);
