import {
  LeadershipAndMembershipSortingDirection,
  initialSortingDirection,
  SortLeadershipAndMembership,
} from '@asap-hub/model';
import { AnalyticsLeadershipPageBody } from '@asap-hub/react-components';
import { analytics } from '@asap-hub/routing';
import { FC, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { usePagination, usePaginationParams } from '../../hooks';
import { useAnalyticsLeadership } from './state';

type MetricResponse = {
  id: string;
  displayName: string;
  workingGroupLeadershipRoleCount: number;
  workingGroupPreviousLeadershipRoleCount: number;
  workingGroupMemberCount: number;
  workingGroupPreviousMemberCount: number;

  interestGroupLeadershipRoleCount: number;
  interestGroupPreviousLeadershipRoleCount: number;
  interestGroupMemberCount: number;
  interestGroupPreviousMemberCount: number;
};

const getDataForMetric = (
  data: MetricResponse[],
  metric: 'working-group' | 'interest-group',
) => {
  if (metric === 'working-group') {
    return data.map((row) => ({
      id: row.id,
      name: row.displayName,
      leadershipRoleCount: row.workingGroupLeadershipRoleCount,
      previousLeadershipRoleCount: row.workingGroupPreviousLeadershipRoleCount,
      memberCount: row.workingGroupMemberCount,
      previousMemberCount: row.workingGroupPreviousMemberCount,
    }));
  }
  return data.map((row) => ({
    id: row.id,
    name: row.displayName,
    leadershipRoleCount: row.interestGroupLeadershipRoleCount,
    previousLeadershipRoleCount: row.interestGroupPreviousLeadershipRoleCount,
    memberCount: row.interestGroupMemberCount,
    previousMemberCount: row.interestGroupPreviousMemberCount,
  }));
};

const Leadership: FC<Record<string, never>> = () => {
  const history = useHistory();
  const { metric } = useParams<{
    metric: 'working-group' | 'interest-group';
  }>();
  const setMetric = (newMetric: 'working-group' | 'interest-group') => {
    history.push(analytics({}).leadership({}).metric({ metric: newMetric }).$);
    setSort('team_asc');
  };

  const [sort, setSort] = useState<SortLeadershipAndMembership>('team_asc');
  const [sortingDirection, setSortingDirection] =
    useState<LeadershipAndMembershipSortingDirection>(initialSortingDirection);

  const { currentPage, pageSize } = usePaginationParams();

  const { items, total } = useAnalyticsLeadership({
    sort,
    currentPage,
    pageSize,
    searchQuery: '',
    filters: new Set(),
  });

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  return (
    <AnalyticsLeadershipPageBody
      metric={metric}
      setMetric={setMetric}
      sort={sort}
      setSort={setSort}
      sortingDirection={sortingDirection}
      setSortingDirection={setSortingDirection}
      data={getDataForMetric(items, metric)}
      currentPageIndex={currentPage}
      numberOfPages={numberOfPages}
      renderPageHref={renderPageHref}
    />
  );
};

export default Leadership;
