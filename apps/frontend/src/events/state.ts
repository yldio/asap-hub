import { atomFamily, selectorFamily, useRecoilValue } from 'recoil';
import { EventResponse } from '@asap-hub/model';

import { authorizationState } from '../auth/state';
import { getEvent } from './api';

export const refreshEventState = atomFamily<number, string>({
  key: 'refreshEvent',
  default: 0,
});
const fetchEventState = selectorFamily<EventResponse | undefined, string>({
  key: 'fetchEvent',
  get: (id) => async ({ get }) => {
    get(refreshEventState(id));
    const authorization = get(authorizationState);
    return getEvent(id, authorization);
  },
});
const eventState = atomFamily<EventResponse | undefined, string>({
  key: 'event',
  default: fetchEventState,
});

export const useEventById = (id: string) => useRecoilValue(eventState(id));
