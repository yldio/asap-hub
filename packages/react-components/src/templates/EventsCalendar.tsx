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

const EventsCalendarPage: React.FC<EventsCalendarPageProps> = ({
  calendars,
}) => (
  <div css={containerStyles}>
    <GoogleCalendar calendars={calendars} />
    <CalendarList
      page="calendar"
      calendars={calendars.filter(
        (calendar) =>
          calendar.activeGroups === true ||
          (calendar.activeGroups === false &&
            calendar.incompleteWorkingGroups === false),
      )}
      showBottomMessage={false}
    />
    <CalendarList
      page="calendar-working-group"
      calendars={calendars.filter(
        (calendar) => calendar.incompleteWorkingGroups === true,
      )}
    />
  </div>
);

export default EventsCalendarPage;
