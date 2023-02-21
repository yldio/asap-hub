import { GetEventListOptions } from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';
import { atom, atomFamily, selectorFamily, useRecoilValue } from 'recoil';
import { authorizationState } from '../auth/state';
import { getEvent, getEvents } from './api';

export const eventsState = selectorFamily<
  gp2.ListEventResponse,
  GetEventListOptions
>({
  key: 'eventsState',
  get:
    (options) =>
    ({ get }) => {
      get(refreshEventsState);
      return getEvents(get(authorizationState), options);
    },
});

export const refreshEventsState = atom<number>({
  key: 'refreshEventsState',
  default: 0,
});

export const refreshEventState = atomFamily<number, string>({
  key: 'refreshEvent',
  default: 0,
});

const fetchEventState = selectorFamily<gp2.EventResponse | undefined, string>({
  key: 'fetchEvent',
  get:
    (id) =>
    async ({ get }) => {
      get(refreshEventState(id));
      const authorization = get(authorizationState);
      return getEvent(id, authorization);
    },
});

const eventState = selectorFamily<gp2.EventResponse | undefined, string>({
  key: 'event',
  get:
    (id) =>
    ({ get }) =>
      get(fetchEventState(id)),
});

export const useEvents = (options: GetEventListOptions) =>
  useRecoilValue(eventsState(options));

export const useEventById = (id: string) => useRecoilValue(eventState(id));
