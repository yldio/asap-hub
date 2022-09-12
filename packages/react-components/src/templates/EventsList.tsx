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
  showNumberOfSpeakers?: boolean;
  showTeams?: boolean;
};

const EventsListPage: FC<EventsListProps> = ({
  events,
  showNumberOfSpeakers = true,
  showTeams = true,
  ...props
}) => (
  <div css={containerStyles}>
    <ResultList {...props}>
      {events.map((event) => (
        <Fragment key={event.id}>
          <EventCard
            {...event}
            showNumberOfSpeakers={showNumberOfSpeakers}
            showTeams={showTeams}
          />
        </Fragment>
      ))}
    </ResultList>
  </div>
);
export default EventsListPage;
