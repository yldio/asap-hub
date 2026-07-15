import {
  normalizeListOptions,
  nullOnUndefined,
  withEmptyListFallback,
} from '@asap-hub/frontend-utils';
import {
  ListPreprintComplianceOpensearchResponse,
  PreprintComplianceOpensearchResponse,
  SortPreprintCompliance,
  TimeRangeOption,
} from '@asap-hub/model';
import { useSuspenseQuery } from '@tanstack/react-query';
import { AnalyticsSearchOptionsWithFiltering } from '../../utils/analytics-options';
import { getPreprintCompliance } from '../api';
import { useAnalyticsOpensearch } from '../../../hooks';

type PreprintComplianceOptions =
  AnalyticsSearchOptionsWithFiltering<SortPreprintCompliance>;

type PreprintComplianceStateOptionKeyData = Pick<
  PreprintComplianceOptions,
  'currentPage' | 'pageSize' | 'sort' | 'tags'
> & { timeRange: Extract<TimeRangeOption, 'all' | 'last-year'> };

export const preprintComplianceQueryKeys = {
  all: ['analytics-preprint-compliance'] as const,
  lists: () => [...preprintComplianceQueryKeys.all, 'list'] as const,
  // Cache identity uses these option fields, timeRange normalized to 'all'.
  list: (options: PreprintComplianceStateOptionKeyData) =>
    [
      ...preprintComplianceQueryKeys.lists(),
      normalizeListOptions(options),
    ] as const,
};

export const useAnalyticsPreprintCompliance = (
  options: PreprintComplianceOptions,
): ListPreprintComplianceOpensearchResponse => {
  const opensearchClient =
    useAnalyticsOpensearch<PreprintComplianceOpensearchResponse>(
      'preprint-compliance',
    ).client;

  // Convert options to match the state key type
  const stateOptions: PreprintComplianceStateOptionKeyData = {
    currentPage: options.currentPage,
    pageSize: options.pageSize,
    sort: options.sort,
    tags: options.tags,
    timeRange: (options.timeRange ?? 'all') as Extract<
      TimeRangeOption,
      'all' | 'last-year'
    >,
  };

  const { data } = useSuspenseQuery({
    queryKey: preprintComplianceQueryKeys.list(stateOptions),
    queryFn: () =>
      withEmptyListFallback(
        () =>
          nullOnUndefined(() =>
            getPreprintCompliance(opensearchClient, options),
          ),
        { total: 0, items: [] },
      ),
  });
  return data as ListPreprintComplianceOpensearchResponse;
};
