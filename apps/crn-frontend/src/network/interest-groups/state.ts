import { GetListOptions, normalizeListOptions } from '@asap-hub/frontend-utils';
import {
  InterestGroupResponse,
  ListInterestGroupResponse,
} from '@asap-hub/model';
import { useSuspenseQuery } from '@tanstack/react-query';

import { useAuthorization } from '../../auth/useAuthorization';
import { getInterestGroup, getInterestGroups } from './api';

// This module is the shared interest-group entity store: the teams and users
// interest-group modules write fetched entities into these keys.
export const interestGroupQueryKeys = {
  all: ['interest-groups'] as const,
  lists: () => [...interestGroupQueryKeys.all, 'list'] as const,
  list: (options: GetListOptions) =>
    [...interestGroupQueryKeys.lists(), normalizeListOptions(options)] as const,
  details: () => [...interestGroupQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...interestGroupQueryKeys.details(), id] as const,
};

export const useInterestGroups = (
  options: GetListOptions,
): ListInterestGroupResponse => {
  const getAuthorization = useAuthorization();
  return useSuspenseQuery({
    queryKey: interestGroupQueryKeys.list(options),
    queryFn: async (): Promise<ListInterestGroupResponse> => {
      try {
        return await getInterestGroups(options, await getAuthorization());
      } catch (error) {
        // Errors re-throw to the error boundary; non-Error rejections
        // become an empty list.
        if (error instanceof Error) {
          throw error;
        }
        return { total: 0, items: [] };
      }
    },
  }).data;
};

export const useInterestGroupById = (
  id: string,
): InterestGroupResponse | undefined => {
  const getAuthorization = useAuthorization();
  const { data } = useSuspenseQuery({
    queryKey: interestGroupQueryKeys.detail(id),
    // getInterestGroup resolves undefined on a 404, but a queryFn must not
    // return undefined — cache null and map it back below.
    queryFn: async () =>
      (await getInterestGroup(id, await getAuthorization())) ?? null,
  });
  return data ?? undefined;
};
