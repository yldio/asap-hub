import { css } from '@emotion/react';
import { BasicCalendarResponse } from '@asap-hub/model';

import { rem } from '../pixels';
import { GoogleCalendar } from '../organisms';

const containerStyles = css({
  display: 'grid',
  gridRowGap: rem(36),
});

type EventsCalendarPageProps = {
  calendars: ReadonlyArray<BasicCalendarResponse>;
  children?: React.ReactNode;
};

const EventsCalendarPage: React.FC<EventsCalendarPageProps> = ({
  calendars,
  children,
}) => (
  <div css={containerStyles}>
    <GoogleCalendar calendars={calendars} />
    {children}
  </div>
);

export default EventsCalendarPage;
