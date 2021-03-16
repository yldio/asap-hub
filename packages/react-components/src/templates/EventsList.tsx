import React, { ComponentProps } from 'react';
import css from '@emotion/css';
import { EventResponse } from '@asap-hub/model';

import { perRem } from '../pixels';
import { ResultList, EventCard } from '../organisms';

const containerStyles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

type EventsListProps = Omit<ComponentProps<typeof ResultList>, 'children'> & {
  events: ReadonlyArray<EventResponse>;
};

const EventsListPage: React.FC<EventsListProps> = ({ events, ...props }) => (
  <div css={containerStyles}>
    <ResultList {...props}>
      {events.map((event) => (
        <React.Fragment key={event.id}>
          <EventCard {...event} />
        </React.Fragment>
      ))}
    </ResultList>
  </div>
);
export default EventsListPage;
