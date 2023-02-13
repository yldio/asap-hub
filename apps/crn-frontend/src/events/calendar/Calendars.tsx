import { EventsCalendar } from '@asap-hub/react-components';
import { getEventListOptions } from '@asap-hub/frontend-utils';

import { useCalendars } from './state';
import { usePrefetchEvents } from '../state';

interface CalendarsProps {
  currentTime: Date;
}
const Calendars: React.FC<CalendarsProps> = ({ currentTime }) => {
  const { items } = useCalendars();

  usePrefetchEvents(getEventListOptions(currentTime, { past: true }));
  usePrefetchEvents(getEventListOptions(currentTime, { past: false }));

  return <EventsCalendar calendars={items} />;
};

export default Calendars;
