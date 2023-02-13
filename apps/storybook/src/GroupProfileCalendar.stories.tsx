import { createListCalendarResponse } from '@asap-hub/fixtures';
import { GroupProfileCalendar } from '@asap-hub/react-components';
import { number } from '@storybook/addon-knobs';

export default {
  title: 'Templates / Group Profile / Calendar',
  component: GroupProfileCalendar,
};

export const Normal = () => (
  <GroupProfileCalendar
    calendars={
      createListCalendarResponse(number('Number of Group Calendars', 1)).items
    }
    groupType="interest"
  />
);
