import { normalizeListOptions } from '@asap-hub/frontend-utils';
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
  // The recoil family was keyed by this Pick of the options with timeRange
  // normalized to 'all' — keep the same key surface so cache identity is
  // unchanged.
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
    queryFn: async () => {
      try {
        // getPreprintCompliance is typed `| undefined`; a queryFn must never
        // return undefined — cache `null` (recoil would have re-thrown
        // forever on undefined; unreachable in practice).
        return (await getPreprintCompliance(opensearchClient, options)) ?? null;
      } catch (error) {
        // Preserved from the recoil hook's `.catch(setPreprintCompliance)`:
        // an Error rejection was cached and re-thrown to the error boundary,
        // while a non-Error rejection was swallowed. Map non-Errors to an
        // empty list.
        if (error instanceof Error) {
          throw error;
        }
        return { total: 0, items: [] };
      }
    },
  });
  return data as ListPreprintComplianceOpensearchResponse;
};
