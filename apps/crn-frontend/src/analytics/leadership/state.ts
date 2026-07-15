import {
  normalizeListOptions,
  nullOnUndefined,
  withEmptyListFallback,
} from '@asap-hub/frontend-utils';
import {
  AnalyticsTeamLeadershipResponse,
  ListAnalyticsTeamLeadershipResponse,
  ListOSChampionOpensearchResponse,
  OSChampionOpensearchResponse,
  SortLeadershipAndMembership,
  SortOSChampion,
} from '@asap-hub/model';
import { useSuspenseQuery } from '@tanstack/react-query';
import { AnalyticsSearchOptionsWithFiltering } from '../utils/analytics-options';
import {
  AnalyticsSearchOptions,
  getAnalyticsLeadership,
  AnalyticsSearchOptionsWithSort,
  getAnalyticsOSChampion,
} from './api';
import { OpensearchIndex } from '../utils/opensearch/types';
import { useAnalyticsOpensearch } from '../../hooks';

type Options = AnalyticsSearchOptions & {
  sort: SortLeadershipAndMembership;
};

type OSOptions = AnalyticsSearchOptionsWithFiltering<SortOSChampion>;
type StateOptionKeyData = Pick<
  Options,
  'currentPage' | 'pageSize' | 'sort' | 'tags' | 'metric'
>;

type OSStateOptionKeyData = Pick<
  OSOptions,
  'currentPage' | 'pageSize' | 'sort' | 'tags' | 'timeRange'
>;

export const leadershipQueryKeys = {
  all: ['analytics-leadership'] as const,
  lists: () => [...leadershipQueryKeys.all, 'list'] as const,
  // Cache identity deliberately excludes timeRange.
  list: (options: StateOptionKeyData) =>
    [...leadershipQueryKeys.lists(), normalizeListOptions(options)] as const,
};

export const osChampionQueryKeys = {
  all: ['analytics-os-champion'] as const,
  lists: () => [...osChampionQueryKeys.all, 'list'] as const,
  list: (options: OSStateOptionKeyData) =>
    [...osChampionQueryKeys.lists(), normalizeListOptions(options)] as const,
};

export const useAnalyticsLeadership = (
  options: Options,
): ListAnalyticsTeamLeadershipResponse => {
  const opensearchIndex: OpensearchIndex =
    options.metric === 'interest-group' ? 'ig-leadership' : 'wg-leadership';
  const opensearchClient =
    useAnalyticsOpensearch<AnalyticsTeamLeadershipResponse>(
      opensearchIndex,
    ).client;

  const { currentPage, pageSize, sort, tags, metric } = options;
  return useSuspenseQuery({
    queryKey: leadershipQueryKeys.list({
      currentPage,
      pageSize,
      sort,
      tags,
      metric,
    }),
    queryFn: () =>
      withEmptyListFallback(
        () =>
          nullOnUndefined(() =>
            getAnalyticsLeadership(
              opensearchClient,
              options as AnalyticsSearchOptionsWithSort,
            ),
          ),
        { total: 0, items: [] },
      ),
  }).data as ListAnalyticsTeamLeadershipResponse;
};

export const useAnalyticsOSChampion = (
  options: OSOptions,
): ListOSChampionOpensearchResponse => {
  const opensearchClient =
    useAnalyticsOpensearch<OSChampionOpensearchResponse>('os-champion').client;

  const { currentPage, pageSize, sort, tags, timeRange } = options;
  return useSuspenseQuery({
    queryKey: osChampionQueryKeys.list({
      currentPage,
      pageSize,
      sort,
      tags,
      timeRange,
    }),
    queryFn: () =>
      withEmptyListFallback(
        () =>
          nullOnUndefined(() =>
            getAnalyticsOSChampion(opensearchClient, options),
          ),
        { total: 0, items: [] },
      ),
  }).data as ListOSChampionOpensearchResponse;
};
