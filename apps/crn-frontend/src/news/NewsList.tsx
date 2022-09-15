import { NewsPageBody } from '@asap-hub/react-components';
import { usePagination, usePaginationParams } from '../hooks';
import { useNews } from './state';

interface NewsListProps {
  searchQuery?: string;
  filters?: Set<string>;
}

const NewsList: React.FC<NewsListProps> = ({
  searchQuery = '',
  filters = new Set(),
}) => {
  const { currentPage, pageSize } = usePaginationParams();
  const result = useNews({
    searchQuery,
    filters,
    currentPage,
    pageSize,
  });

  const { numberOfPages, renderPageHref } = usePagination(
    result.total || 0,
    pageSize,
  );

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
