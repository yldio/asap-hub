import { UserProductivityTable } from '@asap-hub/react-components';
import { useAnalytics, usePagination, usePaginationParams } from '../../hooks';
import {
  useAnalyticsUserProductivity,
  useUserProductivityPerformance,
} from './state';

const UserProductivity = () => {
  const { currentPage, pageSize } = usePaginationParams();
  const { timeRange, documentCategory } = useAnalytics();

  const { items: data, total } = useAnalyticsUserProductivity({
    currentPage,
    pageSize,
    timeRange,
    documentCategory
  });

  const performance = useUserProductivityPerformance(timeRange);

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  return (
    <UserProductivityTable
      data={data}
      performance={performance}
      currentPageIndex={currentPage}
      numberOfPages={numberOfPages}
      renderPageHref={renderPageHref}
    />
  );
};

export default UserProductivity;
