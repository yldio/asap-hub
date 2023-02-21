import { Fragment, FC, ComponentProps } from 'react';
import { css } from '@emotion/react';

import { rem } from '../pixels';
import { ResultList, EventCard } from '../organisms';

const containerStyles = css({
  display: 'grid',
  gridRowGap: rem(36),
});

type EventsListProps = Omit<ComponentProps<typeof ResultList>, 'children'> & {
  events: ComponentProps<typeof EventCard>[];
};

const EventsListPage: FC<EventsListProps> = ({ events, ...props }) => (
  <div css={containerStyles}>
    <ResultList {...props}>
      {events.map(({ eventSpeakers, eventTeams, ...event }) => (
        <Fragment key={event.id}>
          <EventCard {...event} />
        </Fragment>
      ))}
    </ResultList>
  </div>
);
export default EventsListPage;
