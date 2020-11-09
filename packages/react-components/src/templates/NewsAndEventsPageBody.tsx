import React, { ComponentProps } from 'react';

import { ResultList, NewsAndEventsCard } from '../organisms';

interface SharedResearchPageBodyProps {
  readonly newsAndEvents: ReadonlyArray<
    ComponentProps<typeof NewsAndEventsCard>
  >;
}

const NewsAndEventsPageBody: React.FC<SharedResearchPageBodyProps> = ({
  newsAndEvents,
}) => (
  <ResultList
    numberOfPages={1}
    numberOfItems={newsAndEvents.length}
    currentPageIndex={0}
    renderPageHref={() => ''}
  >
    {newsAndEvents.map((newsOrEvent) => {
      return (
        <div key={newsOrEvent.id}>
          <NewsAndEventsCard {...newsOrEvent} />
        </div>
      );
    })}
  </ResultList>
);

export default NewsAndEventsPageBody;
