import React, { ComponentProps } from 'react';
import { EventsCalendar } from '@asap-hub/react-components';
import { createListCalendarResponse } from '@asap-hub/fixtures';
import { number } from '@storybook/addon-knobs';

export default {
  title: 'Templates / Events / Calendar',
};

const { items: calendars } = createListCalendarResponse();

const props = (): ComponentProps<typeof EventsCalendar> => ({
  calendars: calendars.slice(0, number('Calendar item', 1, { min: 0, max: 6 })),
});

export const Normal = () => <EventsCalendar {...props()} />;
