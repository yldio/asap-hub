import React, { ComponentProps } from 'react';
import css from '@emotion/css';
import { EventResponse, GroupResponse } from '@asap-hub/model';

import { perRem } from '../pixels';
import { ResultList, EventCard } from '../organisms';

const containerStyles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

type EventsListProps = Omit<ComponentProps<typeof ResultList>, 'children'> & {
  events: Array<
    Omit<EventResponse, 'groups'> & {
      href: string;
      groups: (GroupResponse & { href: string })[];
    }
  >;
};

const EventsListPage: React.FC<EventsListProps> = ({ events, ...props }) => (
  <div css={containerStyles}>
    <ResultList {...props}>
      {events.map(({ id, href, ...event }) => (
        <React.Fragment key={id}>
          <EventCard
            {...event}
            href={event.status !== 'Cancelled' ? href : undefined}
          />
        </React.Fragment>
      ))}
    </ResultList>
  </div>
);
export default EventsListPage;
