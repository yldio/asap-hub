import {
  SortTeamCollaboration,
  TeamCollaborationResponse,
  TeamCollaborationSortingDirection,
} from '@asap-hub/model';
import {
  TeamCollaborationMetric,
  TeamCollaborationTable,
} from '@asap-hub/react-components';
import { useAnalytics, usePagination, usePaginationParams } from '../../hooks';
import { useTeamCollaborationPerformanceZustand } from './hooks/use-team-collaboration-performance';
import {
  useAnalyticsTeamCollaboration,
  // useTeamCollaborationPerformance,
} from './state';
import { CollaborationProps } from './UserCollaboration';

const getDataForType = (
  data: TeamCollaborationResponse[],
  type: 'within-team' | 'across-teams',
): TeamCollaborationMetric[] => {
  if (type === 'within-team') {
    return data.map((row) => ({
      id: row.id,
      name: row.name,
      isInactive: !!row.inactiveSince,
      ...row.outputsCoProducedWithin,
      collaborationByTeam: [],
    }));
  }
  return data.map((row) => ({
    id: row.id,
    name: row.name,
    isInactive: !!row.inactiveSince,
    ...row.outputsCoProducedAcross.byDocumentType,
    collaborationByTeam: row.outputsCoProducedAcross.byTeam,
  }));
};

const TeamCollaboration: React.FC<
  CollaborationProps<SortTeamCollaboration, TeamCollaborationSortingDirection>
> = ({ sort, setSort, setSortingDirection, sortingDirection, type, tags }) => {
  const { currentPage, pageSize } = usePaginationParams();
  const { timeRange, outputType } = useAnalytics();

  const { items: data, total } = useAnalyticsTeamCollaboration({
    currentPage,
    outputType,
    pageSize,
    sort,
    tags,
    timeRange,
  });

  // const performance = useTeamCollaborationPerformance({
  //   timeRange,
  //   outputType,
  // });

  const {
    performance: performanceData,
    isLoading,
    isError,
    error,
    // isFetching,
    // refetch,
    // dataUpdatedAt,
    // setOptimisticPerformance,
    // resetOptimisticState,
  } = useTeamCollaborationPerformanceZustand({
    timeRange,
    outputType,
  });

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  if (isLoading || !performanceData) {
    return <div>Loading...</div>;
  }

  return (
    <TeamCollaborationTable
      currentPageIndex={currentPage}
      data={getDataForType(data, type)}
      numberOfPages={numberOfPages}
      performance={
        type === 'within-team'
          ? performanceData.withinTeam
          : performanceData.acrossTeam
      }
      renderPageHref={renderPageHref}
      setSort={setSort}
      setSortingDirection={setSortingDirection}
      sort={sort}
      sortingDirection={sortingDirection}
      type={type}
    />
  );
};

export default TeamCollaboration;
