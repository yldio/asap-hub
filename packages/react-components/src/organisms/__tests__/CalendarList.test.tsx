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
          color: '#0D7813',
          name: 'Test Event',
          id: '1',
        },
      ]}
    />,
  );
  expect(getComputedStyle(getByText('●')).color).toMatch('rgb(13, 120, 19)');
  expect(getByText('Test Event')).toBeVisible();
});

it('Correctly generates the subscribe link', () => {
  const { getByRole } = render(
    <CalendarList
      calendars={[
        {
          color: '#113F47',
          name: 'Test Event',
          id: '1',
        },
      ]}
    />,
  );
  expect(getByRole('link')).toHaveAttribute(
    'href',
    'https://calendar.google.com/calendar/r?cid=1',
  );
});
