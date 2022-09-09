import { createEventResponse } from '@asap-hub/fixtures';
import { EventResponse } from '@asap-hub/model';
import { PastEventsDashboardCard } from '@asap-hub/react-components';
import { date, number, select, text } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Dashboard / Past Events',
  component: PastEventsDashboardCard,
};

const event = (): EventResponse => ({
  ...createEventResponse({}),
  startDate: new Date(date('Start Date')).toISOString(),
  title: text('Event Title', 'An Event'),
  presentation: select(
    'Presentation',
    {
      Available: 'Something',
      'Coming Soon': undefined,
      Unavailable: null,
    },
    undefined,
  ),
  notes: select(
    'Notes',
    {
      Available: 'Something',
      'Coming Soon': undefined,
      Unavailable: null,
    },
    undefined,
  ),
  videoRecording: select(
    'Video',
    {
      Available: 'Something',
      'Coming Soon': undefined,
      Unavailable: null,
    },
    undefined,
  ),
});
export const Normal = () => (
  <PastEventsDashboardCard
    events={Array(number('Number of events', 4)).fill(
      event(),
      0,
      number('Number of events', 4),
    )}
  />
);
