import { authorizationState } from '@asap-hub/crn-frontend/src/auth/state';
import { GetListOptions } from '@asap-hub/frontend-utils';
import {
  UserListItemResponse,
  UserPatchRequest,
  UserResponse,
  ListUserResponse,
} from '@asap-hub/model';
import { useAuth0CRN } from '@asap-hub/react-context';
import {
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { useAlgolia } from '../../hooks/algolia';
import { getUser, getUsers, patchUser, postUserAvatar } from './api';

const userIndexState = atomFamily<
  | {
      ids: ReadonlyArray<string>;
      total: number;
      algoliaQueryId?: string;
      algoliaIndexName?: string;
    }
  | Error
  | undefined,
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
      const users: UserListItemResponse[] = [];
      for (const id of index.ids) {
        const user = get(userListState(id));
        if (user === undefined) return undefined;
        users.push(user);
      }
      return {
        total: index.total,
        items: users,
        algoliaIndexName: index.algoliaIndexName,
        algoliaQueryId: index.algoliaQueryId,
      };
    },
  set:
    (options) =>
    ({ get, set, reset }, newUsers) => {
      if (newUsers === undefined || newUsers instanceof DefaultValue) {
        reset(userIndexState(options));
      } else if (newUsers instanceof Error) {
        set(userIndexState(options), newUsers);
      } else {
        newUsers?.items.forEach((user) => set(userListState(user.id), user));
        set(userIndexState(options), {
          total: newUsers.total,
          ids: newUsers.items.map((user) => user.id),
          algoliaIndexName: newUsers.algoliaIndexName,
          algoliaQueryId: newUsers.algoliaQueryId,
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

const userListState = atomFamily<UserListItemResponse | undefined, string>({
  key: 'userList',
  default: undefined,
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
  const { getTokenSilently, refreshUser } = useAuth0CRN();
  const authorization = useRecoilValue(authorizationState);
  const setPatchedUser = useSetRecoilState(patchedUserState(id));
  return async (patch: UserPatchRequest) => {
    setPatchedUser(await patchUser(id, patch, authorization));
    await getTokenSilently({
      redirect_uri: window.location.origin,
      ignoreCache: true,
    });

    await refreshUser();
  };
};

export const usePatchUserAvatarById = (id: string) => {
  const { getTokenSilently, refreshUser } = useAuth0CRN();
  const authorization = useRecoilValue(authorizationState);
  const setSetPatchedUserState = useSetRecoilState(patchedUserState(id));
  return async (avatar: string) => {
    const user = await postUserAvatar(id, { avatar }, authorization);
    await getTokenSilently({
      redirect_uri: window.location.origin,
      ignoreCache: true,
    });

    await refreshUser();

    setSetPatchedUserState(user);
  };
};
