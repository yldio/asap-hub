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
      calendars={calendars.filter(
        (calendar) =>
          calendar.groups.some(({ active }) => active) ||
          (calendar.groups.every(({ active }) => !active) &&
            calendar.workingGroups.every(({ complete }) => complete)),
      )}
      title="Subscribe to Interest Groups on Calendar"
      description="Below you can find a list of all the Interest Groups that will present in the future. Hitting subscribe will allow you to
      add them to your own personal calendar."
      hideSupportText
    />
    <CalendarList
      title="Subscribe to Working Groups on Calendar"
      description="Below you can find a list of all the Working Groups that will present in the future. Hitting subscribe will allow you to
      add them to your own personal calendar."
      calendars={calendars.filter((calendar) =>
        calendar.workingGroups.some(({ complete }) => !complete),
      )}
    />
  </div>
);

export default EventsCalendarPage;
