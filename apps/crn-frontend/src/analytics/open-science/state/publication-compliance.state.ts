import { normalizeListOptions } from '@asap-hub/frontend-utils';
import {
  ListPublicationComplianceOpensearchResponse,
  PublicationComplianceOpensearchResponse,
  SortPublicationCompliance,
  TimeRangeOption,
} from '@asap-hub/model';
import { useSuspenseQuery } from '@tanstack/react-query';
import { AnalyticsSearchOptionsWithFiltering } from '../../utils/analytics-options';
import { getPublicationCompliance } from '../api';
import { useAnalyticsOpensearch } from '../../../hooks';

type PublicationComplianceOptions =
  AnalyticsSearchOptionsWithFiltering<SortPublicationCompliance>;

type PublicationComplianceStateOptionKeyData = Pick<
  PublicationComplianceOptions,
  'currentPage' | 'pageSize' | 'sort' | 'tags'
> & { timeRange: Extract<TimeRangeOption, 'all' | 'last-year'> };

export const publicationComplianceQueryKeys = {
  all: ['analytics-publication-compliance'] as const,
  lists: () => [...publicationComplianceQueryKeys.all, 'list'] as const,
  // Cache identity uses these option fields, timeRange normalized to 'all'.
  list: (options: PublicationComplianceStateOptionKeyData) =>
    [
      ...publicationComplianceQueryKeys.lists(),
      normalizeListOptions(options),
    ] as const,
};

export const useAnalyticsPublicationCompliance = (
  options: PublicationComplianceOptions,
): ListPublicationComplianceOpensearchResponse => {
  const opensearchClient =
    useAnalyticsOpensearch<PublicationComplianceOpensearchResponse>(
      'publication-compliance',
    ).client;

  // Convert options to match the state key type
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

  const { data } = useSuspenseQuery({
    queryKey: publicationComplianceQueryKeys.list(stateOptions),
    queryFn: async () => {
      try {
        // a queryFn must never return undefined — cache `null` instead
        return (
          (await getPublicationCompliance(opensearchClient, options)) ?? null
        );
      } catch (error) {
        // Errors re-throw to the error boundary; non-Error rejections
        // become an empty list.
        if (error instanceof Error) {
          throw error;
        }
        return { total: 0, items: [] };
      }
    },
  });
  return data as ListPublicationComplianceOpensearchResponse;
};
