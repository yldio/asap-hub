import { Frame } from '@asap-hub/frontend-utils';
import { NewsItem, NewsListPage } from '@asap-hub/gp2-components';
import { ResultList } from '@asap-hub/react-components';
import { useNews } from '../dashboard/state';
import { usePagination, usePaginationParams } from '../hooks/pagination';

const NewsList = () => {
  const { currentPage, pageSize } = usePaginationParams();
  const { items, total } = useNews();
  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);
  return (
    <NewsListPage>
      <Frame title="News List">
        <ResultList
          numberOfItems={total}
          numberOfPages={numberOfPages}
          currentPageIndex={currentPage}
          renderPageHref={renderPageHref}
        >
          {items.map((news) => (
            <NewsItem key={news.id} {...news} />
          ))}
        </ResultList>
      </Frame>
    </NewsListPage>
  );
};

export default NewsList;
