import { useRecoilValue, selector } from 'recoil';
import { gp2 } from '@asap-hub/model';

import { getCalendars } from './api';
import { authorizationState } from '../../auth/state';

export const calendarsState = selector<gp2.ListCalendarResponse>({
  key: 'calendars',
  get: async ({ get }) => {
    const authorization = get(authorizationState);
    return getCalendars(authorization);
  },
});

export const useCalendars = () => useRecoilValue(calendarsState);
