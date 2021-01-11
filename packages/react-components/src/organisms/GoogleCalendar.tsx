import React from 'react';
import css from '@emotion/css';
import { CalendarResponse } from '@asap-hub/model';

const iframeStyles = css({
  width: '100%',
  height: '420px',
});

interface GoogleCalendarProps {
  calendars: ReadonlyArray<Pick<CalendarResponse, 'id' | 'color'>>;
}
const GoogleCalendar: React.FC<GoogleCalendarProps> = ({ calendars }) => {
  const iframeSrc = new URL(
    'https://calendar.google.com/calendar/embed?showTitle=0&showPrint=0',
  );
  calendars.forEach(({ id, color }) => {
    iframeSrc.searchParams.append('src', id);
    iframeSrc.searchParams.append('color', color);
  });

  return (
    <iframe src={iframeSrc.toString()} title="Calendar" css={iframeStyles} />
  );
};
export default GoogleCalendar;
