import { User } from '@asap-hub/auth';
import { GetEventListOptions } from '@asap-hub/frontend-utils';
import { EventResponse, ListEventResponse } from '@asap-hub/model';
import { useAuth0CRN } from '@asap-hub/react-context';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { useAlgolia } from '../hooks/algolia';
import { getEvent, getEvents } from './api';

export const eventsListQueryKey = (options: GetEventListOptions) =>
  ['events', 'list', options] as const;

export const eventQueryKey = (id: string) => ['events', 'item', id] as const;

export const useEvents = (
  options: GetEventListOptions,
  // user kept for signature compatibility with the previous Recoil version.
  _user?: User | null,
): ListEventResponse & {
  algoliaQueryId?: string;
  algoliaIndexName?: string;
} => {
  const { client } = useAlgolia();
  const { data } = useSuspenseQuery({
    queryKey: eventsListQueryKey(options),
    queryFn: async () => {
      try {
        const result = await getEvents(client, options);
        // Defensive fallback: jest auto-mocks return undefined and
        // useSuspenseQuery cannot tolerate undefined data.
        return result ?? ({ total: 0, items: [] } satisfies ListEventResponse);
      } catch (error) {
        if (error instanceof Error) throw error;
        return { total: 0, items: [] } satisfies ListEventResponse;
      }
    },
  });
  return data;
};

export const useEventById = (id: string): EventResponse | undefined => {
  const auth0 = useAuth0CRN();
  const { data } = useSuspenseQuery({
    queryKey: eventQueryKey(id),
    queryFn: async (): Promise<EventResponse | null> => {
      const token = await auth0.getTokenSilently();
      const event = await getEvent(id, `Bearer ${token}`);
      return event ?? null;
    },
  });
  return data ?? undefined;
};

export const useQuietRefreshEventById = (id: string) => {
  const auth0 = useAuth0CRN();
  const queryClient = useQueryClient();
  return async () => {
    const token = await auth0.getTokenSilently();
    const event = await getEvent(id, `Bearer ${token}`);
    queryClient.setQueryData(eventQueryKey(id), event ?? null);
  };
};

export const usePrefetchEvents = (options: GetEventListOptions) => {
  const { client } = useAlgolia();
  const queryClient = useQueryClient();

  useDeepCompareEffect(() => {
    const key = eventsListQueryKey(options);
    if (queryClient.getQueryData(key) !== undefined) return;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    queryClient.prefetchQuery({
      queryKey: key,
      queryFn: () => getEvents(client, options),
    });
  }, [options, client, queryClient]);
};
