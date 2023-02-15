import { css } from '@emotion/react';
import { CalendarResponse } from '@asap-hub/model';

import { GoogleCalendar, CalendarList } from '../organisms';
import { perRem } from '../pixels';

const styles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

type GroupProfileCalendarProps = {
  readonly calendars: ReadonlyArray<CalendarResponse>;
  readonly groupType: 'interest' | 'working';
};
const GroupProfileCalendar: React.FC<GroupProfileCalendarProps> = ({
  calendars,
  groupType,
}) => (
  <div css={styles}>
    <GoogleCalendar calendars={calendars} />
    {!!calendars.length && (
      <CalendarList
        calendars={calendars}
        title={`Subscribe to this ${groupType} group's Calendar`}
      />
    )}
  </div>
);

export default GroupProfileCalendar;
