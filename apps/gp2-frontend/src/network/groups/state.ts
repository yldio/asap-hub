import useDeepCompareEffect from 'use-deep-compare-effect';
import {
  useRecoilValue,
  useRecoilState,
  atomFamily,
  selectorFamily,
  DefaultValue,
} from 'recoil';
import { ListGroupResponse, GroupResponse } from '@asap-hub/model';

import { authorizationState } from '@asap-hub/gp2-frontend/src/auth/state';
import { GetListOptions } from '@asap-hub/frontend-utils';
import { getGroups, getGroup } from './api';
import { CARD_VIEW_PAGE_SIZE } from '../../hooks';

const groupIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  GetListOptions
>({
  key: 'groupIndex',
  default: undefined,
});
export const groupsState = selectorFamily<
  ListGroupResponse | Error | undefined,
  GetListOptions
>({
  key: 'groups',
  get:
    (options) =>
    ({ get }) => {
      const index = get(groupIndexState(options));
      if (index === undefined || index instanceof Error) return index;
      const groups: GroupResponse[] = [];
      for (const id of index.ids) {
        const group = get(groupState(id));
        if (group === undefined) return undefined;
        groups.push(group);
      }
      return { total: index.total, items: groups };
    },
  set:
    (options) =>
    ({ get, set, reset }, newGroups) => {
      if (newGroups === undefined || newGroups instanceof DefaultValue) {
        const oldGroups = get(groupIndexState(options));
        if (!(oldGroups instanceof Error)) {
          oldGroups?.ids?.forEach((id) => reset(groupState(id)));
        }
        reset(groupIndexState(options));
      } else if (newGroups instanceof Error) {
        set(groupIndexState(options), newGroups);
      } else {
        newGroups?.items.forEach((group) => set(groupState(group.id), group));
        set(groupIndexState(options), {
          total: newGroups.total,
          ids: newGroups.items.map((group) => group.id),
        });
      }
    },
});

export const refreshGroupState = atomFamily<number, string>({
  key: 'refreshGroup',
  default: 0,
});
const fetchGroupState = selectorFamily<GroupResponse | undefined, string>({
  key: 'fetchGroup',
  get:
    (id) =>
    async ({ get }) => {
      get(refreshGroupState(id));
      const authorization = get(authorizationState);
      return getGroup(id, authorization);
    },
});
export const groupState = atomFamily<GroupResponse | undefined, string>({
  key: 'group',
  default: fetchGroupState,
});

export const usePrefetchGroups = (
  options: GetListOptions = {
    filters: new Set(),
    searchQuery: '',
    pageSize: CARD_VIEW_PAGE_SIZE,
    currentPage: 0,
  },
) => {
  const authorization = useRecoilValue(authorizationState);
  const [groups, setGroups] = useRecoilState(groupsState(options));
  useDeepCompareEffect(() => {
    if (groups === undefined) {
      getGroups(options, authorization).then(setGroups).catch();
    }
  }, [authorization, groups, options, setGroups]);
};
export const useGroups = (options: GetListOptions) => {
  const authorization = useRecoilValue(authorizationState);
  const [groups, setGroups] = useRecoilState(groupsState(options));
  if (groups === undefined) {
    throw getGroups(options, authorization).then(setGroups).catch(setGroups);
  }
  if (groups instanceof Error) {
    throw groups;
  }
  return groups;
};

export const useGroupById = (id: string) => useRecoilValue(groupState(id));
