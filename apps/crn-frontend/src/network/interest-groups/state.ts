import { GetListOptions } from '@asap-hub/frontend-utils';
import {
  InterestGroupResponse,
  ListInterestGroupResponse,
} from '@asap-hub/model';
import { useAuth0CRN } from '@asap-hub/react-context';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { CARD_VIEW_PAGE_SIZE } from '../../hooks';
import { getInterestGroup, getInterestGroups } from './api';

export const interestGroupsListQueryKey = (options: GetListOptions) =>
  ['interest-groups', 'list', options] as const;

export const interestGroupQueryKey = (id: string) =>
  ['interest-groups', 'item', id] as const;

export const useInterestGroups = (
  options: GetListOptions,
): ListInterestGroupResponse => {
  const auth0 = useAuth0CRN();
  const { data } = useSuspenseQuery({
    queryKey: interestGroupsListQueryKey(options),
    queryFn: async (): Promise<ListInterestGroupResponse> => {
      const token = await auth0.getTokenSilently();
      return getInterestGroups(options, `Bearer ${token}`);
    },
  });
  return data;
};

export const useInterestGroupById = (
  id: string,
): InterestGroupResponse | undefined => {
  const auth0 = useAuth0CRN();
  const { data } = useSuspenseQuery({
    queryKey: interestGroupQueryKey(id),
    queryFn: async (): Promise<InterestGroupResponse | null> => {
      const token = await auth0.getTokenSilently();
      const group = await getInterestGroup(id, `Bearer ${token}`);
      return group ?? null;
    },
  });
  return data ?? undefined;
};

export const usePrefetchInterestGroups = (
  options: GetListOptions = {
    filters: new Set(),
    searchQuery: '',
    pageSize: CARD_VIEW_PAGE_SIZE,
    currentPage: 0,
  },
) => {
  const auth0 = useAuth0CRN();
  const queryClient = useQueryClient();

  useDeepCompareEffect(() => {
    const key = interestGroupsListQueryKey(options);
    if (queryClient.getQueryData(key) !== undefined) return;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    queryClient.prefetchQuery({
      queryKey: key,
      queryFn: async () => {
        const token = await auth0.getTokenSilently();
        return getInterestGroups(options, `Bearer ${token}`);
      },
    });
  }, [options, auth0, queryClient]);
};
