import {
  initialSortingDirection,
  LeadershipAndMembershipSortingDirection,
  SortLeadershipAndMembership,
} from '@asap-hub/model';
import { LeadershipMembershipTable } from '@asap-hub/react-components';
import { Dispatch, SetStateAction, useState } from 'react';
import { usePagination, usePaginationParams } from '../../hooks';
import { useAnalyticsLeadership } from './state';

export type TeamLeadershipMetricOption = 'working-group' | 'interest-group';

type MetricResponse = {
  id: string;
  displayName: string;
  inactiveSince?: string;
  workingGroupLeadershipRoleCount: number;
  workingGroupPreviousLeadershipRoleCount: number;
  workingGroupMemberCount: number;
  workingGroupPreviousMemberCount: number;

  interestGroupLeadershipRoleCount: number;
  interestGroupPreviousLeadershipRoleCount: number;
  interestGroupMemberCount: number;
  interestGroupPreviousMemberCount: number;
};

interface TeamLeadershipProps {
  metric: TeamLeadershipMetricOption;
  sort: SortLeadershipAndMembership;
  setSort: Dispatch<SetStateAction<SortLeadershipAndMembership>>;
  tags: string[];
}

const getDataForMetric = (
  data: MetricResponse[],
  metric: 'working-group' | 'interest-group',
) => {
  if (metric === 'working-group') {
    return data.map((row) => ({
      id: row.id,
      name: row.displayName,
      inactiveSince: row.inactiveSince,
      leadershipRoleCount: row.workingGroupLeadershipRoleCount,
      previousLeadershipRoleCount: row.workingGroupPreviousLeadershipRoleCount,
      memberCount: row.workingGroupMemberCount,
      previousMemberCount: row.workingGroupPreviousMemberCount,
    }));
  }
  return data.map((row) => ({
    id: row.id,
    name: row.displayName,
    inactiveSince: row.inactiveSince,
    leadershipRoleCount: row.interestGroupLeadershipRoleCount,
    previousLeadershipRoleCount: row.interestGroupPreviousLeadershipRoleCount,
    memberCount: row.interestGroupMemberCount,
    previousMemberCount: row.interestGroupPreviousMemberCount,
  }));
};

const TeamLeadership: React.FC<TeamLeadershipProps> = ({
  sort,
  setSort,
  tags,
  metric,
}) => {
  const { currentPage, pageSize } = usePaginationParams();

  const [sortingDirection, setSortingDirection] =
    useState<LeadershipAndMembershipSortingDirection>(initialSortingDirection);

  const { items, total } = useAnalyticsLeadership({
    tags,
    sort,
    currentPage,
    pageSize,
  });

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  return (
    <LeadershipMembershipTable
      metric={metric}
      data={getDataForMetric(items, metric)}
      sort={sort}
      setSort={setSort}
      sortingDirection={sortingDirection}
      setSortingDirection={setSortingDirection}
      numberOfPages={numberOfPages}
      renderPageHref={renderPageHref}
      currentPageIndex={currentPage}
    />
  );
};

export default TeamLeadership;
