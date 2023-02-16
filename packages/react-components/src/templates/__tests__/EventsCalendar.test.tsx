import { render, screen } from '@testing-library/react';

import EventsCalendar from '../EventsCalendar';

it('renders the google calendar', () => {
  render(
    <EventsCalendar
      calendars={[
        {
          color: '#0D7813',
          name: 'Test Calendar',
          id: '1',
          groups: [{ id: '1', active: false }],
          workingGroups: [{ id: '2', complete: true }],
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
