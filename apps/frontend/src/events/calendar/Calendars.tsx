import { EventsCalendar } from '@asap-hub/react-components';

import { useCalendars } from './state';
import { usePrefetchEvents } from '../state';
import { getEventListOptions } from '../options';

interface CalendarsProps {
  currentTime: Date;
}
const Calendars: React.FC<CalendarsProps> = ({ currentTime }) => {
  const { items } = useCalendars();

  usePrefetchEvents(getEventListOptions(currentTime, true));
  usePrefetchEvents(getEventListOptions(currentTime, false));

  return <EventsCalendar calendars={items} />;
};

export default Calendars;
