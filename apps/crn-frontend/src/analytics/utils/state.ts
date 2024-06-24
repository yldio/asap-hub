import { atomFamily, RecoilState, useRecoilState } from 'recoil';
import { TimeRangeOption } from '@asap-hub/model';
import { AlgoliaClient } from '@asap-hub/algolia';

import { useAnalyticsAlgolia } from '../../hooks/algolia';
import { ANALYTICS_ALGOLIA_INDEX } from '../../config';

export const makePerformanceState = <T>(key: string) =>
  atomFamily<T | undefined, string>({
    key,
    default: undefined,
  });

// useTeamCollaborationPerformance

export const makePerformanceHook =
  <T>(
    state: (p: TimeRangeOption) => RecoilState<T | undefined>,
    get: (
      client: AlgoliaClient<'analytics'>,
      p: TimeRangeOption,
    ) => Promise<T | undefined>,
  ) =>
  (timeRange: TimeRangeOption) => {
    const algoliaClient = useAnalyticsAlgolia(ANALYTICS_ALGOLIA_INDEX);
    const [performance, setPerformance] = useRecoilState(state(timeRange));
    if (performance === undefined) {
      throw get(algoliaClient.client, timeRange)
        .then(setPerformance)
        .catch(setPerformance);
    }
    if (performance instanceof Error) {
      throw performance;
    }
    return performance;
  };
