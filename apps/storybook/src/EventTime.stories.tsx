import { ComponentProps } from 'react';
import { EventTime } from '@asap-hub/react-components';
import { date } from './knobs';

import { CenterDecorator } from './layout';
import { timezone } from './date';

export default {
  title: 'Molecules / Events / Time',
  component: EventTime,
  decorators: [CenterDecorator],
};

const props = (): ComponentProps<typeof EventTime> => ({
  startDate: new Date(
    date('Start Date (in your local time)', new Date(2021, 8, 6, 18)),
  ).toISOString(),
  startDateTimeZone: timezone('Original Start Time Zone'),
  endDate: new Date(
    date('End Date (in your local time)', new Date(2021, 8, 6, 20)),
  ).toISOString(),
  endDateTimeZone: timezone('Original End Time Zone'),
});

export const Normal = () => <EventTime {...props()} />;
