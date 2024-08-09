import { AnalyticsSearchOptionsWithFiltering } from '@asap-hub/algolia';
import {
  ListTeamCollaborationAlgoliaResponse,
  ListUserCollaborationAlgoliaResponse,
  SortTeamCollaboration,
  SortUserCollaboration,
  TeamCollaborationAlgoliaResponse,
  TeamCollaborationPerformance,
  UserCollaborationAlgoliaResponse,
  UserCollaborationPerformance,
} from '@asap-hub/model';
import {
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
} from 'recoil';
import { useAnalyticsAlgolia } from '../../hooks/algolia';
import {
  getAlgoliaIndexName,
  makePerformanceHook,
  makePerformanceState,
} from '../utils/state';
import {
  getUserCollaboration,
  getTeamCollaboration,
  getTeamCollaborationPerformance,
  getUserCollaborationPerformance,
} from './api';

const analyticsUserCollaborationIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  AnalyticsSearchOptionsWithFiltering<SortUserCollaboration>
>({
  key: 'analyticsUserCollaborationIndex',
  default: undefined,
});

export const analyticsUserCollaborationListState = atomFamily<
  UserCollaborationAlgoliaResponse | undefined,
  string
>({
  key: 'analyticsUserCollaborationList',
  default: undefined,
});

export const analyticsUserCollaborationState = selectorFamily<
  ListUserCollaborationAlgoliaResponse | Error | undefined,
  AnalyticsSearchOptionsWithFiltering<SortUserCollaboration>
>({
  key: 'userCollaboration',
  get:
    (options) =>
    ({ get }) => {
      const index = get(analyticsUserCollaborationIndexState(options));
      if (index === undefined || index instanceof Error) return index;
      const users: UserCollaborationAlgoliaResponse[] = [];
      for (const id of index.ids) {
        const user = get(analyticsUserCollaborationListState(id));
        if (user === undefined) return undefined;
        users.push(user);
      }
      return { total: index.total, items: users };
    },
  set:
    (options) =>
    ({ get, set, reset }, newUserCollaboration) => {
      if (
        newUserCollaboration === undefined ||
        newUserCollaboration instanceof DefaultValue
      ) {
        reset(analyticsUserCollaborationIndexState(options));
      } else if (newUserCollaboration instanceof Error) {
        set(
          analyticsUserCollaborationIndexState(options),
          newUserCollaboration,
        );
      } else {
        newUserCollaboration?.items.forEach((userCollaboration) =>
          set(
            analyticsUserCollaborationListState(userCollaboration.objectID),
            userCollaboration,
          ),
        );
        set(analyticsUserCollaborationIndexState(options), {
          total: newUserCollaboration.total,
          ids: newUserCollaboration.items.map(
            (userCollaboration) => userCollaboration.objectID,
          ),
        });
      }
    },
});

export const useAnalyticsUserCollaboration = (
  options: AnalyticsSearchOptionsWithFiltering<SortUserCollaboration>,
) => {
  const indexName = getAlgoliaIndexName(options.sort, 'user-collaboration');

  const algoliaClient = useAnalyticsAlgolia(indexName).client;
  const [userCollaboration, setUserCollaboration] = useRecoilState(
    analyticsUserCollaborationState(options),
  );

  if (userCollaboration === undefined) {
    throw getUserCollaboration(algoliaClient, options)
      .then(setUserCollaboration)
      .catch(setUserCollaboration);
  }
  if (userCollaboration instanceof Error) {
    throw userCollaboration;
  }
  return userCollaboration;
};

export const analyticsTeamCollaborationIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  AnalyticsSearchOptionsWithFiltering
>({
  key: 'analyticsTeamCollaborationIndex',
  default: undefined,
});

export const analyticsTeamCollaborationListState = atomFamily<
  TeamCollaborationAlgoliaResponse | undefined,
  string
>({
  key: 'analyticsTeamCollaborationList',
  default: undefined,
});

export const analyticsTeamCollaborationState = selectorFamily<
  ListTeamCollaborationAlgoliaResponse | Error | undefined,
  AnalyticsSearchOptionsWithFiltering
>({
  key: 'teamCollaboration',
  get:
    (options) =>
    ({ get }) => {
      const index = get(analyticsTeamCollaborationIndexState(options));
      if (index === undefined || index instanceof Error) return index;
      const teams: TeamCollaborationAlgoliaResponse[] = [];
      for (const id of index.ids) {
        const team = get(analyticsTeamCollaborationListState(id));
        if (team === undefined) return undefined;
        teams.push(team);
      }
      return { total: index.total, items: teams };
    },
  set:
    (options) =>
    ({ get, set, reset }, newTeamCollaboration) => {
      if (
        newTeamCollaboration === undefined ||
        newTeamCollaboration instanceof DefaultValue
      ) {
        reset(analyticsTeamCollaborationIndexState(options));
      } else if (newTeamCollaboration instanceof Error) {
        set(
          analyticsTeamCollaborationIndexState(options),
          newTeamCollaboration,
        );
      } else {
        newTeamCollaboration?.items.forEach((teamCollaboration) =>
          set(
            analyticsTeamCollaborationListState(teamCollaboration.objectID),
            teamCollaboration,
          ),
        );
        set(analyticsTeamCollaborationIndexState(options), {
          total: newTeamCollaboration.total,
          ids: newTeamCollaboration.items.map(
            (teamCollaboration) => teamCollaboration.objectID,
          ),
        });
      }
    },
});

export const useAnalyticsTeamCollaboration = (
  options: AnalyticsSearchOptionsWithFiltering<SortTeamCollaboration>,
) => {
  const indexName = getAlgoliaIndexName(options.sort, 'team-collaboration');
  const algoliaClient = useAnalyticsAlgolia(indexName).client;

  const [teamCollaboration, setTeamCollaboration] = useRecoilState(
    analyticsTeamCollaborationState(options),
  );

  if (teamCollaboration === undefined) {
    throw getTeamCollaboration(algoliaClient, options)
      .then(setTeamCollaboration)
      .catch(setTeamCollaboration);
  }
  if (teamCollaboration instanceof Error) {
    throw teamCollaboration;
  }
  return teamCollaboration;
};

export const teamCollaborationPerformanceState =
  makePerformanceState<TeamCollaborationPerformance>(
    'analyticsTeamCollaborationPerformance',
  );

export const useTeamCollaborationPerformance =
  makePerformanceHook<TeamCollaborationPerformance>(
    teamCollaborationPerformanceState,
    getTeamCollaborationPerformance,
  );

export const userCollaborationPerformanceState =
  makePerformanceState<UserCollaborationPerformance>(
    'analyticsUserCollaborationPerformance',
  );

export const useUserCollaborationPerformance =
  makePerformanceHook<UserCollaborationPerformance>(
    userCollaborationPerformanceState,
    getUserCollaborationPerformance,
  );
