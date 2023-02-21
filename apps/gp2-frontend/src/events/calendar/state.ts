import { useRecoilValue, atom, selector } from 'recoil';
import { gp2 } from '@asap-hub/model';

import { getCalendars } from './api';
import { authorizationState } from '../../auth/state';

export const refreshCalendarsState = atom({
  key: 'refreshCalendars',
  default: 0,
});

export const calendarsState = selector<gp2.ListCalendarResponse>({
  key: 'calendars',
  get: async ({ get }) => {
    get(refreshCalendarsState);
    const authorization = get(authorizationState);
    return getCalendars(authorization);
  },
});

export const useCalendars = () => useRecoilValue(calendarsState);
