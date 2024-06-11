import { createCsvFileStream } from '@asap-hub/frontend-utils';
import {
  LeadershipAndMembershipSortingDirection,
  initialSortingDirection,
  SortLeadershipAndMembership,
  AnalyticsTeamLeadershipResponse,
} from '@asap-hub/model';
import { AnalyticsLeadershipPageBody } from '@asap-hub/react-components';
import { analytics } from '@asap-hub/routing';
import { format } from 'date-fns';
import { FC, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { getAnalyticsLeadership } from './api';
import { algoliaResultsToStream, leadershipToCSV } from './export';
import { usePagination, usePaginationParams, useSearch } from '../../hooks';
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
    setSortingDirection(initialSortingDirection);
  };

  const [sort, setSort] = useState<SortLeadershipAndMembership>('team_asc');
  const [sortingDirection, setSortingDirection] =
    useState<LeadershipAndMembershipSortingDirection>(initialSortingDirection);

  const { currentPage, pageSize } = usePaginationParams();

  const { tags, setTags } = useSearch();
  const { items, total, client } = useAnalyticsLeadership({
    tags,
    sort,
    currentPage,
    pageSize,
  });

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  const exportResults = () =>
    algoliaResultsToStream<AnalyticsTeamLeadershipResponse>(
      createCsvFileStream(
        `leadership_${metric}_${format(new Date(), 'MMddyy')}.csv`,
        {
          header: true,
        },
      ),
      (paginationParams) =>
        getAnalyticsLeadership(client, {
          tags,
          ...paginationParams,
        }),
      leadershipToCSV(metric),
    );

  return (
    <AnalyticsLeadershipPageBody
      tags={tags}
      setTags={setTags}
      loadTags={async (tagQuery) => {
        const searchedTags = await client.searchForTagValues(
          ['team-leadership'],
          tagQuery,
          {},
        );
        return searchedTags.facetHits.map(({ value }) => ({
          label: value,
          value,
        }));
      }}
      metric={metric}
      setMetric={setMetric}
      sort={sort}
      setSort={setSort}
      sortingDirection={sortingDirection}
      setSortingDirection={setSortingDirection}
      exportResults={exportResults}
      data={getDataForMetric(items, metric)}
      currentPageIndex={currentPage}
      numberOfPages={numberOfPages}
      renderPageHref={renderPageHref}
    />
  );
};

export default Leadership;
