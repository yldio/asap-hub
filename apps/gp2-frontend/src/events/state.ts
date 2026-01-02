import {
  getEventListOptions,
  GetEventListOptions,
  GetListOptions,
} from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';
import { useMemo, useRef } from 'react';
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
import { EventListOptions, getEvent, getEvents } from './api';

// Promise cache to prevent throwing new promises on every render (Suspense requirement)
const pendingEventPromises = new Map<string, Promise<void>>();

const MINUTE_MS = 60000;

// Helper to create a stable key from options
const serializeOptions = (options: EventListOptions): string =>
  JSON.stringify({
    currentPage: options.currentPage,
    pageSize: options.pageSize,
    searchQuery: options.searchQuery,
    filters: options.filters ? Array.from(options.filters).sort() : [],
    before: options.before,
    after: options.after,
    constraint: options.constraint,
    eventType: options.eventType,
  });

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
      const index = get(eventIndexState({ ...options }));
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
  const [events, setEvents] = useRecoilState(eventsState(options));
  const { client } = useAlgolia();
  const optionsKey = serializeOptions(options);

  if (events === undefined) {
    let pendingPromise = pendingEventPromises.get(optionsKey);

    if (!pendingPromise) {
      pendingPromise = getEvents(client, options)
        .then(
          (data): gp2.ListEventResponse => ({
            total: data.nbHits,
            items: data.hits,
            algoliaQueryId: data.queryID,
            algoliaIndexName: data.index,
          }),
        )
        .then(setEvents)
        .catch(setEvents)
        .finally(() => {
          pendingEventPromises.delete(optionsKey);
        });

      pendingEventPromises.set(optionsKey, pendingPromise);
    }

    throw pendingPromise;
  }

  if (events instanceof Error) {
    throw events;
  }

  return events;
};

export const useEventById = (id: string) => useRecoilValue(eventState(id));

export const useUpcomingAndPastEvents = (
  currentTime: Date,
  constraint: gp2.EventConstraint,
) => {
  const { pageSize } = usePaginationParams();

  // Capture timestamp on first render only - useRef persists across renders without causing re-renders
  const stableTimestampRef = useRef<number | null>(null);
  if (stableTimestampRef.current === null) {
    // Round to nearest minute to prevent minor timing differences
    stableTimestampRef.current =
      Math.floor(currentTime.getTime() / MINUTE_MS) * MINUTE_MS;
  }
  const stableTimestamp = stableTimestampRef.current;

  // Serialize constraint for stable dependency comparison
  const constraintKey = JSON.stringify(constraint);

  // Memoize constraint to ensure stable object reference
  const stableConstraint = useMemo(
    () => constraint,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [constraintKey],
  );

  const upcomingOptions = useMemo(
    () =>
      getEventListOptions(new Date(stableTimestamp), {
        past: false,
        pageSize,
        constraint: stableConstraint,
      }),
    [stableTimestamp, pageSize, stableConstraint],
  );

  const pastOptions = useMemo(
    () =>
      getEventListOptions(new Date(stableTimestamp), {
        past: true,
        pageSize,
        constraint: stableConstraint,
      }),
    [stableTimestamp, pageSize, stableConstraint],
  );

  const upcomingEventsResult = useEvents(upcomingOptions);
  const pastEventsResult = useEvents(pastOptions);

  return [upcomingEventsResult, pastEventsResult];
};
