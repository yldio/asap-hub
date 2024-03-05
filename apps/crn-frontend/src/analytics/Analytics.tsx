import { FC, useState } from 'react';
import { AnalyticsPageBody } from '@asap-hub/react-components';
import { useAnalyticsLeadership } from './state';
import { usePagination, usePaginationParams } from '../hooks';

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
  metric: 'workingGroup' | 'interestGroup',
) => {
  if (metric === 'workingGroup') {
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

const About: FC<Record<string, never>> = () => {
  const [metric, setMetric] = useState<'workingGroup' | 'interestGroup'>(
    'workingGroup',
  );
  const { currentPage, pageSize } = usePaginationParams();
  const { items, total } = useAnalyticsLeadership({ currentPage, pageSize });
  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  return (
    <AnalyticsPageBody
      metric={metric}
      setMetric={setMetric}
      data={getDataForMetric(items, metric)}
      currentPageIndex={currentPage}
      numberOfPages={numberOfPages}
      renderPageHref={renderPageHref}
    />
  );
};

export default About;
