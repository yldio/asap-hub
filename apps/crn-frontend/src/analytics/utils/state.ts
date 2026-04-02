import { atomFamily, RecoilState, useRecoilState } from 'recoil';
import { AnalyticsPerformanceOptions } from '@asap-hub/algolia';

import { useAnalyticsOpensearch } from '../../hooks/opensearch';
import { OpensearchClient } from './opensearch';

export const makePerformanceState = <T>(key: string) =>
  atomFamily<T | undefined, AnalyticsPerformanceOptions>({
    key,
    default: undefined,
  });

/**
 *  Fetch performance metrics from Opensearch
 */
export const makeFlagBasedPerformanceHook =
  <T>(
    state: (p: AnalyticsPerformanceOptions) => RecoilState<T | undefined>,
    get: (
      client: OpensearchClient<T>,
      options: AnalyticsPerformanceOptions,
    ) => Promise<T | undefined>,
    opensearchIndex:
      | 'user-productivity-performance'
      | 'team-productivity-performance'
      | 'user-collaboration-performance'
      | 'team-collaboration-performance'
      | 'presenter-representation-performance',
  ) =>
  (options: AnalyticsPerformanceOptions) => {
    const opensearchClient = useAnalyticsOpensearch<T>(opensearchIndex);

    const [performance, setPerformance] = useRecoilState(state(options));

    if (performance === undefined) {
      throw get(opensearchClient.client, options)
        .then(setPerformance)
        .catch(setPerformance);
    }

    if (performance instanceof Error) {
      throw performance;
    }
    return performance;
  };
