import {
  SortTeamProductivity,
  teamProductivityInitialSortingDirection,
  TeamProductivitySortingDirection,
} from '@asap-hub/model';
import {
  LoadingContentBodyTable,
  TeamProductivityTable,
} from '@asap-hub/react-components';
import { Dispatch, FC, SetStateAction, Suspense, useState } from 'react';
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
const TeamProductivityTableContent: FC<TeamProductivityProps> = ({
  sort,
  setSort,
  tags,
}) => {
  const { currentPage, pageSize } = usePaginationParams();
  const { timeRange, outputType } = useAnalytics();
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
    outputType,
  });

  const performance = useTeamProductivityPerformance({ timeRange, outputType });

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

const TeamProductivityContent: FC<TeamProductivityProps> = (props) => (
  <Suspense fallback={<LoadingContentBodyTable />}>
    <TeamProductivityTableContent {...props} />
  </Suspense>
);

const TeamProductivity: FC<TeamProductivityProps> = (props) => (
  <TeamProductivityContent {...props} />
);

export default TeamProductivity;
