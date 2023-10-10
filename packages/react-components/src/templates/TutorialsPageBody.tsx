import { TutorialsResponse } from '@asap-hub/model';

import { ResultList, TutorialCard } from '../organisms';

interface TutorialsPageBodyProps {
  readonly tutorials: ReadonlyArray<TutorialsResponse>;
  readonly numberOfItems: number;
  readonly numberOfPages: number;
  readonly currentPage: number;
  readonly renderPageHref: (idx: number) => string;
}

const TutorialsPageBody: React.FC<TutorialsPageBodyProps> = ({
  tutorials,
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
    {tutorials.map((data) => (
      <div key={data.id}>
        <TutorialCard {...data} />
      </div>
    ))}
  </ResultList>
);

export default TutorialsPageBody;
