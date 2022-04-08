import { atomFamily, selectorFamily, useRecoilValue } from 'recoil';
import { UserResponse } from '@asap-hub/model';

import { authorizationState } from '../../auth/state';
import { getUser } from './api';

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

export const useUserById = (id: string) => useRecoilValue(userState(id));
