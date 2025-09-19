import {
  OutputTypeOption,
  TeamCollaborationPerformance,
  TimeRangeOption,
} from '@asap-hub/model';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useAnalyticsAlgolia } from '../../../hooks/algolia';
import { getTeamCollaborationPerformance } from '../api';

export interface UseTeamCollaborationPerformanceQueryOptions {
  timeRange?: TimeRangeOption;
  outputType?: OutputTypeOption;
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
}

export const useTeamCollaborationPerformanceQuery = (
  options: UseTeamCollaborationPerformanceQueryOptions = {},
) => {
  const { client } = useAnalyticsAlgolia();

  const queryOptions: UseQueryOptions<TeamCollaborationPerformance, Error> = {
    queryKey: ['team-collaboration-performance'],
    queryFn: async () => {
      const result = await getTeamCollaborationPerformance(client, {
        timeRange: options.timeRange ?? 'all',
        outputType: options.outputType,
      });

      if (!result) {
        throw new Error('Failed to fetch team collaboration performance');
      }
      return result;
    },
    enabled: options.enabled ?? true,
    staleTime: options.staleTime ?? 5 * 60 * 1000, // 5 minutes
    cacheTime: options.cacheTime ?? 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, 30000),
  };

  return useQuery(queryOptions);
};
