import {
  atomFamily,
  selectorFamily,
  useRecoilValue,
  useRecoilState,
  DefaultValue,
} from 'recoil';
import { EventResponse, ListEventResponse } from '@asap-hub/model';

import { authorizationState } from '../auth/state';
import { getEvent, getEvents, BeforeOrAfter } from './api';
import { GetListOptions } from '../api-util';

const eventIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  GetListOptions
>({
  key: 'eventIndex',
  default: undefined,
});
export const eventsState = selectorFamily<
  ListEventResponse | Error | undefined,
  GetListOptions
>({
  key: 'events',
  get: (options) => ({ get }) => {
    const index = get(eventIndexState(options));
    if (index === undefined || index instanceof Error) return index;
    const events: EventResponse[] = [];
    for (const id of index.ids) {
      const event = get(eventState(id));
      if (event === undefined) return undefined;
      events.push(event);
    }
    return { total: index.total, items: events };
  },
  set: (options) => ({ get, set, reset }, newEvents) => {
    if (newEvents === undefined || newEvents instanceof DefaultValue) {
      const oldGroups = get(eventIndexState(options));
      if (!(oldGroups instanceof Error)) {
        oldGroups?.ids?.forEach((id) => reset(eventState(id)));
      }
      reset(eventIndexState(options));
    } else if (newEvents instanceof Error) {
      set(eventIndexState(options), newEvents);
    } else {
      newEvents?.items.forEach((event) => set(eventState(event.id), event));
      set(eventIndexState(options), {
        total: newEvents.total,
        ids: newEvents.items.map((event) => event.id),
      });
    }
  },
});
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
export const useEvents = (options: GetListOptions & BeforeOrAfter) => {
  const authorization = useRecoilValue(authorizationState);
  const [events, setEvents] = useRecoilState(eventsState(options));
  if (events === undefined) {
    throw getEvents(options, authorization).then(setEvents).catch(setEvents);
  }
  if (events instanceof Error) {
    throw events;
  }
  return events;
};
