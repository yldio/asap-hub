import { gp2 } from '@asap-hub/model';
import { normalizeListOptions } from '@asap-hub/frontend-utils';
import { useAuth0GP2 } from '@asap-hub/react-context';
import {
  matchQuery,
  QueryClient,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

import { useAuthorization } from '../auth/useAuthorization';
import { useAlgolia } from '../hooks/algolia';
import { outputQueryKeys } from '../outputs/state';
import { projectQueryKeys } from '../projects/state';
import { workingGroupQueryKeys } from '../working-groups/state';
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

// A profile change can show up anywhere (names, roles, avatars embedded in
// other records), so refetch every cache except the ones holding mutation
// overlays, which must never be refetched (§6.1).
const refetchAllButOverlays = (queryClient: QueryClient, userId: string) => {
  const overlayKeys = [
    userQueryKeys.detail(userId),
    outputQueryKeys.details(),
    projectQueryKeys.details(),
    workingGroupQueryKeys.details(),
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
  ReturnType<typeof useAuth0GP2>,
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
// detail cache — never refetched.
export const usePatchUserById = (id: string) => {
  const auth0 = useAuth0GP2();
  const getAuthorization = useAuthorization();
  const queryClient = useQueryClient();
  return async (patch: gp2.UserPatchRequest) => {
    queryClient.setQueryData(
      userQueryKeys.detail(id),
      await patchUser(id, patch, await getAuthorization()),
    );
    await refreshAuth0Session(auth0);
    refetchAllButOverlays(queryClient, id);
  };
};

export const usePostUserAvatarById = (id: string) => {
  const auth0 = useAuth0GP2();
  const getAuthorization = useAuthorization();
  const queryClient = useQueryClient();
  return async (avatar: string) => {
    queryClient.setQueryData(
      userQueryKeys.detail(id),
      await postUserAvatar(id, { avatar }, await getAuthorization()),
    );
    await refreshAuth0Session(auth0);
    refetchAllButOverlays(queryClient, id);
  };
};
