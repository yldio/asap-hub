import {
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { GroupResponse, ListGroupResponse } from '@asap-hub/model';

import { groupState } from '@asap-hub/crn-frontend/src/network/groups/state';
import { authorizationState } from '@asap-hub/crn-frontend/src/auth/state';
import { getTeamGroups } from './api';

const teamGroupIndexState = atomFamily<
  | { ids: ReadonlyArray<string>; total: number }
  | Error
  | 'noSuchTeam'
  | undefined,
  string
>({
  key: 'teamGroupIndex',
  default: undefined,
});
export const teamGroupsState = selectorFamily<
  ListGroupResponse | Error | 'noSuchTeam' | undefined,
  string
>({
  key: 'teamGroups',
  get:
    (teamId) =>
    ({ get }) => {
      const index = get(teamGroupIndexState(teamId));
      if (
        index === undefined ||
        index === 'noSuchTeam' ||
        index instanceof Error
      )
        return index;
      const groups: GroupResponse[] = [];
      for (const id of index.ids) {
        const group = get(groupState(id));
        if (group === undefined) return undefined;
        groups.push(group);
      }
      return { total: index.total, items: groups };
    },
  set:
    (teamId) =>
    ({ get, set, reset }, newGroups) => {
      if (newGroups === undefined || newGroups instanceof DefaultValue) {
        const oldGroups = get(teamGroupIndexState(teamId));
        if (
          !(
            oldGroups === undefined ||
            oldGroups === 'noSuchTeam' ||
            oldGroups instanceof Error
          )
        ) {
          oldGroups.ids.forEach((id) => reset(groupState(id)));
        }
        reset(teamGroupIndexState(teamId));
      } else if (newGroups instanceof Error || newGroups === 'noSuchTeam') {
        set(teamGroupIndexState(teamId), newGroups);
      } else {
        newGroups?.items.forEach((group) => set(groupState(group.id), group));
        set(teamGroupIndexState(teamId), {
          total: newGroups.total,
          ids: newGroups.items.map((group) => group.id),
        });
      }
    },
});

export const useTeamGroupsById = (teamId: string) => {
  const authorization = useRecoilValue(authorizationState);
  const [teamGroups, setTeamGroups] = useRecoilState(teamGroupsState(teamId));
  if (teamGroups === undefined) {
    throw getTeamGroups(teamId, authorization)
      .then((newTeamGroups) => setTeamGroups(newTeamGroups ?? 'noSuchTeam'))
      .catch(setTeamGroups);
  }
  if (teamGroups instanceof Error) {
    throw teamGroups;
  }
  return teamGroups;
};
