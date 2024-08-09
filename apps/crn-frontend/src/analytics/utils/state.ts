import { atomFamily, RecoilState, useRecoilState } from 'recoil';
import { AlgoliaClient, AnalyticsPerformanceOptions } from '@asap-hub/algolia';
import { AnalyticsSortOptions, Metric } from '@asap-hub/model';

import { useAnalyticsAlgolia } from '../../hooks/algolia';
import { ANALYTICS_ALGOLIA_INDEX } from '../../config';

export const makePerformanceState = <T>(key: string) =>
  atomFamily<T | undefined, AnalyticsPerformanceOptions>({
    key,
    default: undefined,
  });

export const makePerformanceHook =
  <T>(
    state: (p: AnalyticsPerformanceOptions) => RecoilState<T | undefined>,
    get: (
      client: AlgoliaClient<'analytics'>,
      options: AnalyticsPerformanceOptions,
    ) => Promise<T | undefined>,
  ) =>
  (options: AnalyticsPerformanceOptions) => {
    const algoliaClient = useAnalyticsAlgolia(ANALYTICS_ALGOLIA_INDEX);
    const [performance, setPerformance] = useRecoilState(state(options));
    if (performance === undefined) {
      throw get(algoliaClient.client, options)
        .then(setPerformance)
        .catch(setPerformance);
    }
    if (performance instanceof Error) {
      throw performance;
    }
    return performance;
  };

export const getAlgoliaIndexName = (
  sort: AnalyticsSortOptions,
  metric: Metric,
) => {
  let indexName;
  switch (metric) {
    case 'team-collaboration':
    case 'team-productivity':
      indexName =
        sort === 'team_asc'
          ? ANALYTICS_ALGOLIA_INDEX
          : `${ANALYTICS_ALGOLIA_INDEX}_team_${sort.replace('team_', '')}`;
      break;
    case 'user-collaboration':
    case 'user-productivity':
      indexName =
        sort === 'user_asc'
          ? ANALYTICS_ALGOLIA_INDEX
          : `${ANALYTICS_ALGOLIA_INDEX}_user_${sort.replace('user_', '')}`;
      break;
    case 'team-leadership':
      indexName =
        sort === 'team_asc'
          ? ANALYTICS_ALGOLIA_INDEX
          : `${ANALYTICS_ALGOLIA_INDEX}_${sort}`;
      break;
    default:
      indexName = ANALYTICS_ALGOLIA_INDEX;
  }

  return indexName;
};
