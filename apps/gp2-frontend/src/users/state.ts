import { gp2 } from '@asap-hub/model';
import { useAuth0GP2 } from '@asap-hub/react-context';
import {
  atom,
  atomFamily,
  selector,
  selectorFamily,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { authorizationState } from '../auth/state';
import {
  getContributingCohorts,
  getUser,
  getUsers,
  patchUser,
  postUserAvatar,
} from './api';

export const usersState = selectorFamily<
  gp2.ListUserResponse,
  gp2.FetchUsersOptions
>({
  key: 'usersState',
  get:
    (options) =>
    ({ get }) =>
      getUsers(options, get(authorizationState)),
});

const fetchUserState = selectorFamily<gp2.UserResponse | undefined, string>({
  key: 'fetchUser',
  get:
    (id) =>
    async ({ get }) => {
      const authorization = get(authorizationState);
      return getUser(id, authorization);
    },
});

const userState = selectorFamily<gp2.UserResponse | undefined, string>({
  key: 'user',
  get:
    (id) =>
    ({ get }) =>
      get(patchedUserState(id)) ?? get(fetchUserState(id)),
});

export const useUsersState = (options: gp2.FetchUsersOptions) =>
  useRecoilValue(usersState(options));

export const useUserById = (id: string) => useRecoilValue(userState(id));

const patchedUserState = atomFamily<gp2.UserResponse | undefined, string>({
  key: 'patchedUser',
  default: undefined,
});

export const usePatchUserById = (id: string) => {
  const { getTokenSilently, refreshUser } = useAuth0GP2();
  const authorization = useRecoilValue(authorizationState);
  const setPatchedUser = useSetRecoilState(patchedUserState(id));
  return async (patch: gp2.UserPatchRequest) => {
    setPatchedUser(await patchUser(id, patch, authorization));
    await getTokenSilently({
      redirect_uri: window.location.origin,
      ignoreCache: true,
    });

    await refreshUser();
  };
};

export const usePostUserAvatarById = (id: string) => {
  const { getTokenSilently, refreshUser } = useAuth0GP2();
  const authorization = useRecoilValue(authorizationState);
  const setPatchedUser = useSetRecoilState(patchedUserState(id));
  return async (avatar: string) => {
    setPatchedUser(await postUserAvatar(id, { avatar }, authorization));
    await getTokenSilently({
      redirect_uri: window.location.origin,
      ignoreCache: true,
    });

    await refreshUser();
  };
};

const contributingCohortSelector = selector({
  key: 'contributingCohorts',
  get: ({ get }) => {
    const authorization = get(authorizationState);
    return getContributingCohorts(authorization);
  },
});
const contributingCohortsState = atom<gp2.ContributingCohortResponse[]>({
  key: 'contributingCohortsState',
  default: contributingCohortSelector,
});

export const useContributingCohorts = () =>
  useRecoilValue(contributingCohortsState);
