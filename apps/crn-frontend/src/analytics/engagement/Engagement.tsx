import { AnalyticsEngagementPageBody } from '@asap-hub/react-components';
import { usePagination, usePaginationParams } from '../../hooks';
import { useAnalyticsEngagement } from './state';

const Engagement = () => {
  const { currentPage, pageSize } = usePaginationParams();

  const { items: data, total } = useAnalyticsEngagement({
    currentPage,
    pageSize,
  });

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);
  return (
    <AnalyticsEngagementPageBody
      data={data}
      currentPageIndex={currentPage}
      numberOfPages={numberOfPages}
      renderPageHref={renderPageHref}
    />
  );
};
export default Engagement;
