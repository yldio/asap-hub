import { UserProductivityTable } from '@asap-hub/react-components';
import { usePagination, usePaginationParams } from '../../hooks';
import { useAnalyticsUserProductivity } from './state';

const UserProductivity = () => {
  const { currentPage, pageSize } = usePaginationParams();

  const { items: data, total } = useAnalyticsUserProductivity({
    currentPage,
    pageSize,
  });

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  return (
    <UserProductivityTable
      data={data}
      currentPageIndex={currentPage}
      numberOfPages={numberOfPages}
      renderPageHref={renderPageHref}
    />
  );
};

export default UserProductivity;
