import React from 'react';
import css from '@emotion/css';
import { CalendarResponse } from '@asap-hub/model';

import { perRem } from '../pixels';
import { GoogleCalendar, CalendarList } from '../organisms';

const containerStyles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

type EventsCalendarPageProps = {
  calendars: ReadonlyArray<CalendarResponse>;
};

const EventsCalendarPage: React.FC<EventsCalendarPageProps> = (props) => (
  <div css={containerStyles}>
    <GoogleCalendar {...props} />
    <CalendarList page="calendar" {...props} />
  </div>
);

export default EventsCalendarPage;
