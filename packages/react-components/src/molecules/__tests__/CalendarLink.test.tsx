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

describe('Copies text to clipboard', () => {
  const originalNavigator = window.navigator;
  Object.assign(window.navigator, {
    clipboard: {
      writeText: () => {},
    },
  });

  beforeEach(() => {
    jest.spyOn(window.navigator.clipboard, 'writeText');
  });
  afterEach(() => {
    Object.assign(window.navigator, originalNavigator);
  });

  it('copies the calendar link to clipboard', () => {
    const { getByRole, getByText } = render(<CalendarLink id="12345" />);

    fireEvent.click(getByRole('button'));
    fireEvent.click(getByText(/Copy link/i));
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith(
      expect.stringMatching(/12345/i),
    );
  });
});
