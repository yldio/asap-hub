import { GetListOptions, normalizeListOptions } from '@asap-hub/frontend-utils';
import {
  ListUserResponse,
  UserPatchRequest,
  UserResponse,
} from '@asap-hub/model';
import { useAuth0CRN } from '@asap-hub/react-context';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { useAuthorization } from '../../auth/useAuthorization';
import { useAlgolia } from '../../hooks/algolia';
import {
  deleteUserAvatar,
  getUser,
  getUsers,
  patchUser,
  postUserAvatar,
} from './api';

export const userQueryKeys = {
  all: ['users'] as const,
  lists: () => [...userQueryKeys.all, 'list'] as const,
  list: (options: GetListOptions) =>
    [...userQueryKeys.lists(), normalizeListOptions(options)] as const,
  details: () => [...userQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...userQueryKeys.details(), id] as const,
};

export const useUsers = (options: GetListOptions): ListUserResponse => {
  const algoliaClient = useAlgolia();
  return useSuspenseQuery({
    queryKey: userQueryKeys.list(options),
    queryFn: async (): Promise<ListUserResponse> => {
      try {
        return await getUsers(algoliaClient.client, options);
      } catch (error) {
        // Preserved from the recoil hook's `.catch(setUsers)`: an Error
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

export const useUserById = (id: string): UserResponse | undefined => {
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
// detail cache (the recoil patchedUserState overlay) — never refetched,
// because Contentful has read-after-write lag (see docs §6.1) — and then
// refresh the Auth0 token + user so the id token picks up the profile change.
export const usePatchUserById = (id: string) => {
  const { getTokenSilently, refreshUser } = useAuth0CRN();
  const getAuthorization = useAuthorization();
  const queryClient = useQueryClient();
  return async (patch: UserPatchRequest) => {
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

export type AvatarMutationOptions = {
  // skip the Auth0 token refresh when a following mutation (e.g. patchUser)
  // will refresh it, avoiding a redundant silent-auth round-trip
  refreshToken?: boolean;
};

export const usePatchUserAvatarById = (id: string) => {
  const { getTokenSilently, refreshUser } = useAuth0CRN();
  const getAuthorization = useAuthorization();
  const queryClient = useQueryClient();
  return async (
    avatar: string,
    { refreshToken = true }: AvatarMutationOptions = {},
  ) => {
    const user = await postUserAvatar(id, { avatar }, await getAuthorization());
    queryClient.setQueryData(userQueryKeys.detail(id), user);
    if (refreshToken) {
      await getTokenSilently({
        redirect_uri: window.location.origin,
        ignoreCache: true,
      });

      await refreshUser();
    }
  };
};

export const useDeleteUserAvatarById = (id: string) => {
  const { getTokenSilently, refreshUser } = useAuth0CRN();
  const getAuthorization = useAuthorization();
  const queryClient = useQueryClient();
  return async ({ refreshToken = true }: AvatarMutationOptions = {}) => {
    const user = await deleteUserAvatar(id, await getAuthorization());
    queryClient.setQueryData(userQueryKeys.detail(id), user);
    if (refreshToken) {
      await getTokenSilently({
        redirect_uri: window.location.origin,
        ignoreCache: true,
      });

      await refreshUser();
    }
  };
};
