import React, { ComponentProps } from 'react';

import { NewsAndEventsCard } from '../organisms';

interface LibraryPageBodyProps {
  readonly newsAndEvents: ReadonlyArray<
    ComponentProps<typeof NewsAndEventsCard>
  >;
}

const NewsAndEventsPageBody: React.FC<LibraryPageBodyProps> = ({
  newsAndEvents,
}) => (
  <>
    {newsAndEvents.map((newsOrEvent, idx) => {
      return (
        <div key={idx}>
          <NewsAndEventsCard {...newsOrEvent} />
        </div>
      );
    })}
  </>
);

export default NewsAndEventsPageBody;
