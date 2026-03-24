import { Loading, NewsPageBody } from '@asap-hub/react-components';
import { usePagination, usePaginationParams } from '../hooks';
import { useNews } from './state';

interface NewsListProps {
  searchQuery: string;
  filters: Set<string>;
}

const NewsList: React.FC<NewsListProps> = ({ searchQuery, filters }) => {
  const { currentPage, pageSize } = usePaginationParams();
  const {
    data: result,
    isLoading,
    error,
  } = useNews({
    searchQuery,
    filters,
    currentPage,
    pageSize,
  });

  const { numberOfPages, renderPageHref } = usePagination(
    result?.total || 0,
    pageSize,
  );

  if (isLoading) return <Loading />;
  if (!result) throw error ?? new Error('Failed to load news');

  return (
    <NewsPageBody
      news={result.items}
      numberOfPages={numberOfPages}
      renderPageHref={renderPageHref}
      currentPage={currentPage}
      numberOfItems={result.total}
    />
  );
};

export default NewsList;
