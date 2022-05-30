import { Fragment, FC, ComponentProps } from 'react';
import { css } from '@emotion/react';
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

const EventsListPage: FC<EventsListProps> = ({ events, ...props }) => (
  <div css={containerStyles}>
    <ResultList {...props}>
      {events.map((event) => (
        <Fragment key={event.id}>
          <EventCard
            {...event}
            showNumberOfSpeakers={true}
            showNumberOfTeams={true}
          />
        </Fragment>
      ))}
    </ResultList>
  </div>
);
export default EventsListPage;
