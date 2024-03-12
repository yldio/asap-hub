import { GoogleCalendar } from '@asap-hub/react-components';
import { text } from './knobs';
import { googleLegacyCalendarColor } from './colors';

export default {
  title: 'Organisms / Calendar / Google Calendar',
  component: GoogleCalendar,
};

export const Normal = () => {
  const id1 = text('Calendar 1 ID', '');
  const color1 = googleLegacyCalendarColor('Calendar 1 Color');

  const id2 = text('Calendar 2 ID', '');
  const color2 = googleLegacyCalendarColor('Calendar 2 Color');

  const calendars = [];
  if (id1 && color1) {
    calendars.push({ id: id1, color: color1 });
  }
  if (id2 && color2) {
    calendars.push({ id: id2, color: color2 });
  }

  return <GoogleCalendar calendars={calendars} />;
};
