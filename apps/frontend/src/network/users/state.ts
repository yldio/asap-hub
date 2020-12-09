import {
  atomFamily,
  selectorFamily,
  useSetRecoilState,
  useRecoilValue,
} from 'recoil';
import { authorizationState } from '@asap-hub/frontend/src/auth/state';
import { UserResponse, UserPatchRequest } from '@asap-hub/model';

import { getUser, patchUser, postUserAvatar } from './api';

export const refreshUserState = atomFamily<number, string>({
  key: 'refreshUser',
  default: 0,
});
const initialUserState = selectorFamily<UserResponse | undefined, string>({
  key: 'initialUser',
  get: (id) => async ({ get }) => {
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
  get: (id) => ({ get }) =>
    get(patchedUserState(id)) ?? get(initialUserState(id)),
});

export const useUserById = (id: string) => useRecoilValue(userState(id));
export const usePatchUserById = (id: string) => {
  const authorization = useRecoilValue(authorizationState);
  const setPatchedUser = useSetRecoilState(patchedUserState(id));
  return async (patch: UserPatchRequest) => {
    setPatchedUser(await patchUser(id, patch, authorization));
  };
};

export const usePatchUserAvatarById = (id: string) => {
  const authorization = useRecoilValue(authorizationState);
  const setSetPatchedUserState = useSetRecoilState(patchedUserState(id));
  return async (avatar: string) => {
    setSetPatchedUserState(await postUserAvatar(id, { avatar }, authorization));
  };
};
