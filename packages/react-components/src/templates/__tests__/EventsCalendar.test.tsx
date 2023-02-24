import { render, screen } from '@testing-library/react';

import EventsCalendar from '../EventsCalendar';

it('renders the google calendar', () => {
  render(
    <EventsCalendar
      calendars={[
        {
          color: '#0D7813' as const,
          name: 'Test Calendar',
          id: '1',
        },
      ]}
    />,
  );
  expect(screen.getByTitle('Calendar')).toBeVisible();
});

it('renders the children', () => {
  render(<EventsCalendar calendars={[]}>{'Subscribe'}</EventsCalendar>);
  expect(screen.getByText('Subscribe')).toBeVisible();
});
