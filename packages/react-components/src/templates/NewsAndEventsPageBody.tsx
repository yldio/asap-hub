import React, { ComponentProps } from 'react';

import { NewsAndEventsCard } from '../organisms';
import CardList from '../organisms/CardList';

interface LibraryPageBodyProps {
  readonly newsAndEvents: ReadonlyArray<
    ComponentProps<typeof NewsAndEventsCard>
  >;
}

const NewsAndEventsPageBody: React.FC<LibraryPageBodyProps> = ({
  newsAndEvents,
}) => (
  <CardList
    numberOfPages={1}
    numberOfItems={newsAndEvents.length}
    currentPageIndex={0}
    renderPageHref={() => ''}
  >
    {newsAndEvents.map((newsOrEvent, idx) => {
      return (
        <div key={idx}>
          <NewsAndEventsCard {...newsOrEvent} />
        </div>
      );
    })}
  </CardList>
);

export default NewsAndEventsPageBody;
