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
  const { getAllByRole } = render(
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

  const links = getAllByRole('link').map((e) => e.getAttribute('href'));
  expect(links).toMatchInlineSnapshot(`
    Array [
      "https://support.apple.com/en-us/guide/calendar/icl1022/mac",
      "https://support.microsoft.com/en-us/office/import-or-subscribe-to-a-calendar-in-outlook-com-cff1429c-5af6-41ec-a5b4-74f2c278e98c",
    ]
  `);
});

describe('with the singleGroup prop', () => {
  it('adapts the headline', () => {
    const { getByRole, rerender } = render(<CalendarList calendars={[]} />);
    expect(getByRole('heading')).not.toHaveTextContent(/this group/i);

    rerender(<CalendarList singleGroup calendars={[]} />);
    expect(getByRole('heading')).toHaveTextContent(/this group/i);
  });

  it('hides the description', () => {
    const { getByText, queryByText, rerender } = render(
      <CalendarList calendars={[]} />,
    );
    expect(getByText(/list of.+groups/i)).toBeVisible();

    rerender(<CalendarList singleGroup calendars={[]} />);
    expect(queryByText(/list of.+groups/i)).not.toBeInTheDocument();
  });
});
