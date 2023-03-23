import {
  CalendarList,
  EventsCalendar,
  pixels,
} from '@asap-hub/react-components';

import { useCalendars } from './state';

const { rem } = pixels;

const Calendars: React.FC<Record<string, never>> = () => {
  const { items } = useCalendars();
  return (
    <div style={{ margin: `${rem(48)} 0` }}>
      <EventsCalendar calendars={items}>
        <CalendarList
          title="Subscribe to Working Groups on Calendar"
          description="Below you can find the list of all working groups. Hitting subscribe will allow you to add them to your own personal calendar."
          calendars={items.filter(
            ({ projects, workingGroups }) =>
              projects.length === 0 || workingGroups.length > 0,
          )}
          hideSupportText
        />
        <CalendarList
          calendars={items.filter(({ projects }) => projects.length > 0)}
          title="Subscribe to Projects on Calendar"
          description="Below you can find the list of all projects. Hitting subscribe will allow you to add them to your own personal calendar."
        />
      </EventsCalendar>
    </div>
  );
};

export default Calendars;
