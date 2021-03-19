import React from 'react';
import css from '@emotion/css';
import { CalendarResponse } from '@asap-hub/model';

import { GoogleCalendar, CalendarList } from '../organisms';
import { perRem } from '../pixels';

const styles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

type GroupProfileCalendarProps = {
  readonly calendars: ReadonlyArray<CalendarResponse>;
};
const GroupProfileCalendar: React.FC<GroupProfileCalendarProps> = ({
  calendars,
}) => (
  <div css={styles}>
    <GoogleCalendar calendars={calendars} />
    {!!calendars.length && <CalendarList page="group" calendars={calendars} />}
  </div>
);

export default GroupProfileCalendar;
