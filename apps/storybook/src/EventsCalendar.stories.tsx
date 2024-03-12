import { EventsCalendar } from '@asap-hub/react-components';
import { createListCalendarResponse } from '@asap-hub/fixtures';
import { boolean, number } from './knobs';

export default {
  title: 'Templates / Events / Calendar',
};

export const Normal = () => (
  <EventsCalendar
    calendars={
      createListCalendarResponse(number('Calendar item', 1, { min: 0 }), {
        activeGroups: boolean('Calendar connected to Group', true),
        incompleteWorkingGroups: boolean(
          'Calendar connected to Working Group',
          true,
        ),
      }).items
    }
  />
);
