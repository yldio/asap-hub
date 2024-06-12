import {
  SortTeamProductivity,
  teamProductivityInitialSortingDirection,
  TeamProductivitySortingDirection,
} from '@asap-hub/model';
import { TeamProductivityTable } from '@asap-hub/react-components';
import { Dispatch, SetStateAction, useState } from 'react';
import { useAnalytics, usePagination, usePaginationParams } from '../../hooks';
import {
  useAnalyticsTeamProductivity,
  useTeamProductivityPerformance,
} from './state';

interface TeamProductivityProps {
  sort: SortTeamProductivity;
  setSort: Dispatch<SetStateAction<SortTeamProductivity>>;
  tags: string[];
}
const TeamProductivity: React.FC<TeamProductivityProps> = ({
  sort,
  setSort,
  tags,
}) => {
  const { currentPage, pageSize } = usePaginationParams();
  const { timeRange } = useAnalytics();
  const [sortingDirection, setSortingDirection] =
    useState<TeamProductivitySortingDirection>(
      teamProductivityInitialSortingDirection,
    );

  const { items: data, total } = useAnalyticsTeamProductivity({
    currentPage,
    pageSize,
    sort,
    tags,
    timeRange,
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
