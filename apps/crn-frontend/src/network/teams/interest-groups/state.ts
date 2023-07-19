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
import { getTeamInterestGroups } from './api';

const teamInterestGroupIndexState = atomFamily<
  | { ids: ReadonlyArray<string>; total: number }
  | Error
  | 'noSuchTeam'
  | undefined,
  string
>({
  key: 'teamInterestGroupIndex',
  default: undefined,
});
export const teamInterestGroupsState = selectorFamily<
  ListInterestGroupResponse | Error | 'noSuchTeam' | undefined,
  string
>({
  key: 'teamInterestGroups',
  get:
    (teamId) =>
    ({ get }) => {
      const index = get(teamInterestGroupIndexState(teamId));
      if (
        index === undefined ||
        index === 'noSuchTeam' ||
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
    (teamId) =>
    ({ get, set, reset }, newInterestGroups) => {
      if (
        newInterestGroups === undefined ||
        newInterestGroups instanceof DefaultValue
      ) {
        const oldInterestGroups = get(teamInterestGroupIndexState(teamId));
        if (
          !(
            oldInterestGroups === undefined ||
            oldInterestGroups === 'noSuchTeam' ||
            oldInterestGroups instanceof Error
          )
        ) {
          oldInterestGroups.ids.forEach((id) => reset(interestGroupState(id)));
        }
        reset(teamInterestGroupIndexState(teamId));
      } else if (
        newInterestGroups instanceof Error ||
        newInterestGroups === 'noSuchTeam'
      ) {
        set(teamInterestGroupIndexState(teamId), newInterestGroups);
      } else {
        newInterestGroups?.items.forEach((interestGroup) =>
          set(interestGroupState(interestGroup.id), interestGroup),
        );
        set(teamInterestGroupIndexState(teamId), {
          total: newInterestGroups.total,
          ids: newInterestGroups.items.map((group) => group.id),
        });
      }
    },
});

export const useTeamInterestGroupsById = (teamId: string) => {
  const authorization = useRecoilValue(authorizationState);
  const [teamInterestGroups, setTeamInterestGroups] = useRecoilState(
    teamInterestGroupsState(teamId),
  );
  if (teamInterestGroups === undefined) {
    throw getTeamInterestGroups(teamId, authorization)
      .then((newTeamInterestGroups) =>
        setTeamInterestGroups(newTeamInterestGroups ?? 'noSuchTeam'),
      )
      .catch(setTeamInterestGroups);
  }
  if (teamInterestGroups instanceof Error) {
    throw teamInterestGroups;
  }
  return teamInterestGroups;
};
