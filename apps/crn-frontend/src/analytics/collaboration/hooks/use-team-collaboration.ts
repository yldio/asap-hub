import { SortTeamCollaboration } from '@asap-hub/model';
import { AnalyticsSearchOptionsWithFiltering } from '@asap-hub/algolia';
import { useTeamCollaborationQuery } from './use-team-collaboration-query';

export const useTeamCollaboration = (
  options: AnalyticsSearchOptionsWithFiltering<SortTeamCollaboration>,
) => {
  const { data, isLoading, isError, error } =
    useTeamCollaborationQuery(options);

  return {
    data: data?.items || null,
    total: data?.total || 0,
    isLoading,
    isError,
    error: error as Error | null,
  };
};
