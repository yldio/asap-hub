import {
  SortTeamCollaboration,
  TeamCollaborationResponse,
  TeamCollaborationSortingDirection,
} from '@asap-hub/model';
import {
  LoadingContentBodyTable,
  TeamCollaborationMetric,
  TeamCollaborationTable,
} from '@asap-hub/react-components';
import { FC, Suspense } from 'react';
import { useAnalytics, usePagination, usePaginationParams } from '../../hooks';
import { useTeamCollaborationPerformanceZustand } from './hooks/use-team-collaboration-performance';
import { useTeamCollaboration } from './hooks/use-team-collaboration';
// import {
//   useAnalyticsTeamCollaboration,
//   useTeamCollaborationPerformance,
// } from './state';
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

const TeamCollaborationContent: FC<
  CollaborationProps<SortTeamCollaboration, TeamCollaborationSortingDirection>
> = ({ sort, setSort, setSortingDirection, sortingDirection, type, tags }) => {
  const { currentPage, pageSize } = usePaginationParams();
  const { timeRange, outputType } = useAnalytics();
  // const { items: data, total } = useAnalyticsTeamCollaboration({
  //   currentPage,
  //   outputType,
  //   pageSize,
  //   sort,
  //   tags,
  //   timeRange,
  // });
  const {
    data,
    total,
    isLoading: isDataLoading,
    isError: isDataError,
    error: dataError,
  } = useTeamCollaboration({
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

  if (isError || isDataError) {
    return <div>Error: {error?.message || dataError?.message}</div>;
  }

  if (isLoading || isDataLoading || !performanceData || !data) {
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

const TeamCollaboration: FC<
  CollaborationProps<SortTeamCollaboration, TeamCollaborationSortingDirection>
> = (props) => (
  <Suspense fallback={<LoadingContentBodyTable />}>
    <TeamCollaborationContent {...props} />
  </Suspense>
);

export default TeamCollaboration;
