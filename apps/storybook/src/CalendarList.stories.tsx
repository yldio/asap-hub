import { ComponentProps } from 'react';

import { CalendarList } from '@asap-hub/react-components';
import { select, text } from '@storybook/addon-knobs';

import { googleLegacyCalendarColor } from './colors';

export default {
  title: 'Organisms / Calendar List',
  component: CalendarList,
};

export const Normal = () => (
  <CalendarList
    page={select<ComponentProps<typeof CalendarList>['page']>(
      'Page',
      ['event', 'calendar', 'group', 'calendar-working-group'],
      'calendar',
    )}
    calendars={[
      {
        color: googleLegacyCalendarColor('Calendar 1 Color'),
        id: '123',
        name: text('Calendar 1 Name', 'ASAP Calendar'),
      },
      {
        color: googleLegacyCalendarColor('Calendar 2 Color'),
        id: '234',
        name: text('Calendar 2 Name', 'Sci 1 - GWAS Functional', '2'),
      },
      {
        color: googleLegacyCalendarColor('Calendar 3 Color'),
        id: '456',
        name: text('Calendar 3 Name', 'Sci 2 - Aging and Progression', '3'),
      },
    ]}
  />
);
