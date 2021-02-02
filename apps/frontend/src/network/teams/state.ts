import {
  atomFamily,
  selectorFamily,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import {
  TeamResponse,
  TeamPatchRequest,
  ListGroupResponse,
} from '@asap-hub/model';

import { getTeam, patchTeam, getTeamGroups } from './api';
import { authorizationState } from '../../auth/state';

export const refreshTeamState = atomFamily<number, string>({
  key: 'refreshTeam',
  default: 0,
});
const initialTeamState = selectorFamily<TeamResponse | undefined, string>({
  key: 'initialTeam',
  get: (id) => async ({ get }) => {
    get(refreshTeamState(id));
    const authorization = get(authorizationState);
    return getTeam(id, authorization);
  },
});

const patchedTeamState = atomFamily<TeamResponse | undefined, string>({
  key: 'patchedTeam',
  default: undefined,
});

const teamState = selectorFamily<TeamResponse | undefined, string>({
  key: 'team',
  get: (id) => ({ get }) =>
    get(patchedTeamState(id)) ?? get(initialTeamState(id)),
});

const teamGroupsState = selectorFamily<ListGroupResponse, string>({
  key: 'teamGroups',
  get: (id) => async ({ get }) => {
    get(refreshTeamState(id));
    const authorization = get(authorizationState);
    return getTeamGroups(id, authorization);
  },
});

export const useTeamById = (id: string) => useRecoilValue(teamState(id));
export const usePatchTeamById = (id: string) => {
  const authorization = useRecoilValue(authorizationState);
  const setPatchedTeam = useSetRecoilState(patchedTeamState(id));
  return async (patch: TeamPatchRequest) => {
    setPatchedTeam(await patchTeam(id, patch, authorization));
  };
};
export const useTeamGroupsById = (id: string) =>
  useRecoilValue(teamGroupsState(id));
