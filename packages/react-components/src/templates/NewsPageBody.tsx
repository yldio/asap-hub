import { ComponentProps } from 'react';

import { ResultList, NewsCard } from '../organisms';

interface NewsPageBodyProps {
  readonly news: ReadonlyArray<ComponentProps<typeof NewsCard>>;
}

const NewsPageBody: React.FC<NewsPageBodyProps> = ({ news }) => (
  <ResultList
    numberOfPages={1}
    numberOfItems={news.length}
    currentPageIndex={0}
    renderPageHref={() => ''}
  >
    {news.map((newsOrEvent) => (
      <div key={newsOrEvent.id}>
        <NewsCard {...newsOrEvent} />
      </div>
    ))}
  </ResultList>
);

export default NewsPageBody;
