import {
  useTeamCollaborationPerformanceQuery,
  UseTeamCollaborationPerformanceQueryOptions,
} from './use-team-collaboration-performance-query';
import {
  useTeamCollaborationPerformanceStore,
  selectPerformance,
  TeamCollaborationPerformanceState,
} from '../stores/team-collaboration-performance.store';

/**
 * Combined hook that integrates React Query with Zustand for team collaboration performance
 *
 * This hook provides:
 * - Server state management via React Query (caching, background updates, etc.)
 * - Client state management via Zustand (optimistic updates, local state)
 * - Clean separation of concerns
 *
 * Benefits over Recoil:
 * - Better caching and background updates
 * - Simpler state management
 * - Better TypeScript support
 * - Smaller bundle size
 * - More predictable state updates
 */
export const useTeamCollaborationPerformanceZustand = (
  options: UseTeamCollaborationPerformanceQueryOptions = {},
) => {
  // React Query handles all server state (loading, errors, data, refetching)
  const query = useTeamCollaborationPerformanceQuery(options);

  // Zustand only handles client state (optimistic updates, local state)
  const optimisticPerformance =
    useTeamCollaborationPerformanceStore(selectPerformance);
  const setOptimisticPerformance = useTeamCollaborationPerformanceStore(
    (state: TeamCollaborationPerformanceState) => state.setPerformance,
  );
  const resetOptimisticState = useTeamCollaborationPerformanceStore(
    (state: TeamCollaborationPerformanceState) => state.reset,
  );

  // Use server data as source of truth, fallback to optimistic state
  const performance = query.data || optimisticPerformance;

  // Return React Query state with Zustand for optimistic updates
  return {
    // Data (server data takes precedence)
    performance,

    // Server state (handled by React Query)
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    isRefetching: query.isRefetching,

    // Actions
    refetch: query.refetch,

    // Optimistic updates (handled by Zustand)
    setOptimisticPerformance,
    resetOptimisticState,

    // Metadata
    dataUpdatedAt: query.dataUpdatedAt,
    errorUpdatedAt: query.errorUpdatedAt,
  };
};
