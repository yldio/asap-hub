import React, { ComponentProps } from 'react';
import { EventsPage, EventsCalendar } from '@asap-hub/react-components';
import { number } from '@storybook/addon-knobs';
import { createListCalendarResponse } from '@asap-hub/fixtures';

import { LayoutDecorator } from './layout';

export default {
  title: 'Pages / Events Page',
  decorators: [LayoutDecorator],
};

const { items: calendars } = createListCalendarResponse();

const commonProps = (): ComponentProps<typeof EventsCalendar> => ({
  calendars: calendars.slice(
    0,
    number('Calendar item', calendars.length, {
      min: 0,
      max: calendars.length,
    }),
  ),
});

export const Calendar = () => (
  <EventsPage>
    <EventsCalendar {...commonProps()} />
  </EventsPage>
);
