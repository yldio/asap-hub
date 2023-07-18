import {
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import {
  InterestGroupResponse,
  ListInterestGroupResponse,
} from '@asap-hub/model';

import { interestGroupState } from '../../interest-groups/state';
import { authorizationState } from '../../../auth/state';
import { getUserInterestGroups } from './api';

const userInterestGroupIndexState = atomFamily<
  | { ids: ReadonlyArray<string>; total: number }
  | Error
  | 'noSuchUser'
  | undefined,
  string
>({
  key: 'userInterestGroupIndex',
  default: undefined,
});
export const userInterestGroupsState = selectorFamily<
  ListInterestGroupResponse | Error | 'noSuchUser' | undefined,
  string
>({
  key: 'userInterestGroups',
  get:
    (userId) =>
    ({ get }) => {
      const index = get(userInterestGroupIndexState(userId));
      if (
        index === undefined ||
        index === 'noSuchUser' ||
        index instanceof Error
      )
        return index;
      const interestGroups: InterestGroupResponse[] = [];
      for (const id of index.ids) {
        const interestGroup = get(interestGroupState(id));
        if (interestGroup === undefined) return undefined;
        interestGroups.push(interestGroup);
      }
      return { total: index.total, items: interestGroups };
    },
  set:
    (userId) =>
    ({ get, set, reset }, newInterestGroups) => {
      if (
        newInterestGroups === undefined ||
        newInterestGroups instanceof DefaultValue
      ) {
        const oldInterestGroups = get(userInterestGroupIndexState(userId));
        if (
          !(
            oldInterestGroups === undefined ||
            oldInterestGroups === 'noSuchUser' ||
            oldInterestGroups instanceof Error
          )
        ) {
          oldInterestGroups.ids.forEach((id) => reset(interestGroupState(id)));
        }
        reset(userInterestGroupIndexState(userId));
      } else if (
        newInterestGroups instanceof Error ||
        newInterestGroups === 'noSuchUser'
      ) {
        set(userInterestGroupIndexState(userId), newInterestGroups);
      } else {
        newInterestGroups?.items.forEach((interestGroup) =>
          set(interestGroupState(interestGroup.id), interestGroup),
        );
        set(userInterestGroupIndexState(userId), {
          total: newInterestGroups.total,
          ids: newInterestGroups.items.map((interestGroup) => interestGroup.id),
        });
      }
    },
});

export const useUserInterestGroupsById = (userId: string) => {
  const authorization = useRecoilValue(authorizationState);
  const [userInterestGroups, setUserInterestGroups] = useRecoilState(
    userInterestGroupsState(userId),
  );
  if (userInterestGroups === undefined) {
    throw getUserInterestGroups(userId, authorization)
      .then((newUserGroups) =>
        setUserInterestGroups(newUserGroups ?? 'noSuchUser'),
      )
      .catch(setUserInterestGroups);
  }
  if (userInterestGroups instanceof Error) {
    throw userInterestGroups;
  }
  return userInterestGroups;
};
