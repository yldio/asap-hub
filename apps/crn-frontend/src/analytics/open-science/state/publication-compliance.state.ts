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
  // The recoil family was keyed by this Pick of the options with timeRange
  // normalized to 'all' — keep the same key surface so cache identity is
  // unchanged.
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
        // getPublicationCompliance is typed `| undefined`; a queryFn must
        // never return undefined — cache `null` (recoil would have re-thrown
        // forever on undefined; unreachable in practice).
        return (
          (await getPublicationCompliance(opensearchClient, options)) ?? null
        );
      } catch (error) {
        // Preserved from the recoil hook's `.catch(setPublicationCompliance)`:
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
  return data as ListPublicationComplianceOpensearchResponse;
};
