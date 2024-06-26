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
  tags: string[];
}
const UserProductivity: React.FC<UserProductivityProps> = ({
  sort,
  setSort,
  tags,
}) => {
  const { currentPage, pageSize } = usePaginationParams();
  const { timeRange, documentCategory } = useAnalytics();
  const [sortingDirection, setSortingDirection] =
    useState<UserProductivitySortingDirection>(
      userProductivityInitialSortingDirection,
    );

  const { items: data, total } = useAnalyticsUserProductivity({
    currentPage,
    pageSize,
    sort,
    tags,
    timeRange,
    documentCategory,
  });

  const performance = useUserProductivityPerformance(
    timeRange,
    documentCategory,
  );

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
