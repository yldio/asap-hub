import {
  ListTeamProductivityResponse,
  ListUserProductivityResponse,
  SortTeamProductivity,
  SortUserProductivity,
  TeamProductivityPerformance,
  TeamProductivityResponse,
  UserProductivityPerformance,
  UserProductivityResponse,
} from '@asap-hub/model';
import {
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
} from 'recoil';
import { AnalyticsSearchOptionsWithFiltering } from '../utils/analytics-options';
import { useAnalyticsOpensearch } from '../../hooks/opensearch';
import { makePerformanceQuery } from '../utils/state';
import {
  getTeamProductivity,
  getTeamProductivityPerformance,
  getUserProductivity,
  getUserProductivityPerformance,
} from './api';

const analyticsUserProductivityIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  AnalyticsSearchOptionsWithFiltering<SortUserProductivity>
>({
  key: 'analyticsUserProductivityIndex',
  default: undefined,
});

export const analyticsUserProductivityListState = atomFamily<
  UserProductivityResponse | undefined,
  string
>({
  key: 'analyticsUserProductivityList',
  default: undefined,
});

export const analyticsUserProductivityState = selectorFamily<
  ListUserProductivityResponse | Error | undefined,
  AnalyticsSearchOptionsWithFiltering<SortUserProductivity>
>({
  key: 'userProductivity',
  get:
    (options) =>
    ({ get }) => {
      const index = get(analyticsUserProductivityIndexState(options));
      if (index === undefined || index instanceof Error) return index;
      const users: UserProductivityResponse[] = [];
      for (const id of index.ids) {
        const user = get(analyticsUserProductivityListState(id));
        if (user === undefined) return undefined;
        users.push(user);
      }
      return { total: index.total, items: users };
    },
  set:
    (options) =>
    ({ get: _get, set, reset }, newUserProductivity) => {
      if (
        newUserProductivity === undefined ||
        newUserProductivity instanceof DefaultValue
      ) {
        reset(analyticsUserProductivityIndexState(options));
      } else if (newUserProductivity instanceof Error) {
        set(analyticsUserProductivityIndexState(options), newUserProductivity);
      } else {
        newUserProductivity?.items.forEach((userProductivity) =>
          set(
            analyticsUserProductivityListState(
              userProductivity.id + JSON.stringify(options), // Cache the original id plus the current sort/search/filter options
            ),
            userProductivity,
          ),
        );
        set(analyticsUserProductivityIndexState(options), {
          total: newUserProductivity.total,
          ids: newUserProductivity.items.map(
            (userProductivity) => userProductivity.id + JSON.stringify(options),
          ),
        });
      }
    },
});

export const useAnalyticsUserProductivity = (
  options: AnalyticsSearchOptionsWithFiltering<SortUserProductivity>,
) => {
  const opensearchClient =
    useAnalyticsOpensearch<UserProductivityResponse>(
      'user-productivity',
    ).client;

  const [userProductivity, setUserProductivity] = useRecoilState(
    analyticsUserProductivityState(options),
  );

  if (userProductivity === undefined) {
    throw getUserProductivity(opensearchClient, options)
      .then(setUserProductivity)
      .catch(setUserProductivity);
  }

  if (userProductivity instanceof Error) {
    throw userProductivity;
  }

  return { ...userProductivity };
};

const userProductivityPerformanceQuery =
  makePerformanceQuery<UserProductivityPerformance>(
    'user-productivity-performance',
  );

export const useUserProductivityPerformance =
  userProductivityPerformanceQuery.useSuspenseHook(
    getUserProductivityPerformance,
    'user-productivity-performance',
  );

export const useUserProductivityPerformanceValue =
  userProductivityPerformanceQuery.useValueHook;

const teamProductivityPerformanceQuery =
  makePerformanceQuery<TeamProductivityPerformance>(
    'team-productivity-performance',
  );

export const useTeamProductivityPerformance =
  teamProductivityPerformanceQuery.useSuspenseHook(
    getTeamProductivityPerformance,
    'team-productivity-performance',
  );

export const useTeamProductivityPerformanceValue =
  teamProductivityPerformanceQuery.useValueHook;

const analyticsTeamProductivityIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  AnalyticsSearchOptionsWithFiltering<SortTeamProductivity>
>({
  key: 'analyticsTeamProductivityIndex',
  default: undefined,
});

export const analyticsTeamProductivityListState = atomFamily<
  TeamProductivityResponse | undefined,
  string
>({
  key: 'analyticsTeamProductivityList',
  default: undefined,
});

export const analyticsTeamProductivityState = selectorFamily<
  ListTeamProductivityResponse | Error | undefined,
  AnalyticsSearchOptionsWithFiltering<SortTeamProductivity>
>({
  key: 'teamProductivity',
  get:
    (options) =>
    ({ get }) => {
      const index = get(analyticsTeamProductivityIndexState(options));
      if (index === undefined || index instanceof Error) return index;
      const teams: TeamProductivityResponse[] = [];
      for (const id of index.ids) {
        const team = get(analyticsTeamProductivityListState(id));
        if (team === undefined) return undefined;
        teams.push(team);
      }
      return { total: index.total, items: teams };
    },
  set:
    (options) =>
    ({ get: _get, set, reset }, newTeamProductivity) => {
      if (
        newTeamProductivity === undefined ||
        newTeamProductivity instanceof DefaultValue
      ) {
        reset(analyticsTeamProductivityIndexState(options));
      } else if (newTeamProductivity instanceof Error) {
        set(analyticsTeamProductivityIndexState(options), newTeamProductivity);
      } else {
        newTeamProductivity?.items.forEach((teamProductivity) =>
          set(
            analyticsTeamProductivityListState(
              teamProductivity.id + JSON.stringify(options), // Cache the original id plus the current sort/search/filter options
            ),
            teamProductivity,
          ),
        );
        set(analyticsTeamProductivityIndexState(options), {
          total: newTeamProductivity.total,
          ids: newTeamProductivity.items.map(
            (teamProductivity) => teamProductivity.id + JSON.stringify(options),
          ),
        });
      }
    },
});

export const useAnalyticsTeamProductivity = (
  options: AnalyticsSearchOptionsWithFiltering<SortTeamProductivity>,
) => {
  const opensearchClient =
    useAnalyticsOpensearch<TeamProductivityResponse>(
      'team-productivity',
    ).client;

  const [teamProductivity, setTeamProductivity] = useRecoilState(
    analyticsTeamProductivityState(options),
  );

  if (teamProductivity === undefined) {
    throw getTeamProductivity(opensearchClient, options)
      .then(setTeamProductivity)
      .catch(setTeamProductivity);
  }

  if (teamProductivity instanceof Error) {
    throw teamProductivity;
  }
  return { ...teamProductivity };
};
