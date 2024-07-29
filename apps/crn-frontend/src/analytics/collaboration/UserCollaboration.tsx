import {
  CollaborationType,
  SortUserCollaboration,
  userCollaborationInitialSortingDirection,
  UserCollaborationPerformance,
  UserCollaborationResponse,
  UserCollaborationSortingDirection,
} from '@asap-hub/model';
import {
  UserCollaborationMetric,
  UserCollaborationTable,
} from '@asap-hub/react-components';
import { Dispatch, SetStateAction, useState } from 'react';
import { useAnalytics, usePagination, usePaginationParams } from '../../hooks';
import {
  useAnalyticsUserCollaboration,
  useUserCollaborationPerformance,
} from './state';

const getDataForType = (
  data: UserCollaborationResponse[],
  type: 'within-team' | 'across-teams',
): UserCollaborationMetric[] => {
  if (type === 'within-team') {
    return data.map((row) => ({
      id: row.id,
      name: row.name,
      isAlumni: !!row.alumniSince,
      teams: row.teams.map((team) => ({
        id: team.id,
        team: team.team,
        role: team.role,
        isTeamInactive: !!team.teamInactiveSince,
        outputsCoAuthored: team.outputsCoAuthoredWithinTeam,
      })),
    }));
  }
  return data.map((row) => ({
    id: row.id,
    name: row.name,
    isAlumni: !!row.alumniSince,
    teams: row.teams.map((team) => ({
      id: team.id,
      team: team.team,
      role: team.role,
      isTeamInactive: !!team.teamInactiveSince,
      outputsCoAuthored: team.outputsCoAuthoredAcrossTeams,
    })),
  }));
};
const getPerformanceForType = (
  performance: UserCollaborationPerformance,
  type: 'within-team' | 'across-teams',
) => {
  if (type === 'within-team') {
    return performance.withinTeam;
  }
  return performance.acrossTeam;
};

export interface CollaborationProps<T = SortUserCollaboration> {
  sort: T;
  setSort: Dispatch<SetStateAction<T>>;
  type: CollaborationType;
  tags: string[];
}

const UserCollaboration: React.FC<CollaborationProps> = ({
  sort,
  setSort,
  type,
  tags,
}) => {
  const { currentPage, pageSize } = usePaginationParams();

  const { timeRange, documentCategory } = useAnalytics();

  const [sortingDirection, setSortingDirection] =
    useState<UserCollaborationSortingDirection>(
      userCollaborationInitialSortingDirection,
    );

  const { items: data, total } = useAnalyticsUserCollaboration({
    currentPage,
    documentCategory,
    pageSize,
    sort,
    tags,
    timeRange,
  });

  const performance = useUserCollaborationPerformance({
    timeRange,
    documentCategory,
  });

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  return (
    <UserCollaborationTable
      currentPageIndex={currentPage}
      data={getDataForType(data, type)}
      numberOfPages={numberOfPages}
      performance={getPerformanceForType(performance, type)}
      renderPageHref={renderPageHref}
      sort={sort}
      setSort={setSort}
      sortingDirection={sortingDirection}
      setSortingDirection={setSortingDirection}
      type={type}
    />
  );
};

export default UserCollaboration;
