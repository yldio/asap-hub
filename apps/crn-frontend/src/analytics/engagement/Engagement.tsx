import {
  engagementInitialSortingDirection,
  EngagementSortingDirection,
  SortEngagement,
} from '@asap-hub/model';
import { AnalyticsEngagementPageBody } from '@asap-hub/react-components';
import { useState } from 'react';

import { usePagination, usePaginationParams } from '../../hooks';
import { useAnalyticsEngagement } from './state';

const Engagement = () => {
  const { currentPage, pageSize } = usePaginationParams();

  const [sort, setSort] = useState<SortEngagement>('team_asc');
  const [sortingDirection, setSortingDirection] =
    useState<EngagementSortingDirection>(engagementInitialSortingDirection);

  const { items: data, total } = useAnalyticsEngagement({
    currentPage,
    pageSize,
    sort,
    tags: [],
    timeRange: '30d',
  });

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);
  return (
    <AnalyticsEngagementPageBody
      data={data}
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
export default Engagement;
