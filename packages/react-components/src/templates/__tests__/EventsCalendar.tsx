import { render } from '@testing-library/react';

import EventsCalendar from '../EventsCalendar';

it('Renders calendar list', () => {
  const { getByText } = render(
    <EventsCalendar
      calendars={[
        {
          color: '#0D7813',
          name: 'Test Event',
          id: '1',
          groups: [{ id: '1', active: false }],
          workingGroups: [{ id: '2', complete: true }],
        },
      ]}
    />,
  );
  expect(getByText('Test Event')).toBeVisible();
});

it('Renders the calendar both for working and interest group', () => {
  const { getAllByText } = render(
    <EventsCalendar
      calendars={[
        {
          color: '#0D7813',
          name: 'Test Event',
          id: '1',
          groups: [{ id: '1', active: true }],
          workingGroups: [{ id: '2', complete: false }],
        },
      ]}
    />,
  );
  expect(getAllByText('Test Event').length).toEqual(2);
});
