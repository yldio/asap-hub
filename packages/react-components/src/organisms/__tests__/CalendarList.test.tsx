import React from 'react';
import { render } from '@testing-library/react';

import CalendarList from '../CalendarList';

it('Renders calender list', () => {
  const { getByRole } = render(<CalendarList calendars={[]} />);
  expect(getByRole('heading').textContent).toMatch(/subscribe/i);
});

it('Renders calender list item with colour', () => {
  const { getByText } = render(
    <CalendarList
      calendars={[
        {
          colour: 'red',
          name: 'Test Event',
          id: '1',
        },
      ]}
    />,
  );
  expect(getComputedStyle(getByText('●')).color).toMatch('red');
  expect(getByText('Test Event')).toBeVisible();
});

it('Correctly generates the subscribe link', () => {
  const { getByRole } = render(
    <CalendarList
      calendars={[
        {
          colour: 'red',
          name: 'Test Event',
          id: '1',
        },
      ]}
    />,
  );
  expect(getByRole('link')).toHaveAttribute(
    'href',
    'https://calendar.google.com/calendar/u/1/r?cid=1',
  );
});
