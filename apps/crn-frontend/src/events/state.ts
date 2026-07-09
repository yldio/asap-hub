import { User } from '@asap-hub/auth';
import {
  GetEventListOptions,
  normalizeListOptions,
} from '@asap-hub/frontend-utils';
import { EventResponse, ListEventResponse } from '@asap-hub/model';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { useAuthorization } from '../auth/useAuthorization';
import { useAlgolia } from '../hooks/algolia';
import { getEvent, getEvents } from './api';

export const eventQueryKeys = {
  all: ['events'] as const,
  lists: () => [...eventQueryKeys.all, 'list'] as const,
  list: (options: GetEventListOptions) =>
    [...eventQueryKeys.lists(), normalizeListOptions(options)] as const,
  details: () => [...eventQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventQueryKeys.details(), id] as const,
};

export const useEventById = (id: string): EventResponse | undefined => {
  const getAuthorization = useAuthorization();
  const { data } = useSuspenseQuery({
    queryKey: eventQueryKeys.detail(id),
    // getEvent resolves undefined on a 404, but a queryFn must not return
    // undefined — cache null and map it back below.
    queryFn: async () => (await getEvent(id, await getAuthorization())) ?? null,
  });
  return data ?? undefined;
};

export const useQuietRefreshEventById = (id: string) => {
  const getAuthorization = useAuthorization();
  const queryClient = useQueryClient();
  return async () => {
    const event = await getEvent(id, await getAuthorization());
    queryClient.setQueryData(eventQueryKeys.detail(id), event ?? null);
  };
};

export const usePrefetchEvents = (options: GetEventListOptions) => {
  const { client } = useAlgolia();
  const queryClient = useQueryClient();

  useDeepCompareEffect(() => {
    // prefetchQuery is a no-op when the key is already cached (staleTime
    // Infinity), mirroring the recoil effect's `if (events === undefined)`.
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    queryClient.prefetchQuery({
      queryKey: eventQueryKeys.list(options),
      queryFn: () => getEvents(client, options),
    });
  }, [options, client, queryClient]);
};

export const useEvents = (
  options: GetEventListOptions,
  // Kept for signature compatibility with the recoil hook; it was never used.
  _user?: User | null,
): ListEventResponse => {
  const { client } = useAlgolia();
  return useSuspenseQuery({
    queryKey: eventQueryKeys.list(options),
    queryFn: async (): Promise<ListEventResponse> => {
      try {
        return await getEvents(client, options);
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
