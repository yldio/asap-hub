import { gp2 } from '@asap-hub/model';
import { normalizeListOptions } from '@asap-hub/frontend-utils';
import { useAuth0GP2 } from '@asap-hub/react-context';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { useAuthorization } from '../auth/useAuthorization';
import { useAlgolia } from '../hooks/algolia';
import {
  getAlgoliaUsers,
  getUser,
  patchUser,
  postUserAvatar,
  UserListOptions,
} from './api';

export const userQueryKeys = {
  all: ['users'] as const,
  lists: () => [...userQueryKeys.all, 'list'] as const,
  list: (options: UserListOptions) =>
    [...userQueryKeys.lists(), normalizeListOptions(options)] as const,
  details: () => [...userQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...userQueryKeys.details(), id] as const,
};

export const useUsers = (options: UserListOptions): gp2.ListUserResponse => {
  const { client } = useAlgolia();
  return useSuspenseQuery({
    queryKey: userQueryKeys.list(options),
    queryFn: async (): Promise<gp2.ListUserResponse> => {
      try {
        const data = await getAlgoliaUsers(client, options);
        return {
          total: data.nbHits ?? 0,
          items: data.hits,
          algoliaIndexName: data.index,
          algoliaQueryId: data.queryID,
        };
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

export const useUserById = (id: string): gp2.UserResponse | undefined => {
  const getAuthorization = useAuthorization();
  const { data } = useSuspenseQuery({
    queryKey: userQueryKeys.detail(id),
    // getUser resolves undefined on a 404, but a queryFn must not return
    // undefined — cache null and map it back below.
    queryFn: async () => (await getUser(id, await getAuthorization())) ?? null,
  });
  return data ?? undefined;
};

// The mutation hooks below write the mutation response straight into the
// detail cache — never refetched — and then refresh the Auth0 token + user
// so the id token picks up the profile change.
export const usePatchUserById = (id: string) => {
  const { getTokenSilently, refreshUser } = useAuth0GP2();
  const getAuthorization = useAuthorization();
  const queryClient = useQueryClient();
  return async (patch: gp2.UserPatchRequest) => {
    queryClient.setQueryData(
      userQueryKeys.detail(id),
      await patchUser(id, patch, await getAuthorization()),
    );
    await getTokenSilently({
      redirect_uri: window.location.origin,
      ignoreCache: true,
    });

    await refreshUser();
  };
};

export const usePostUserAvatarById = (id: string) => {
  const { getTokenSilently, refreshUser } = useAuth0GP2();
  const getAuthorization = useAuthorization();
  const queryClient = useQueryClient();
  return async (avatar: string) => {
    queryClient.setQueryData(
      userQueryKeys.detail(id),
      await postUserAvatar(id, { avatar }, await getAuthorization()),
    );
    await getTokenSilently({
      redirect_uri: window.location.origin,
      ignoreCache: true,
    });

    await refreshUser();
  };
};
