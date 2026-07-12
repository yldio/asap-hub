import { GetListOptions, normalizeListOptions } from '@asap-hub/frontend-utils';
import {
  ListUserResponse,
  UserPatchRequest,
  UserResponse,
} from '@asap-hub/model';
import { useAuth0CRN } from '@asap-hub/react-context';
import {
  matchQuery,
  QueryClient,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

import { useAuthorization } from '../../auth/useAuthorization';
import { useAlgolia } from '../../hooks/algolia';
import { projectQueryKeys } from '../../projects/state';
import { researchOutputQueryKeys } from '../../shared-research/state';
import { discussionQueryKeys, manuscriptQueryKeys } from '../teams/state';
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

// A profile change can show up anywhere (names, roles, avatars embedded in
// other records), so refetch every cache except the ones holding mutation
// overlays, which must never be refetched (§6.1).
const refetchAllButOverlays = (queryClient: QueryClient, userId: string) => {
  const overlayKeys = [
    userQueryKeys.detail(userId),
    manuscriptQueryKeys.details(),
    projectQueryKeys.details(),
    discussionQueryKeys.all,
    researchOutputQueryKeys.details(),
  ];
  void queryClient.invalidateQueries({
    predicate: (query) =>
      !overlayKeys.some((queryKey) => matchQuery({ queryKey }, query)),
  });
};

// Refreshes the Auth0 token + user so the id token picks up the profile
// change. Best-effort: the profile is already saved, so a failed refresh
// (e.g. silent auth cannot skip consent on localhost) must not fail the form.
const refreshAuth0Session = async ({
  getTokenSilently,
  refreshUser,
}: Pick<
  ReturnType<typeof useAuth0CRN>,
  'getTokenSilently' | 'refreshUser'
>) => {
  try {
    await getTokenSilently({
      redirect_uri: window.location.origin,
      ignoreCache: true,
    });
    await refreshUser();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('auth0 session refresh after profile update failed', error);
  }
};

// The mutation hooks below write the mutation response straight into the
// detail cache — never refetched, because Contentful has read-after-write
// lag.
export const usePatchUserById = (id: string) => {
  const auth0 = useAuth0CRN();
  const getAuthorization = useAuthorization();
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async (patch: UserPatchRequest) =>
      patchUser(id, patch, await getAuthorization()),
    onSuccess: async (user) => {
      queryClient.setQueryData(userQueryKeys.detail(id), user);
      await refreshAuth0Session(auth0);
      refetchAllButOverlays(queryClient, id);
    },
  });
  return async (patch: UserPatchRequest) => {
    await mutateAsync(patch);
  };
};

export type AvatarMutationOptions = {
  // skip the Auth0 token refresh when a following mutation (e.g. patchUser)
  // will refresh it, avoiding a redundant silent-auth round-trip
  refreshToken?: boolean;
};

export const usePatchUserAvatarById = (id: string) => {
  const auth0 = useAuth0CRN();
  const getAuthorization = useAuthorization();
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async ({ avatar }: { avatar: string; refreshToken: boolean }) =>
      postUserAvatar(id, { avatar }, await getAuthorization()),
    onSuccess: async (user, { refreshToken }) => {
      queryClient.setQueryData(userQueryKeys.detail(id), user);
      if (refreshToken) {
        await refreshAuth0Session(auth0);
        refetchAllButOverlays(queryClient, id);
      }
    },
  });
  return async (
    avatar: string,
    { refreshToken = true }: AvatarMutationOptions = {},
  ) => {
    await mutateAsync({ avatar, refreshToken });
  };
};

export const useDeleteUserAvatarById = (id: string) => {
  const auth0 = useAuth0CRN();
  const getAuthorization = useAuthorization();
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async (_variables: { refreshToken: boolean }) =>
      deleteUserAvatar(id, await getAuthorization()),
    onSuccess: async (user, { refreshToken }) => {
      queryClient.setQueryData(userQueryKeys.detail(id), user);
      if (refreshToken) {
        await refreshAuth0Session(auth0);
        refetchAllButOverlays(queryClient, id);
      }
    },
  });
  return async ({ refreshToken = true }: AvatarMutationOptions = {}) => {
    await mutateAsync({ refreshToken });
  };
};
