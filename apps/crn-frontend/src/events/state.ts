import { User } from '@asap-hub/auth';
import { GetEventListOptions } from '@asap-hub/frontend-utils';
import { EventResponse, ListEventResponse } from '@asap-hub/model';
import {
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { authorizationState } from '../auth/state';
import { useAlgolia } from '../hooks/algolia';
import { getEvent, getEvents } from './api';

const eventIndexState = atomFamily<
  | {
      ids: ReadonlyArray<string>;
      total: number;
      algoliaQueryId?: string;
      algoliaIndexName?: string;
    }
  | Error
  | undefined,
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
  get:
    (options) =>
    ({ get }) => {
      const index = get(eventIndexState(options));
      if (index === undefined || index instanceof Error) return index;
      const events: EventResponse[] = [];
      for (const id of index.ids) {
        const event = get(eventState(id));
        if (event === undefined) return undefined;
        events.push(event);
      }
      return {
        total: index.total,
        items: events,
        algoliaIndexName: index.algoliaIndexName,
        algoliaQueryId: index.algoliaQueryId,
      };
    },
  set:
    (options) =>
    ({ get, set, reset }, newEvents) => {
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
          algoliaIndexName: newEvents.algoliaIndexName,
          algoliaQueryId: newEvents.algoliaQueryId,
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
  get:
    (id) =>
    async ({ get }) => {
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
  const algoliaClient = useAlgolia();
  const [events, setEvents] = useRecoilState(eventsState(options));

  useDeepCompareEffect(() => {
    if (events === undefined) {
      getEvents(algoliaClient.client, options).then(setEvents).catch();
    }
  }, [authorization, events, options, setEvents]);
};

export const useEvents = (options: GetEventListOptions, user?: User | null) => {
  const [events, setEvents] = useRecoilState(eventsState(options));
  const { client } = useAlgolia();

  if (events === undefined) {
    throw getEvents(client, options).then(setEvents).catch(setEvents);
  }

  if (events instanceof Error) {
    throw events;
  }

  return events;
};
