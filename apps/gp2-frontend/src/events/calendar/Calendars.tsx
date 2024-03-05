import { CalendarList, EventsCalendar } from '@asap-hub/react-components';

import { useCalendars } from './state';

const Calendars: React.FC<Record<string, never>> = () => {
  const { items } = useCalendars();
  return (
    <div>
      <EventsCalendar calendars={items}>
        <CalendarList
          title="Subscribe to Working Groups Calendar"
          description="Below you can find the list of all working groups. Hitting subscribe will allow you to add them to your own personal calendar."
          calendars={items.filter(
            ({ projects, workingGroups }) =>
              projects.length === 0 || workingGroups.length > 0,
          )}
          hideSupportText
        />
        <CalendarList
          calendars={items.filter(
            ({ projects }) =>
              projects.length > 0 && projects[0]?.status !== 'Completed',
          )}
          title="Subscribe to Projects Calendar"
          description="Below you can find the list of all projects. Hitting subscribe will allow you to add them to your own personal calendar."
        />
      </EventsCalendar>
    </div>
  );
};

export default Calendars;
