import useDeepCompareEffect from 'use-deep-compare-effect';
import {
  atomFamily,
  selectorFamily,
  useRecoilValue,
  useRecoilState,
  DefaultValue,
  useSetRecoilState,
} from 'recoil';
import { EventResponse, ListEventResponse } from '@asap-hub/model';

import { authorizationState } from '../auth/state';
import { getEvent, getEvents } from './api';
import { GetEventListOptions } from './options';

const eventIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  GetEventListOptions
>({
  key: 'eventIndex',
  default: undefined,
});
export const eventsState = selectorFamily<
  ListEventResponse | Error | undefined,
  GetEventListOptions
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
      const oldEvents = get(eventIndexState(options));
      if (!(oldEvents instanceof Error)) {
        oldEvents?.ids?.forEach((id) => reset(eventState(id)));
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
export const eventState = atomFamily<EventResponse | undefined, string>({
  key: 'event',
  default: fetchEventState,
});

export const useEventById = (id: string) => useRecoilValue(eventState(id));
export const useQuietRefreshEventById = (id: string) => {
  const authorization = useRecoilValue(authorizationState);
  const setEvent = useSetRecoilState(eventState(id));
  return async () => {
    setEvent(await getEvent(id, authorization));
  };
};

export const usePrefetchEvents = (options: GetEventListOptions) => {
  const authorization = useRecoilValue(authorizationState);
  const [events, setEvents] = useRecoilState(eventsState(options));
  useDeepCompareEffect(() => {
    if (events === undefined) {
      getEvents(options, authorization).then(setEvents).catch();
    }
  }, [authorization, events, options, setEvents]);
};
export const useEvents = (options: GetEventListOptions) => {
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
