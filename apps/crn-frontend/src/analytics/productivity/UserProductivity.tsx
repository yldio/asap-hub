import {
  SortUserProductivity,
  userProductivityInitialSortingDirection,
  UserProductivitySortingDirection,
} from '@asap-hub/model';
import { UserProductivityTable } from '@asap-hub/react-components';
import { useState } from 'react';
import { useAnalytics, usePagination, usePaginationParams } from '../../hooks';
import {
  useAnalyticsUserProductivity,
  useUserProductivityPerformance,
} from './state';

export type ProductivityProps = {
  tags: string[];
};

const UserProductivity: React.FC<ProductivityProps> = ({ tags }) => {
  const { currentPage, pageSize } = usePaginationParams();
  const { timeRange } = useAnalytics();
  const [sort, setSort] = useState<SortUserProductivity>('user_asc');
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
