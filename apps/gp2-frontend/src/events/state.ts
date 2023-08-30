import {
  getEventListOptions,
  GetEventListOptions,
  GetListOptions,
} from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';
import {
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { authorizationState } from '../auth/state';
import { useAlgolia } from '../hooks/algolia';
import { usePaginationParams } from '../hooks/pagination';
import { EventListOptions, getAlgoliaEvents, getEvent } from './api';

const eventIndexState = atomFamily<
  | {
      ids: ReadonlyArray<string>;
      total: number;
      algoliaQueryId?: string;
      algoliIndexName?: string;
    }
  | Error
  | undefined,
  GetListOptions
>({
  key: 'eventIndex',
  default: undefined,
});

export const eventsState = selectorFamily<
  gp2.ListEventResponse | Error | undefined,
  GetEventListOptions<gp2.EventConstraint>
>({
  key: 'eventsState',
  get:
    (options) =>
    ({ get }) => {
      const index = get(
        eventIndexState({
          ...options,
        }),
      );
      if (index === undefined || index instanceof Error) return index;
      const events: gp2.EventResponse[] = [];
      for (const id of index.ids) {
        const event = get(eventState(id));
        if (event === undefined) return undefined;
        events.push(event);
      }
      return {
        total: index.total,
        items: events,
        algoliaIndexName: index.algoliIndexName,
        algoliaQueryId: index.algoliaQueryId,
      };
    },
  set:
    (options) =>
    ({ get, set, reset }, events) => {
      const indexStateOptions = { ...options };
      if (events === undefined || events instanceof DefaultValue) {
        const oldEvents = get(eventIndexState(indexStateOptions));
        if (!(oldEvents instanceof Error)) {
          oldEvents?.ids.forEach((id) => reset(eventState(id)));
        }
        reset(eventIndexState(indexStateOptions));
      } else if (events instanceof Error) {
        set(eventIndexState(indexStateOptions), events);
      } else {
        events.items.forEach((event) => set(eventState(event.id), event));
        set(eventIndexState(indexStateOptions), {
          total: events.total,
          ids: events.items.map(({ id }) => id),
          algoliaQueryId: events.algoliaQueryId,
          algoliIndexName: events.algoliaIndexName,
        });
      }
    },
});

const fetchEventState = selectorFamily<gp2.EventResponse | undefined, string>({
  key: 'fetchEvent',
  get:
    (id) =>
    async ({ get }) => {
      const authorization = get(authorizationState);
      return getEvent(id, authorization);
    },
});

const eventState = atomFamily<gp2.EventResponse | undefined, string>({
  key: 'event',
  default: fetchEventState,
});

export const useEvents = (options: EventListOptions) => {
  console.log(options);
  const [events, setEvents] = useRecoilState(eventsState(options));
  const { client } = useAlgolia();
  if (events === undefined) {
    throw getAlgoliaEvents(client, options)
      .then(
        (data): gp2.ListEventResponse => ({
          total: data.nbHits,
          items: data.hits,
          algoliaQueryId: data.queryID,
          algoliaIndexName: data.index,
        }),
      )
      .then(setEvents)
      .catch(setEvents);
  }
  if (events instanceof Error) {
    throw events;
  }
  console.log(events);
  return events;
};

export const useEventById = (id: string) => useRecoilValue(eventState(id));

export const useUpcomingAndPastEvents = (
  currentTime: Date,
  constraint: gp2.EventConstraint,
) => {
  const { pageSize } = usePaginationParams();
  const upcomingEventsResult = useEvents(
    getEventListOptions(currentTime, {
      past: false,
      pageSize,
      constraint,
    }),
  );

  const pastEventsResult = useEvents(
    getEventListOptions(currentTime, {
      past: true,
      pageSize,
      constraint,
    }),
  );
  return [upcomingEventsResult, pastEventsResult];
};
