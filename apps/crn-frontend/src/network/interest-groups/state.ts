import useDeepCompareEffect from 'use-deep-compare-effect';
import {
  useRecoilValue,
  useRecoilState,
  atomFamily,
  selectorFamily,
  DefaultValue,
} from 'recoil';
import {
  ListInterestGroupResponse,
  InterestGroupResponse,
} from '@asap-hub/model';
import { GetListOptions } from '@asap-hub/frontend-utils';

import { authorizationState } from '../../auth/state';
import { getInterestGroups, getInterestGroup } from './api';
import { CARD_VIEW_PAGE_SIZE } from '../../hooks';

const interestGroupIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  GetListOptions
>({
  key: 'interestGroupIndex',
  default: undefined,
});
export const interestGroupsState = selectorFamily<
  ListInterestGroupResponse | Error | undefined,
  GetListOptions
>({
  key: 'interest-groups',
  get:
    (options) =>
    ({ get }) => {
      const index = get(interestGroupIndexState(options));
      if (index === undefined || index instanceof Error) return index;
      const interestGroups: InterestGroupResponse[] = [];
      for (const id of index.ids) {
        const group = get(interestGroupListState(id));
        if (group === undefined) return undefined;
        interestGroups.push(group);
      }
      return { total: index.total, items: interestGroups };
    },
  set:
    (options) =>
    ({ get, set, reset }, newInterestGroups) => {
      if (
        newInterestGroups === undefined ||
        newInterestGroups instanceof DefaultValue
      ) {
        reset(interestGroupIndexState(options));
      } else if (newInterestGroups instanceof Error) {
        set(interestGroupIndexState(options), newInterestGroups);
      } else {
        newInterestGroups?.items.forEach((group) =>
          set(interestGroupListState(group.id), group),
        );
        set(interestGroupIndexState(options), {
          total: newInterestGroups.total,
          ids: newInterestGroups.items.map((group) => group.id),
        });
      }
    },
});

export const refreshInterestGroupState = atomFamily<number, string>({
  key: 'refreshInterestGroup',
  default: 0,
});
const fetchInterestGroupState = selectorFamily<
  InterestGroupResponse | undefined,
  string
>({
  key: 'fetchInterestGroup',
  get:
    (id) =>
    async ({ get }) => {
      get(refreshInterestGroupState(id));
      const authorization = get(authorizationState);
      return getInterestGroup(id, authorization);
    },
});
export const interestGroupState = atomFamily<
  InterestGroupResponse | undefined,
  string
>({
  key: 'interestGroup',
  default: fetchInterestGroupState,
});
export const interestGroupListState = atomFamily<
  InterestGroupResponse | undefined,
  string
>({
  key: 'interestGroupList',
  default: interestGroupState,
});

export const usePrefetchInterestGroups = (
  options: GetListOptions = {
    filters: new Set(),
    searchQuery: '',
    pageSize: CARD_VIEW_PAGE_SIZE,
    currentPage: 0,
  },
) => {
  const authorization = useRecoilValue(authorizationState);
  const [interestGroups, setInterestGroups] = useRecoilState(
    interestGroupsState(options),
  );
  useDeepCompareEffect(() => {
    if (interestGroups === undefined) {
      getInterestGroups(options, authorization).then(setInterestGroups).catch();
    }
  }, [authorization, interestGroups, options, setInterestGroups]);
};
export const useInterestGroups = (options: GetListOptions) => {
  const authorization = useRecoilValue(authorizationState);
  const [interestGroups, setInterestGroups] = useRecoilState(
    interestGroupsState(options),
  );
  if (interestGroups === undefined) {
    throw getInterestGroups(options, authorization)
      .then(setInterestGroups)
      .catch(setInterestGroups);
  }
  if (interestGroups instanceof Error) {
    throw interestGroups;
  }
  return interestGroups;
};

export const useInterestGroupById = (id: string) =>
  useRecoilValue(interestGroupState(id));
