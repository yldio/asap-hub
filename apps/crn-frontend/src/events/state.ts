import { User } from '@asap-hub/auth';
import {
  createQueryKeys,
  GetEventListOptions,
  nullOnUndefined,
  withEmptyListFallback,
} from '@asap-hub/frontend-utils';
import { EventResponse, ListEventResponse } from '@asap-hub/model';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { useAuthorization } from '../auth/useAuthorization';
import { useAlgolia } from '../hooks/algolia';
import { getEvent, getEvents } from './api';

export const eventQueryKeys = createQueryKeys<GetEventListOptions>('events');

export const useEventById = (id: string): EventResponse | undefined => {
  const getAuthorization = useAuthorization();
  const { data } = useSuspenseQuery({
    queryKey: eventQueryKeys.detail(id),
    queryFn: () =>
      nullOnUndefined(async () => getEvent(id, await getAuthorization())),
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
    // Infinity).
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    queryClient.prefetchQuery({
      queryKey: eventQueryKeys.list(options),
      queryFn: () => getEvents(client, options),
    });
  }, [options, client, queryClient]);
};

export const useEvents = (
  options: GetEventListOptions,
  // Kept for signature compatibility; never used.
  _user?: User | null,
): ListEventResponse => {
  const { client } = useAlgolia();
  return useSuspenseQuery({
    queryKey: eventQueryKeys.list(options),
    queryFn: (): Promise<ListEventResponse> =>
      withEmptyListFallback(() => getEvents(client, options), {
        total: 0,
        items: [],
      }),
  }).data;
};
