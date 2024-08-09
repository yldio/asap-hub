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
  let indexName = ANALYTICS_ALGOLIA_INDEX;
  switch (metric) {
    case 'team-collaboration':
    case 'team-productivity':
      if (sort !== 'team_asc')
        indexName = `${ANALYTICS_ALGOLIA_INDEX}_team_${sort.replace(
          'team_',
          '',
        )}`;
      break;
    case 'user-collaboration':
    case 'user-productivity':
      if (sort !== 'user_asc')
        indexName = `${ANALYTICS_ALGOLIA_INDEX}_user_${sort.replace(
          'user_',
          '',
        )}`;
      break;
    case 'team-leadership':
    case 'engagement':
      if (sort !== 'team_asc') indexName = `${ANALYTICS_ALGOLIA_INDEX}_${sort}`;
      break;
  }

  return indexName;
};
