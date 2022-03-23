import {
  atomFamily,
  selectorFamily,
  useSetRecoilState,
  useRecoilValue,
  useRecoilState,
  DefaultValue,
} from 'recoil';
import {
  UserResponse,
  UserPatchRequest,
  ListUserResponse,
} from '@asap-hub/model';
import { useAuth0 } from '@asap-hub/react-context';

import { authorizationState } from '@asap-hub/crn-frontend/src/auth/state';
import { getUser, patchUser, postUserAvatar, getUsers } from './api';
import { GetListOptions } from '../../api-util';
import { useAlgolia } from '../../hooks/algolia';

const userIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  GetListOptions
>({
  key: 'userIndex',
  default: undefined,
});
export const usersState = selectorFamily<
  ListUserResponse | Error | undefined,
  GetListOptions
>({
  key: 'users',
  get:
    (options) =>
    ({ get }) => {
      const index = get(userIndexState(options));
      if (index === undefined || index instanceof Error) return index;
      const users: UserResponse[] = [];
      for (const id of index.ids) {
        const user = get(userState(id));
        if (user === undefined) return undefined;
        users.push(user);
      }
      return { total: index.total, items: users };
    },
  set:
    (options) =>
    ({ get, set, reset }, newUsers) => {
      if (newUsers === undefined || newUsers instanceof DefaultValue) {
        const oldUsers = get(userIndexState(options));
        if (!(oldUsers instanceof Error)) {
          oldUsers?.ids?.forEach((id) => reset(patchedUserState(id)));
        }
        reset(userIndexState(options));
      } else if (newUsers instanceof Error) {
        set(userIndexState(options), newUsers);
      } else {
        newUsers?.items.forEach((user) => set(patchedUserState(user.id), user));
        set(userIndexState(options), {
          total: newUsers.total,
          ids: newUsers.items.map((user) => user.id),
        });
      }
    },
});

export const refreshUserState = atomFamily<number, string>({
  key: 'refreshUser',
  default: 0,
});
const initialUserState = selectorFamily<UserResponse | undefined, string>({
  key: 'initialUser',
  get:
    (id) =>
    async ({ get }) => {
      get(refreshUserState(id));
      const authorization = get(authorizationState);
      return getUser(id, authorization);
    },
});

const patchedUserState = atomFamily<UserResponse | undefined, string>({
  key: 'patchedUser',
  default: undefined,
});

const userState = selectorFamily<UserResponse | undefined, string>({
  key: 'user',
  get:
    (id) =>
    ({ get }) =>
      get(patchedUserState(id)) ?? get(initialUserState(id)),
});

export const useUsers = (options: GetListOptions) => {
  const [users, setUsers] = useRecoilState(usersState(options));
  const algoliaClient = useAlgolia();
  if (users === undefined) {
    throw getUsers(algoliaClient.client, options)
      .then(setUsers)
      .catch(setUsers);
  }
  if (users instanceof Error) {
    throw users;
  }
  return users;
};

export const useUserById = (id: string) => useRecoilValue(userState(id));

export const usePatchUserById = (id: string) => {
  const { getTokenSilently } = useAuth0();
  const authorization = useRecoilValue(authorizationState);
  const setPatchedUser = useSetRecoilState(patchedUserState(id));
  return async (patch: UserPatchRequest) => {
    setPatchedUser(await patchUser(id, patch, authorization));
    await getTokenSilently({
      redirect_uri: window.location.origin,
      ignoreCache: true,
    });
  };
};

export const usePatchUserAvatarById = (id: string) => {
  const { getTokenSilently } = useAuth0();
  const authorization = useRecoilValue(authorizationState);
  const setSetPatchedUserState = useSetRecoilState(patchedUserState(id));
  return async (avatar: string) => {
    const user = await postUserAvatar(id, { avatar }, authorization);
    await getTokenSilently({
      redirect_uri: window.location.origin,
      ignoreCache: true,
    });

    setSetPatchedUserState(user);
  };
};
