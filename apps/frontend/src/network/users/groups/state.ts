import { selectorFamily, useRecoilValue } from 'recoil';
import { ListGroupResponse } from '@asap-hub/model';

import { authorizationState } from '@asap-hub/frontend/src/auth/state';
import { refreshUserState } from '../state';
import { getUserGroups } from './api';

const userGroupsState = selectorFamily<ListGroupResponse, string>({
  key: 'userGroups',
  get: (id) => async ({ get }) => {
    get(refreshUserState(id));
    const authorization = get(authorizationState);
    return getUserGroups(id, authorization);
  },
});

export const useUserGroupsById = (id: string) =>
  useRecoilValue(userGroupsState(id));
