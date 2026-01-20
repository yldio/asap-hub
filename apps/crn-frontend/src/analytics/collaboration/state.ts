import { AnalyticsSearchOptionsWithFiltering } from '@asap-hub/algolia';
import {
  ListTeamCollaborationAlgoliaResponse,
  ListTeamCollaborationResponse,
  ListUserCollaborationAlgoliaResponse,
  SortSharingPrelimFindings,
  SortTeamCollaboration,
  SortUserCollaboration,
  TeamCollaborationAlgoliaResponse,
  TeamCollaborationPerformance,
  UserCollaborationAlgoliaResponse,
  UserCollaborationPerformance,
  ListPreliminaryDataSharingResponse,
  PreliminaryDataSharingDataObject,
  ListSharingPrelimFindingsResponse,
  SharingPrelimFindingsResponse,
  LimitedTimeRangeOption,
  UserCollaborationResponse,
  TeamCollaborationResponse,
} from '@asap-hub/model';
import { useFlags } from '@asap-hub/react-context';
import {
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
  useRecoilValueLoadable,
} from 'recoil';
import { useAnalyticsAlgolia } from '../../hooks/algolia';
import { useAnalyticsOpensearch } from '../../hooks/opensearch';
import { SearchResult } from '../utils/opensearch';
import {
  getAlgoliaIndexName,
  makeFlagBasedPerformanceHook,
  makePerformanceHook,
  makePerformanceState,
} from '../utils/state';
import {
  getUserCollaboration,
  getTeamCollaboration,
  getTeamCollaborationPerformance,
  getUserCollaborationPerformance,
  getPreliminaryDataSharing,
  PreliminaryDataSharingSearchOptions,
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
  const { isEnabled } = useFlags();
  const indexName = getAlgoliaIndexName(options.sort, 'user-collaboration');

  const algoliaClient = useAnalyticsAlgolia(indexName).client;
  const opensearchClient =
    useAnalyticsOpensearch<UserCollaborationResponse>(
      'user-collaboration',
    ).client;

  const [userCollaboration, setUserCollaboration] = useRecoilState(
    analyticsUserCollaborationState(options),
  );

  if (userCollaboration === undefined) {
    throw getUserCollaboration(
      isEnabled('OPENSEARCH_METRICS') ? opensearchClient : algoliaClient,
      options,
    )
      .then(
        (
          results:
            | SearchResult<UserCollaborationResponse>
            | ListUserCollaborationAlgoliaResponse
            | undefined,
        ) => {
          if (!results) return undefined;

          if (isEnabled('OPENSEARCH_METRICS')) {
            const searchResults =
              results as SearchResult<UserCollaborationResponse>;
            return {
              total: searchResults.total,
              items: searchResults.items.map(
                (item: UserCollaborationResponse) => ({
                  ...item,
                  objectID: item.id,
                }),
              ),
            };
          }
          return results as ListUserCollaborationAlgoliaResponse;
        },
      )
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
      .then((results: ListTeamCollaborationResponse | undefined) => {
        if (!results) return undefined;

        return {
          total: results.total,
          items: results.items.map((item: TeamCollaborationResponse) => ({
            ...item,
            objectID: item.id,
          })),
        };
      })
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

export const useTeamCollaborationPerformanceValue = (
  options: Parameters<typeof getTeamCollaborationPerformance>[1],
) => {
  const loadable = useRecoilValueLoadable(
    teamCollaborationPerformanceState(options),
  );
  return loadable.state === 'hasValue' ? loadable.contents : undefined;
};

export const userCollaborationPerformanceState =
  makePerformanceState<UserCollaborationPerformance>(
    'analyticsUserCollaborationPerformance',
  );

export const useUserCollaborationPerformance =
  makeFlagBasedPerformanceHook<UserCollaborationPerformance>(
    userCollaborationPerformanceState,
    getUserCollaborationPerformance,
    'user-collaboration-performance',
  );

export const useUserCollaborationPerformanceValue = (
  options: Parameters<typeof getUserCollaborationPerformance>[1],
) => {
  const loadable = useRecoilValueLoadable(
    userCollaborationPerformanceState(options),
  );
  return loadable.state === 'hasValue' ? loadable.contents : undefined;
};

const analyticsPreliminaryDataSharingState = atomFamily<
  ListPreliminaryDataSharingResponse | Error | undefined,
  PreliminaryDataSharingSearchOptions
>({
  key: 'analyticsPreliminaryDataSharing',
  default: undefined,
});

export const useAnalyticsSharingPrelimFindings = (
  options: Omit<
    AnalyticsSearchOptionsWithFiltering<SortSharingPrelimFindings>,
    'timeRange'
  > & {
    timeRange: LimitedTimeRangeOption;
  },
): ListSharingPrelimFindingsResponse => {
  const opensearchClient =
    useAnalyticsOpensearch<PreliminaryDataSharingDataObject>(
      'preliminary-data-sharing',
    ).client;

  const [preliminaryDataSharing, setPreliminaryDataSharing] = useRecoilState(
    analyticsPreliminaryDataSharingState({
      currentPage: options.currentPage,
      pageSize: options.pageSize,
      tags: options.tags,
      timeRange: options.timeRange,
    }),
  );

  if (preliminaryDataSharing === undefined) {
    throw getPreliminaryDataSharing(opensearchClient, {
      currentPage: options.currentPage,
      pageSize: options.pageSize,
      tags: options.tags,
      timeRange: options.timeRange,
    })
      .then(setPreliminaryDataSharing)
      .catch(setPreliminaryDataSharing);
  }

  if (preliminaryDataSharing instanceof Error) {
    throw preliminaryDataSharing;
  }

  const transformedItems: SharingPrelimFindingsResponse[] =
    preliminaryDataSharing.items.map((item) => ({
      teamId: item.teamId,
      teamName: item.teamName,
      isTeamInactive: item.isTeamInactive,
      teamPercentShared: item.percentShared,
      limitedData: item.limitedData,
      timeRange: item.timeRange,
    }));

  return {
    items: transformedItems,
    total: preliminaryDataSharing.total,
  };
};
