import { css } from '@emotion/react';
import { BasicCalendarResponse } from '@asap-hub/model';

import { perRem } from '../pixels';
import { GoogleCalendar } from '../organisms';

const containerStyles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

type EventsCalendarPageProps = {
  calendars: ReadonlyArray<BasicCalendarResponse>;
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
