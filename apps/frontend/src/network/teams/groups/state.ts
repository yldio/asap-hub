import { selectorFamily, useRecoilValue } from 'recoil';
import { ListGroupResponse } from '@asap-hub/model';
import { authorizationState } from '@asap-hub/frontend/src/auth/state';

import { refreshTeamState } from '../state';
import { getTeamGroups } from './api';

const teamGroupsState = selectorFamily<ListGroupResponse | undefined, string>({
  key: 'teamGroups',
  get: (id) => async ({ get }) => {
    get(refreshTeamState(id));
    const authorization = get(authorizationState);
    return getTeamGroups(id, authorization);
  },
});

export const useTeamGroupsById = (id: string) =>
  useRecoilValue(teamGroupsState(id));
