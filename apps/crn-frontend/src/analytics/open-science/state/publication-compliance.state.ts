import { AnalyticsSearchOptionsWithFiltering } from '@asap-hub/algolia';
import {
  ListPublicationComplianceOpensearchResponse,
  PublicationComplianceOpensearchResponse,
  SortPublicationCompliance,
  TimeRangeOption,
} from '@asap-hub/model';
import {
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
} from 'recoil';
import { getPublicationCompliance } from '../api';
import { useAnalyticsOpensearch } from '../../../hooks';

type PublicationComplianceOptions =
  AnalyticsSearchOptionsWithFiltering<SortPublicationCompliance>;

type PublicationComplianceStateOptionKeyData = Pick<
  PublicationComplianceOptions,
  'currentPage' | 'pageSize' | 'sort' | 'tags'
> & { timeRange: Extract<TimeRangeOption, 'all' | 'last-year'> };
const publicationComplianceIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  PublicationComplianceStateOptionKeyData
>({
  key: 'analyticsPublicationComplianceIndex',
  default: undefined,
});

export const publicationComplianceListState = atomFamily<
  PublicationComplianceOpensearchResponse | undefined,
  { teamId: string; pageKey: string }
>({
  key: 'analyticsPublicationComplianceList',
  default: undefined,
});

export const publicationComplianceState = selectorFamily<
  ListPublicationComplianceOpensearchResponse | Error | undefined,
  PublicationComplianceStateOptionKeyData
>({
  key: 'publicationCompliance',
  get:
    (options) =>
    ({ get }) => {
      const index = get(publicationComplianceIndexState(options));
      if (index === undefined || index instanceof Error) return index;
      const teams: PublicationComplianceOpensearchResponse[] = [];
      const pageKey = JSON.stringify({
        currentPage: options.currentPage,
        pageSize: options.pageSize,
        sort: options.sort,
        tags: options.tags,
        timeRange: options.timeRange ?? 'all',
      });
      for (const id of index.ids) {
        const team = get(
          publicationComplianceListState({ teamId: id, pageKey }),
        );
        if (team === undefined) return undefined;
        teams.push(team);
      }
      return { total: index.total, items: teams };
    },
  set:
    (options) =>
    ({ get, set, reset }, newTeams) => {
      if (newTeams === undefined || newTeams instanceof DefaultValue) {
        reset(publicationComplianceIndexState(options));
      } else if (newTeams instanceof Error) {
        set(publicationComplianceIndexState(options), newTeams);
      } else {
        const pageKey = JSON.stringify({
          currentPage: options.currentPage,
          pageSize: options.pageSize,
          sort: options.sort,
          tags: options.tags,
          timeRange: options.timeRange ?? 'all',
        });

        // Set new data - no need to clear since each page gets its own unique key
        newTeams?.items.forEach((team) =>
          set(
            publicationComplianceListState({ teamId: team.objectID, pageKey }),
            team,
          ),
        );
        const newIndex = {
          total: newTeams.total,
          ids: newTeams.items.map((team) => team.objectID),
        };
        set(publicationComplianceIndexState(options), newIndex);
      }
    },
});

export const useAnalyticsPublicationCompliance = (
  options: PublicationComplianceOptions,
) => {
  const opensearchClient =
    useAnalyticsOpensearch<PublicationComplianceOpensearchResponse>(
      'publication-compliance',
    ).client;

  // Convert options to match the state type
  const stateOptions: PublicationComplianceStateOptionKeyData = {
    currentPage: options.currentPage,
    pageSize: options.pageSize,
    sort: options.sort,
    tags: options.tags,
    timeRange: (options.timeRange ?? 'all') as Extract<
      TimeRangeOption,
      'all' | 'last-year'
    >,
  };

  const [publicationCompliance, setPublicationCompliance] = useRecoilState(
    publicationComplianceState(stateOptions),
  );

  if (publicationCompliance === undefined) {
    throw getPublicationCompliance(opensearchClient, options)
      .then((data) => {
        setPublicationCompliance(data);
      })
      .catch(setPublicationCompliance);
  }
  if (publicationCompliance instanceof Error) {
    throw publicationCompliance;
  }

  return {
    ...publicationCompliance,
  };
};
