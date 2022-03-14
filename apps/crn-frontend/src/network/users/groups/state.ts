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
import { getUserGroups } from './api';

const userGroupIndexState = atomFamily<
  | { ids: ReadonlyArray<string>; total: number }
  | Error
  | 'noSuchUser'
  | undefined,
  string
>({
  key: 'userGroupIndex',
  default: undefined,
});
export const userGroupsState = selectorFamily<
  ListGroupResponse | Error | 'noSuchUser' | undefined,
  string
>({
  key: 'userGroups',
  get:
    (userId) =>
    ({ get }) => {
      const index = get(userGroupIndexState(userId));
      if (
        index === undefined ||
        index === 'noSuchUser' ||
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
    (userId) =>
    ({ get, set, reset }, newGroups) => {
      if (newGroups === undefined || newGroups instanceof DefaultValue) {
        const oldGroups = get(userGroupIndexState(userId));
        if (
          !(
            oldGroups === undefined ||
            oldGroups === 'noSuchUser' ||
            oldGroups instanceof Error
          )
        ) {
          oldGroups.ids.forEach((id) => reset(groupState(id)));
        }
        reset(userGroupIndexState(userId));
      } else if (newGroups instanceof Error || newGroups === 'noSuchUser') {
        set(userGroupIndexState(userId), newGroups);
      } else {
        newGroups?.items.forEach((group) => set(groupState(group.id), group));
        set(userGroupIndexState(userId), {
          total: newGroups.total,
          ids: newGroups.items.map((group) => group.id),
        });
      }
    },
});

export const useUserGroupsById = (userId: string) => {
  const authorization = useRecoilValue(authorizationState);
  const [userGroups, setUserGroups] = useRecoilState(userGroupsState(userId));
  if (userGroups === undefined) {
    throw getUserGroups(userId, authorization)
      .then((newUserGroups) => setUserGroups(newUserGroups ?? 'noSuchUser'))
      .catch(setUserGroups);
  }
  if (userGroups instanceof Error) {
    throw userGroups;
  }
  return userGroups;
};
