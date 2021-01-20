import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import CalendarLink from '../CalendarLink';

it('renders a subscribe button', () => {
  const { getByRole } = render(<CalendarLink id="123" />);

  const link = getByRole('button');
  expect(link.textContent).toContain('Subscribe');
});

it('renders a modal on click', () => {
  const { getByRole, getAllByRole } = render(<CalendarLink id="123" />);

  fireEvent.click(getByRole('button'));
  const items = getAllByRole('listitem');
  expect(items.length).toEqual(4);
});

it('renders calendar links on modal', () => {
  const { getByRole, getAllByRole } = render(<CalendarLink id="123" />);

  fireEvent.click(getByRole('button'));
  const items = getAllByRole('link').map((e) => e.getAttribute('href'));
  expect(items).toMatchInlineSnapshot(`
    Array [
      "https://calendar.google.com/calendar/r?cid=123",
      "webcal://calendar.google.com/calendar/ical/123/public/basic.ics",
      "webcal://calendar.google.com/calendar/ical/123/public/basic.ics",
      "webcal://calendar.google.com/calendar/ical/123/public/basic.ics",
    ]
  `);
});
