import { render, fireEvent } from '@testing-library/react';

import CalendarLink from '../CalendarLink';

it('renders a subscribe button', () => {
  const { getByRole } = render(<CalendarLink id="123" />);

  const link = getByRole('button');
  expect(link.textContent).toContain('Subscribe');
});

it('renders a subscribe button with custom text', () => {
  const { getByRole } = render(<CalendarLink id="123">Text</CalendarLink>);

  const link = getByRole('button');
  expect(link.textContent).toContain('Text');
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
    ]
  `);
});

it('renders calendar links on modal and hide it on click outside', () => {
  const { getByRole, getAllByRole, queryAllByRole } = render(
    <>
      <h1>Element</h1>
      <CalendarLink id="123" />
    </>,
  );

  fireEvent.click(getByRole('button'));
  getAllByRole('listitem').forEach((e) => expect(e).toBeVisible());
  fireEvent.mouseDown(getByRole('heading'));
  queryAllByRole('listitem').forEach((e) => expect(e).not.toBeVisible());
});
