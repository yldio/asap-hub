import { normalizeListOptions } from '@asap-hub/frontend-utils';
import { skipToken, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { AnalyticsPerformanceOptions } from './analytics-options';

import { useAnalyticsOpensearch } from '../../hooks/opensearch';
import { OpensearchClient, OpensearchIndex } from './opensearch';

/**
 * Performance-metrics query factory.
 *
 * Each of the five performance endpoints (team/user collaboration,
 * engagement, team/user productivity) gets one instantiation providing:
 * - `useSuspenseHook(getFn, opensearchIndex)`: the suspending fetch hook.
 * - `useValueHook`: a non-suspending, non-fetching read of the same cache
 *   entry — it only surfaces whatever the suspense sibling has populated.
 */
export const makePerformanceQuery = <T>(scope: string) => {
  const keys = {
    all: ['analytics-performance', scope] as const,
    detail: (options: AnalyticsPerformanceOptions) =>
      [...keys.all, normalizeListOptions(options)] as const,
  };

  const useSuspenseHook = (
    get: (
      client: OpensearchClient<T>,
      options: AnalyticsPerformanceOptions,
    ) => Promise<T | undefined>,
    opensearchIndex: OpensearchIndex,
  ) => {
    const usePerformance = (options: AnalyticsPerformanceOptions): T => {
      const opensearchClient = useAnalyticsOpensearch<T>(opensearchIndex);

      // a queryFn must never return undefined — cache `null` and surface
      // `data` as `T`
      return useSuspenseQuery({
        queryKey: keys.detail(options),
        queryFn: async () =>
          (await get(opensearchClient.client, options)) ?? null,
      }).data as T;
    };
    return usePerformance;
  };

  const useValueHook = (
    options: AnalyticsPerformanceOptions,
  ): T | undefined => {
    // `skipToken` disables fetching; `data` is whatever the suspense
    // sibling wrote (`undefined` while still pending).
    const { data } = useQuery<T | null, Error, T | null>({
      queryKey: keys.detail(options),
      queryFn: skipToken,
    });
    return data ?? undefined;
  };

  return { useSuspenseHook, useValueHook };
};
