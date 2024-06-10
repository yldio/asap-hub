import {
  SortUserProductivity,
  userProductivityInitialSortingDirection,
  UserProductivitySortingDirection,
} from '@asap-hub/model';
import { UserProductivityTable } from '@asap-hub/react-components';
import { Dispatch, SetStateAction, useState } from 'react';
import { useAnalytics, usePagination, usePaginationParams } from '../../hooks';
import {
  useAnalyticsUserProductivity,
  useUserProductivityPerformance,
} from './state';

interface UserProductivityProps {
  sort: SortUserProductivity;
  setSort: Dispatch<SetStateAction<SortUserProductivity>>;
}
const UserProductivity = ({ sort, setSort }: UserProductivityProps) => {
  const { currentPage, pageSize } = usePaginationParams();
  const { timeRange } = useAnalytics();
  const [sortingDirection, setSortingDirection] =
    useState<UserProductivitySortingDirection>(
      userProductivityInitialSortingDirection,
    );

  const { items: data, total } = useAnalyticsUserProductivity({
    currentPage,
    pageSize,
    timeRange,
    sort,
  });

  const performance = useUserProductivityPerformance(timeRange);

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  return (
    <UserProductivityTable
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

export default UserProductivity;
