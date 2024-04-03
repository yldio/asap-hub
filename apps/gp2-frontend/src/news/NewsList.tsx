import { EmptyState, noNewsIcon } from '@asap-hub/gp2-components';
import { NewsCard, ResultList } from '@asap-hub/react-components';
import { useNews } from './state';
import { usePagination, usePaginationParams } from '../hooks/pagination';

type NewsListProps = {
  searchQuery: string;
  filters: Set<string>;
};

const NewsList: React.FC<NewsListProps> = ({ searchQuery, filters }) => {
  const { currentPage, pageSize } = usePaginationParams();
  const { items, total } = useNews({
    searchQuery,
    filters,
    currentPage,
    pageSize,
  });
  const { numberOfPages, renderPageHref } = usePagination(total || 0, pageSize);
  return total || searchQuery ? (
    <ResultList
      icon={noNewsIcon}
      numberOfItems={total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
    >
      {items.map((news) => (
        <NewsCard {...news} key={news.id} type="News" />
      ))}
    </ResultList>
  ) : (
    <EmptyState
      icon={noNewsIcon}
      title={'No news available.'}
      description={
        'When a GP2 admin shares a newsletter or an update, it will be listed here.'
      }
    />
  );
};

export default NewsList;
