import { EventsCalendar } from '@asap-hub/react-components';
import { createListCalendarResponse } from '@asap-hub/fixtures';
import { boolean, number } from '@storybook/addon-knobs';

export default {
  title: 'Templates / Events / Calendar',
};

export const Normal = () => (
  <EventsCalendar
    calendars={
      createListCalendarResponse(number('Calendar item', 1, { min: 0 }), {
        group: boolean('Calendar connected to Group', true),
        workingGroup: boolean('Calendar connected to Working Group', true),
      }).items
    }
  />
);
