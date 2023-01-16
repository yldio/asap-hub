import { NewsResponse, TutorialsResponse } from '@asap-hub/model';

import { ResultList, NewsCard } from '../organisms';

interface NewsPageBodyProps {
  readonly news: ReadonlyArray<NewsResponse | TutorialsResponse>;
  readonly numberOfItems: number;
  readonly numberOfPages: number;
  readonly currentPage: number;
  readonly renderPageHref: (idx: number) => string;
}

const NewsPageBody: React.FC<NewsPageBodyProps> = ({
  news,
  numberOfItems,
  numberOfPages,
  currentPage,
  renderPageHref,
}) => (
  <ResultList
    numberOfPages={numberOfPages}
    numberOfItems={numberOfItems}
    currentPageIndex={currentPage}
    renderPageHref={renderPageHref}
  >
    {news.map((data) => (
      <div key={data.id}>
        <NewsCard {...data} type="News" />
      </div>
    ))}
  </ResultList>
);

export default NewsPageBody;
