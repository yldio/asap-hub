import { AnalyticsSearchOptionsWithFiltering } from '@asap-hub/algolia';
import {
  ListPreprintComplianceOpensearchResponse,
  PreprintComplianceOpensearchResponse,
  SortPreprintCompliance,
  TimeRangeOption,
} from '@asap-hub/model';
import {
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
} from 'recoil';
import { getPreprintCompliance } from './api';
import { useAnalyticsOpensearch } from '../../hooks';

type PreprintComplianceOptions =
  AnalyticsSearchOptionsWithFiltering<SortPreprintCompliance>;

type PreprintComplianceStateOptionKeyData = Pick<
  PreprintComplianceOptions,
  'currentPage' | 'pageSize' | 'sort' | 'tags'
> & { timeRange: Extract<TimeRangeOption, 'all' | 'last-year'> };
const preprintComplianceIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  PreprintComplianceStateOptionKeyData
>({
  key: 'analyticsPreprintComplianceIndex',
  default: undefined,
});

export const preprintComplianceListState = atomFamily<
  PreprintComplianceOpensearchResponse | undefined,
  { teamId: string; pageKey: string }
>({
  key: 'analyticsPreprintComplianceList',
  default: undefined,
});

export const preprintComplianceState = selectorFamily<
  ListPreprintComplianceOpensearchResponse | Error | undefined,
  PreprintComplianceStateOptionKeyData
>({
  key: 'preprintCompliance',
  get:
    (options) =>
    ({ get }) => {
      const index = get(preprintComplianceIndexState(options));
      if (index === undefined || index instanceof Error) return index;
      const teams: PreprintComplianceOpensearchResponse[] = [];
      const pageKey = JSON.stringify({
        currentPage: options.currentPage,
        pageSize: options.pageSize,
        sort: options.sort,
        tags: options.tags,
        timeRange: options.timeRange,
      });
      for (const id of index.ids) {
        const team = get(preprintComplianceListState({ teamId: id, pageKey }));
        if (team === undefined) return undefined;
        teams.push(team);
      }
      return { total: index.total, items: teams };
    },
  set:
    (options) =>
    ({ get, set, reset }, newTeams) => {
      if (newTeams === undefined || newTeams instanceof DefaultValue) {
        reset(preprintComplianceIndexState(options));
      } else if (newTeams instanceof Error) {
        set(preprintComplianceIndexState(options), newTeams);
      } else {
        const pageKey = JSON.stringify({
          currentPage: options.currentPage,
          pageSize: options.pageSize,
          sort: options.sort,
          tags: options.tags,
          timeRange: options.timeRange,
        });

        // Set new data - no need to clear since each page gets its own unique key
        newTeams?.items.forEach((team) =>
          set(
            preprintComplianceListState({ teamId: team.objectID, pageKey }),
            team,
          ),
        );
        const newIndex = {
          total: newTeams.total,
          ids: newTeams.items.map((team) => team.objectID),
        };
        set(preprintComplianceIndexState(options), newIndex);
      }
    },
});

export const useAnalyticsPreprintCompliance = (
  options: PreprintComplianceOptions,
) => {
  const opensearchClient =
    useAnalyticsOpensearch<PreprintComplianceOpensearchResponse>(
      'preprint-compliance',
    ).client;

  // Convert options to match the state type
  const stateOptions: PreprintComplianceStateOptionKeyData = {
    currentPage: options.currentPage,
    pageSize: options.pageSize,
    sort: options.sort,
    tags: options.tags,
    timeRange: options.timeRange as Extract<
      TimeRangeOption,
      'all' | 'last-year'
    >,
  };

  const [preprintCompliance, setPreprintCompliance] = useRecoilState(
    preprintComplianceState(stateOptions),
  );

  if (preprintCompliance === undefined) {
    throw getPreprintCompliance(opensearchClient, options)
      .then((data) => {
        setPreprintCompliance(data);
      })
      .catch(setPreprintCompliance);
  }
  if (preprintCompliance instanceof Error) {
    throw preprintCompliance;
  }

  return {
    ...preprintCompliance,
  };
};
