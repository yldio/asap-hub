import { css } from '@emotion/react';
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
    <CalendarList page="calendar" {...props} showBottomMessage={false} />
    <CalendarList page="calendar-working-group" {...props} />
  </div>
);

export default EventsCalendarPage;
