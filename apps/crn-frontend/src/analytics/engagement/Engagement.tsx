import { AnalyticsEngagementPageBody } from '@asap-hub/react-components';
import { usePagination, usePaginationParams } from '../../hooks';

const Engagement = () => {
  const { currentPage, pageSize } = usePaginationParams();
  const { numberOfPages, renderPageHref } = usePagination(10, pageSize);
  return (
    <AnalyticsEngagementPageBody
      currentPageIndex={currentPage}
      numberOfPages={numberOfPages}
      renderPageHref={renderPageHref}
    />
  );
};
export default Engagement;
