import { createQueryKeys, GetListOptions } from '@asap-hub/frontend-utils';
import {
  WorkingGroupListResponse,
  WorkingGroupResponse,
} from '@asap-hub/model';
import { useSuspenseQuery } from '@tanstack/react-query';

import { useAuthorization } from '../../auth/useAuthorization';
import { useAlgolia } from '../../hooks/algolia';
import { getWorkingGroup, getWorkingGroups } from './api';

export const workingGroupQueryKeys =
  createQueryKeys<GetListOptions>('working-groups');

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
