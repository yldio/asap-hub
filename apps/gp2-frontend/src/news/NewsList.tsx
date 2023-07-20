import { NewsItem } from '@asap-hub/gp2-components';
import { ResultList } from '@asap-hub/react-components';
import { useNews } from './state';
import { usePagination, usePaginationParams } from '../hooks/pagination';

type NewsListProps = {
  searchQuery: string;
  filters: Set<string>;
};

const NewsList: React.FC<NewsListProps> = ({ searchQuery, filters }) => {
  const { currentPage, pageSize } = usePaginationParams();
  const result = useNews({
    searchQuery,
    filters,
    currentPage,
    pageSize,
  });
  // const { items, total } = useNews();
  const { numberOfPages, renderPageHref } = usePagination(
    result.total || 0,
    pageSize,
  );
  return (
    <ResultList
      numberOfItems={result.total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
    >
      {result.items.map((news) => (
        <NewsItem key={news.id} {...news} />
      ))}
    </ResultList>
  );
};

export default NewsList;
