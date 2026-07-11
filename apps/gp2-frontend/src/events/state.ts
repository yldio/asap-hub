import {
  getEventListOptions,
  normalizeListOptions,
} from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';
import { useMemo, useRef } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

import { useAuthorization } from '../auth/useAuthorization';
import { useAlgolia } from '../hooks/algolia';
import { usePaginationParams } from '../hooks/pagination';
import { EventListOptions, getEvent, getEvents } from './api';

const MINUTE_MS = 60000;

export const eventQueryKeys = {
  all: ['events'] as const,
  lists: () => [...eventQueryKeys.all, 'list'] as const,
  list: (options: EventListOptions) =>
    [...eventQueryKeys.lists(), normalizeListOptions(options)] as const,
  details: () => [...eventQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventQueryKeys.details(), id] as const,
};

export const useEvents = (options: EventListOptions): gp2.ListEventResponse => {
  const { client } = useAlgolia();
  return useSuspenseQuery({
    queryKey: eventQueryKeys.list(options),
    queryFn: async (): Promise<gp2.ListEventResponse> => {
      try {
        const data = await getEvents(client, options);
        return {
          total: data.nbHits ?? 0,
          items: data.hits,
          algoliaQueryId: data.queryID,
          algoliaIndexName: data.index,
        };
      } catch (error) {
        // Preserved from the recoil hook's `.catch(setEvents)`: an Error
        // rejection was cached and re-thrown to the error boundary, while a
        // non-Error rejection was swallowed. Map non-Errors to an empty list.
        if (error instanceof Error) {
          throw error;
        }
        return { total: 0, items: [] };
      }
    },
  }).data;
};

export const useEventById = (id: string): gp2.EventResponse | undefined => {
  const getAuthorization = useAuthorization();
  const { data } = useSuspenseQuery({
    queryKey: eventQueryKeys.detail(id),
    // getEvent resolves undefined on a 404, but a queryFn must not return
    // undefined — cache null and map it back below.
    queryFn: async () => (await getEvent(id, await getAuthorization())) ?? null,
  });
  return data ?? undefined;
};

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
