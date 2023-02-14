import { CalendarList, EventsCalendar } from '@asap-hub/react-components';
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

  return (
    <EventsCalendar calendars={items}>
      <CalendarList
        calendars={items.filter(
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
        calendars={items.filter((calendar) =>
          calendar.workingGroups.some(({ complete }) => !complete),
        )}
      />
    </EventsCalendar>
  );
};

export default Calendars;
