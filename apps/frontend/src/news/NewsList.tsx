import { NewsPageBody, Loading } from '@asap-hub/react-components';
import { usePagination, usePaginationParams } from '../hooks';

import { useNews } from '../api';

const NewsList: React.FC<Record<string, never>> = () => {
  const { currentPage, pageSize } = usePaginationParams();
  const result = useNews({
    searchQuery: '',
    filters: new Set(),
    currentPage,
    pageSize,
  });

  const { numberOfPages, renderPageHref } = usePagination(
    result.data?.total || 0,
    pageSize,
  );

  if (result.loading) {
    return <Loading />;
  }

  return (
    <NewsPageBody
      news={result.data.items}
      numberOfPages={numberOfPages}
      renderPageHref={renderPageHref}
      currentPage={currentPage}
      numberOfItems={result.data?.total}
    />
  );
};

export default NewsList;
