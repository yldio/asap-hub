import { render, fireEvent } from '@testing-library/react';

import CalendarLink from '../CalendarLink';

const originalUserAgent = window.navigator.userAgent;

const setUserAgent = (userAgent: string) => {
  Object.defineProperty(window.navigator, 'userAgent', {
    configurable: true,
    value: userAgent,
  });
};

afterEach(() => {
  setUserAgent(originalUserAgent);
});

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

it('renders Outlook links on Windows', () => {
  setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');

  const { getByRole, getAllByRole } = render(
    <CalendarLink id="hub@asap.science" />,
  );

  fireEvent.click(getByRole('button'));
  const items = getAllByRole('link').map((e) => e.getAttribute('href'));
  expect(items).toMatchInlineSnapshot(`
    [
      "https://calendar.google.com/calendar/r?cid=hub%40asap.science",
      "webcal:https://calendar.google.com/calendar/ical/hub%40asap.science/public/basic.ics",
      "webcal://calendar.google.com/calendar/ical/hub%40asap.science/public/basic.ics",
      "webcal://calendar.google.com/calendar/ical/hub%40asap.science/public/basic.ics",
    ]
  `);
});

it('does not render Outlook links outside Windows', () => {
  setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)');

  const { getByRole, getAllByRole, queryByText } = render(
    <CalendarLink id="hub@asap.science" />,
  );

  fireEvent.click(getByRole('button'));

  expect(queryByText(/Add to Outlook$/i)).not.toBeInTheDocument();
  expect(queryByText(/Add to Outlook \(classic\)/i)).not.toBeInTheDocument();
  expect(getAllByRole('link').map((e) => e.getAttribute('href')))
    .toMatchInlineSnapshot(`
    [
      "https://calendar.google.com/calendar/r?cid=hub%40asap.science",
      "webcal://calendar.google.com/calendar/ical/hub%40asap.science/public/basic.ics",
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
      'https://calendar.google.com/calendar/ical/12345/public/basic.ics',
    );
  });
});
