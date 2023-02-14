import { EventsCalendar } from '@asap-hub/react-components';

import { useCalendars } from './state';

const Calendars: React.FC<Record<string, never>> = () => {
  const { items } = useCalendars();

  return <EventsCalendar calendars={items} />;
};

export default Calendars;
