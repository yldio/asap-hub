import {
  SortTeamProductivity,
  teamProductivityInitialSortingDirection,
  TeamProductivitySortingDirection,
} from '@asap-hub/model';
import { TeamProductivityTable } from '@asap-hub/react-components';
import { useState } from 'react';
import { useAnalytics, usePagination, usePaginationParams } from '../../hooks';
import {
  useAnalyticsTeamProductivity,
  useTeamProductivityPerformance,
} from './state';

const TeamProductivity = () => {
  const { currentPage, pageSize } = usePaginationParams();
  const { timeRange } = useAnalytics();
  const [sort, setSort] = useState<SortTeamProductivity>('team_asc');
  const [sortingDirection, setSortingDirection] =
    useState<TeamProductivitySortingDirection>(
      teamProductivityInitialSortingDirection,
    );

  const { items: data, total } = useAnalyticsTeamProductivity({
    currentPage,
    pageSize,
    timeRange,
    sort,
  });

  const performance = useTeamProductivityPerformance(timeRange);

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  return (
    <TeamProductivityTable
      data={data}
      performance={performance}
      sort={sort}
      setSort={setSort}
      sortingDirection={sortingDirection}
      setSortingDirection={setSortingDirection}
      currentPageIndex={currentPage}
      numberOfPages={numberOfPages}
      renderPageHref={renderPageHref}
    />
  );
};

export default TeamProductivity;
