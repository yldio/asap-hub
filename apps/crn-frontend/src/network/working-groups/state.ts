import { GetListOptions, normalizeListOptions } from '@asap-hub/frontend-utils';
import {
  WorkingGroupListResponse,
  WorkingGroupResponse,
} from '@asap-hub/model';
import { useSuspenseQuery } from '@tanstack/react-query';

import { useAuthorization } from '../../auth/useAuthorization';
import { useAlgolia } from '../../hooks/algolia';
import { getWorkingGroup, getWorkingGroups } from './api';

export const workingGroupQueryKeys = {
  all: ['working-groups'] as const,
  lists: () => [...workingGroupQueryKeys.all, 'list'] as const,
  list: (options: GetListOptions) =>
    [...workingGroupQueryKeys.lists(), normalizeListOptions(options)] as const,
  details: () => [...workingGroupQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...workingGroupQueryKeys.details(), id] as const,
};

export const useWorkingGroupById = (
  id: string,
): WorkingGroupResponse | undefined => {
  const getAuthorization = useAuthorization();
  const { data } = useSuspenseQuery({
    queryKey: workingGroupQueryKeys.detail(id),
    // getWorkingGroup resolves undefined on a 404, but a queryFn must not
    // return undefined — cache null and map it back below.
    queryFn: async () =>
      (await getWorkingGroup(id, await getAuthorization())) ?? null,
  });
  return data ?? undefined;
};

export const useWorkingGroups = (
  options: GetListOptions,
): WorkingGroupListResponse => {
  const algoliaClient = useAlgolia();
  return useSuspenseQuery({
    queryKey: workingGroupQueryKeys.list(options),
    queryFn: async (): Promise<WorkingGroupListResponse> => {
      try {
        return await getWorkingGroups(algoliaClient.client, options);
      } catch (error) {
        // Preserved from the recoil hook's `.catch(setWorkingGroups)`: an
        // Error rejection was cached and re-thrown to the error boundary,
        // while a non-Error rejection was swallowed. Map non-Errors to an
        // empty list.
        if (error instanceof Error) {
          throw error;
        }
        return { total: 0, items: [] };
      }
    },
  }).data;
};
