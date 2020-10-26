import React, { ComponentProps } from 'react';

import { NewsAndEventsCard } from '../organisms';
import CardList from '../organisms/CardList';

interface SharedResearchPageBodyProps {
  readonly newsAndEvents: ReadonlyArray<
    ComponentProps<typeof NewsAndEventsCard>
  >;
}

const NewsAndEventsPageBody: React.FC<SharedResearchPageBodyProps> = ({
  newsAndEvents,
}) => (
  <CardList
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
  </CardList>
);

export default NewsAndEventsPageBody;
