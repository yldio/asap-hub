import { normalizeListOptions } from '@asap-hub/frontend-utils';
import { skipToken, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { AnalyticsPerformanceOptions } from './analytics-options';

import { useAnalyticsOpensearch } from '../../hooks/opensearch';
import { OpensearchClient, OpensearchIndex } from './opensearch';

/**
 * Performance-metrics query factory (R11).
 *
 * Each of the five performance endpoints (team/user collaboration,
 * engagement, team/user productivity) gets one instantiation providing:
 * - `keys`: a query-key factory namespaced by `scope`.
 * - `useSuspenseHook(getFn, opensearchIndex)`: the suspending fetch hook
 *   (replaces the Pattern-B `makeFlagBasedPerformanceHook`).
 * - `useValueHook`: a NON-suspending, non-fetching read of the same cache
 *   entry (replaces the Pattern-D `use*PerformanceValue` Loadable read).
 *   It never issues its own request — it only surfaces whatever the suspense
 *   sibling has populated, exactly like the recoil Loadable read.
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

      // The recoil hook stored the fetched value in an atom and, after the
      // `if (=== undefined) throw` branch, returned it narrowed to `T`
      // (a `getFn` resolving `undefined` re-threw forever). Preserve that:
      // cache `null` when `getFn` resolves undefined (a queryFn must never
      // return undefined) and surface `data` as `T`.
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
    // Non-fetching read: mirrors the recoil `useRecoilValueLoadable` site,
    // which read the atom the suspense hook filled and returned `undefined`
    // until then. `skipToken` disables the query so it never fetches on its
    // own; `data` is whatever the suspense sibling wrote (`undefined` while
    // still pending).
    const { data } = useQuery<T | null, Error, T | null>({
      queryKey: keys.detail(options),
      queryFn: skipToken,
    });
    return data ?? undefined;
  };

  return { keys, useSuspenseHook, useValueHook };
};
