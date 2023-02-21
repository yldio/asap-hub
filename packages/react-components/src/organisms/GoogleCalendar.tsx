import { css } from '@emotion/react';
import { BasicCalendarResponse } from '@asap-hub/model';

import { getLocalTimezone } from '../localization';

const iframeStyles = css({
  width: '100%',
  height: '540px',
  border: 0,
});

interface GoogleCalendarProps {
  calendars: ReadonlyArray<Pick<BasicCalendarResponse, 'id' | 'color'>>;
}
const GoogleCalendar: React.FC<GoogleCalendarProps> = ({ calendars }) => {
  const iframeSrc = new URL(
    'https://calendar.google.com/calendar/embed?showTitle=0&showPrint=0',
  );
  iframeSrc.searchParams.append('ctz', getLocalTimezone());
  calendars.forEach(({ id, color }) => {
    iframeSrc.searchParams.append('src', id);
    iframeSrc.searchParams.append('color', color);
  });

  return (
    <iframe src={iframeSrc.toString()} title="Calendar" css={iframeStyles} />
  );
};
export default GoogleCalendar;
