import { gp2 } from '@asap-hub/model';
import { useAuth0GP2 } from '@asap-hub/react-context';
import {
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { authorizationState } from '../auth/state';
import { useAlgolia } from '../hooks/algolia';
import {
  getAlgoliaUsers,
  getUser,
  patchUser,
  postUserAvatar,
  UserListOptions,
} from './api';

const userIndexState = atomFamily<
  | {
      ids: ReadonlyArray<string>;
      total: number;
      algoliaQueryId?: string;
      algoliaIndexName?: string;
    }
  | Error
  | undefined,
  UserListOptions
>({ key: 'userIndex', default: undefined });

export const usersState = selectorFamily<
  gp2.ListUserResponse | Error | undefined,
  UserListOptions
>({
  key: 'users',
  get:
    (options) =>
    ({ get }) => {
      const index = get(userIndexState({ ...options }));
      if (index === undefined || index instanceof Error) return index;
      const users: gp2.UserResponse[] = [];
      for (const id of index.ids) {
        const user = get(userState(id));
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
    ({ get, set, reset }, users) => {
      const indexStateOptions = { ...options };
      if (users === undefined || users instanceof DefaultValue) {
        const oldUsers = get(userIndexState(indexStateOptions));
        if (!(oldUsers instanceof Error)) {
          oldUsers?.ids.forEach((id) => reset(userState(id)));
        }
        reset(userIndexState(indexStateOptions));
      } else if (users instanceof Error) {
        set(userIndexState(indexStateOptions), users);
      } else {
        users.items.forEach((user) => set(userState(user.id), user));
        set(userIndexState(indexStateOptions), {
          total: users.total,
          ids: users.items.map(({ id }) => id),
          algoliaIndexName: users.algoliaIndexName,
          algoliaQueryId: users.algoliaQueryId,
        });
      }
    },
});

export const useUsers = (options: UserListOptions) => {
  const [users, setUsers] = useRecoilState(usersState(options));
  const { client } = useAlgolia();
  if (users === undefined) {
    throw getAlgoliaUsers(client, options)
      .then(
        (data): gp2.ListUserResponse => ({
          total: data.nbHits,
          items: data.hits,
          algoliaIndexName: data.index,
          algoliaQueryId: data.queryID,
        }),
      )
      .then(setUsers)
      .catch(setUsers);
  }
  if (users instanceof Error) {
    throw users;
  }
  return users;
};

const fetchUserState = selectorFamily<gp2.UserResponse | undefined, string>({
  key: 'fetchUser',
  get:
    (id) =>
    async ({ get }) => {
      const authorization = get(authorizationState);
      return getUser(id, authorization);
    },
});

const userState = atomFamily<gp2.UserResponse | undefined, string>({
  key: 'user',
  default: fetchUserState,
});

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
