import { css } from '@emotion/react';
import { CalendarResponse } from '@asap-hub/model';

import { perRem } from '../pixels';
import { GoogleCalendar } from '../organisms';

const containerStyles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

type EventsCalendarPageProps = {
  calendars: ReadonlyArray<CalendarResponse>;
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
