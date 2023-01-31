import { CalendarList } from '@asap-hub/react-components';
import { text } from '@storybook/addon-knobs';

import { googleLegacyCalendarColor } from './colors';

export default {
  title: 'Organisms / Calendar List',
  component: CalendarList,
};

export const Normal = () => (
  <CalendarList
    title={text('Title', 'Subscribe to Interest Groups on Calendar')}
    description={text(
      'Description',
      'By hitting the subscribe button below, you will be able to add the calendar to your personal calendar.',
    )}
    calendars={[
      {
        color: googleLegacyCalendarColor('Calendar 1 Color'),
        id: '123',
        name: text('Calendar 1 Name', 'ASAP Calendar'),
        groups: [],
        workingGroups: [],
      },
      {
        color: googleLegacyCalendarColor('Calendar 2 Color'),
        id: '234',
        name: text('Calendar 2 Name', 'Sci 1 - GWAS Functional', '2'),
        groups: [],
        workingGroups: [],
      },
      {
        color: googleLegacyCalendarColor('Calendar 3 Color'),
        id: '456',
        name: text('Calendar 3 Name', 'Sci 2 - Aging and Progression', '3'),
        groups: [],
        workingGroups: [],
      },
    ]}
  />
);
