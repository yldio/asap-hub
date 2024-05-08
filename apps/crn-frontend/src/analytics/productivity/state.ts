import {
  ListTeamProductivityAlgoliaResponse,
  ListUserProductivityAlgoliaResponse,
  TeamProductivityAlgoliaResponse,
  UserProductivityAlgoliaResponse,
} from '@asap-hub/model';
import {
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
} from 'recoil';
import { ANALYTICS_ALGOLIA_INDEX } from '../../config';
import { useAnalyticsAlgolia } from '../../hooks/algolia';
import {
  getTeamProductivity,
  getUserProductivity,
  ProductivityListOptions,
} from './api';

const analyticsUserProductivityIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  ProductivityListOptions
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
  ProductivityListOptions
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
  options: ProductivityListOptions,
) => {
  const algoliaClient = useAnalyticsAlgolia(ANALYTICS_ALGOLIA_INDEX);
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
  return userProductivity;
};

const analyticsTeamProductivityIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  ProductivityListOptions
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
  ProductivityListOptions
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
  options: ProductivityListOptions,
) => {
  const algoliaClient = useAnalyticsAlgolia(ANALYTICS_ALGOLIA_INDEX);
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
  return teamProductivity;
};
