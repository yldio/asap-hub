import {
  SortTeamCollaboration,
  teamCollaborationInitialSortingDirection,
  TeamCollaborationResponse,
  TeamCollaborationSortingDirection,
} from '@asap-hub/model';
import {
  TeamCollaborationMetric,
  TeamCollaborationTable,
} from '@asap-hub/react-components';
import { useState } from 'react';
import { useAnalytics, usePagination, usePaginationParams } from '../../hooks';
import {
  useAnalyticsTeamCollaboration,
  useTeamCollaborationPerformance,
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
      type: 'within-team',
    }));
  }
  return data.map((row) => ({
    id: row.id,
    name: row.name,
    isInactive: !!row.inactiveSince,
    ...row.outputsCoProducedAcross.byDocumentType,
    collaborationByTeam: row.outputsCoProducedAcross.byTeam,
    type: 'across-teams',
  }));
};

const TeamCollaboration: React.FC<
  CollaborationProps<SortTeamCollaboration>
> = ({ sort, setSort, type, tags }) => {
  const { currentPage, pageSize } = usePaginationParams();
  const { timeRange, outputType } = useAnalytics();

  const [sortingDirection, setSortingDirection] =
    useState<TeamCollaborationSortingDirection>(
      teamCollaborationInitialSortingDirection,
    );

  const { items: data, total } = useAnalyticsTeamCollaboration({
    currentPage,
    outputType,
    pageSize,
    sort,
    tags,
    timeRange,
  });

  const performance = useTeamCollaborationPerformance({
    timeRange,
    outputType,
  });

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  return (
    <TeamCollaborationTable
      currentPageIndex={currentPage}
      data={getDataForType(data, type)}
      numberOfPages={numberOfPages}
      performance={
        type === 'within-team' ? performance.withinTeam : performance.acrossTeam
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
