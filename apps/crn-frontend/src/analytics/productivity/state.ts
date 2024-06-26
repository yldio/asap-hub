import { AnalyticsSearchOptionsWithFiltering } from '@asap-hub/algolia';
import {
  ListTeamProductivityAlgoliaResponse,
  ListUserProductivityAlgoliaResponse,
  SortTeamProductivity,
  SortUserProductivity,
  OutputTypeOption,
  TeamProductivityAlgoliaResponse,
  TeamProductivityPerformance,
  UserProductivityAlgoliaResponse,
  UserProductivityPerformance,
} from '@asap-hub/model';
import {
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
} from 'recoil';
import { ANALYTICS_ALGOLIA_INDEX } from '../../config';
import { useAnalyticsAlgolia } from '../../hooks/algolia';
import { makePerformanceHook, makePerformanceState } from '../utils/state';
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
  UserProductivityAlgoliaResponse | undefined,
  string
>({
  key: 'analyticsUserProductivityList',
  default: undefined,
});

export const analyticsUserProductivityState = selectorFamily<
  ListUserProductivityAlgoliaResponse | Error | undefined,
  AnalyticsSearchOptionsWithFiltering<SortUserProductivity>
>({
  key: 'userProductivity',
  get:
    (options) =>
    ({ get }) => {
      const index = get(analyticsUserProductivityIndexState(options));
      if (index === undefined || index instanceof Error) return index;
      const users: UserProductivityAlgoliaResponse[] = [];
      for (const id of index.ids) {
        const user = get(analyticsUserProductivityListState(id));
        if (user === undefined) return undefined;
        users.push(user);
      }
      return { total: index.total, items: users };
    },
  set:
    (options) =>
    ({ get, set, reset }, newUserProductivity) => {
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
            analyticsUserProductivityListState(userProductivity.objectID),
            userProductivity,
          ),
        );
        set(analyticsUserProductivityIndexState(options), {
          total: newUserProductivity.total,
          ids: newUserProductivity.items.map(
            (userProductivity) => userProductivity.objectID,
          ),
        });
      }
    },
});

export const useAnalyticsUserProductivity = (
  options: AnalyticsSearchOptionsWithFiltering<SortUserProductivity>,
) => {
  const indexName =
    options.sort === 'user_asc'
      ? ANALYTICS_ALGOLIA_INDEX
      : `${ANALYTICS_ALGOLIA_INDEX}_user_${options.sort.replace('user_', '')}`;

  const algoliaClient = useAnalyticsAlgolia(indexName);

  const [userProductivity, setUserProductivity] = useRecoilState(
    analyticsUserProductivityState(options),
  );
  if (userProductivity === undefined) {
    throw getUserProductivity(algoliaClient.client, options)
      .then(setUserProductivity)
      .catch(setUserProductivity);
  }
  if (userProductivity instanceof Error) {
    throw userProductivity;
  }
  return { ...userProductivity, client: algoliaClient.client };
};

export const userProductivityPerformanceState =
  makePerformanceState<UserProductivityPerformance>(
    'analyticsUserProductivityPerformance',
  );
export const useUserProductivityPerformance =
  makePerformanceHook<UserProductivityPerformance>(
    userProductivityPerformanceState,
    getUserProductivityPerformance,
  );

export const teamProductivityPerformanceState =
  makePerformanceState<TeamProductivityPerformance>(
    'analyticsTeamProductivityPerformance',
  );

export const useTeamProductivityPerformance =
  makePerformanceHook<TeamProductivityPerformance>(
    teamProductivityPerformanceState,
    getTeamProductivityPerformance,
  );

const analyticsTeamProductivityIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  AnalyticsSearchOptionsWithFiltering<SortTeamProductivity>
>({
  key: 'analyticsTeamProductivityIndex',
  default: undefined,
});

export const analyticsTeamProductivityListState = atomFamily<
  TeamProductivityAlgoliaResponse | undefined,
  string
>({
  key: 'analyticsTeamProductivityList',
  default: undefined,
});

export const analyticsTeamProductivityState = selectorFamily<
  ListTeamProductivityAlgoliaResponse | Error | undefined,
  AnalyticsSearchOptionsWithFiltering<SortTeamProductivity>
>({
  key: 'teamProductivity',
  get:
    (options) =>
    ({ get }) => {
      const index = get(analyticsTeamProductivityIndexState(options));
      if (index === undefined || index instanceof Error) return index;
      const teams: TeamProductivityAlgoliaResponse[] = [];
      for (const id of index.ids) {
        const team = get(analyticsTeamProductivityListState(id));
        if (team === undefined) return undefined;
        teams.push(team);
      }
      return { total: index.total, items: teams };
    },
  set:
    (options) =>
    ({ get, set, reset }, newTeamProductivity) => {
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
            analyticsTeamProductivityListState(teamProductivity.objectID),
            teamProductivity,
          ),
        );
        set(analyticsTeamProductivityIndexState(options), {
          total: newTeamProductivity.total,
          ids: newTeamProductivity.items.map(
            (teamProductivity) => teamProductivity.objectID,
          ),
        });
      }
    },
});

export const useAnalyticsTeamProductivity = (
  options: AnalyticsSearchOptionsWithFiltering<SortTeamProductivity>,
) => {
  const indexName =
    options.sort === 'team_asc'
      ? ANALYTICS_ALGOLIA_INDEX
      : `${ANALYTICS_ALGOLIA_INDEX}_team_${options.sort.replace('team_', '')}`;
  const algoliaClient = useAnalyticsAlgolia(indexName);

  const [teamProductivity, setTeamProductivity] = useRecoilState(
    analyticsTeamProductivityState(options),
  );
  if (teamProductivity === undefined) {
    throw getTeamProductivity(algoliaClient.client, options)
      .then(setTeamProductivity)
      .catch(setTeamProductivity);
  }
  if (teamProductivity instanceof Error) {
    throw teamProductivity;
  }
  return { ...teamProductivity, client: algoliaClient.client };
};
