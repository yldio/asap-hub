import { atomFamily, RecoilState, useRecoilState } from 'recoil';
import { AlgoliaClient, AnalyticsPerformanceOptions } from '@asap-hub/algolia';

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
