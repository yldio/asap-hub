import { render, fireEvent } from '@testing-library/react';

import GroupTools from '../GroupTools';

it('renders group tools header', () => {
  const { getByRole } = render(<GroupTools tools={{}} />);
  expect(getByRole('heading').textContent).toMatchInlineSnapshot(
    `"Group Tools"`,
  );
});

it('renders a slack tool', () => {
  const { getByRole, getByTitle, getByText } = render(
    <GroupTools tools={{ slack: 'http://asap.slack.com' }} />,
  );
  expect(getByText(/join slack/i)).toBeVisible();
  expect(getByTitle('Slack')).toBeInTheDocument();
  expect(getByRole('link')).toHaveAttribute('href', 'http://asap.slack.com');
});

it('renders a google drive tool', () => {
  const { getByRole, getByTitle, getByText } = render(
    <GroupTools tools={{ googleDrive: 'http://drive.google.com/123' }} />,
  );
  expect(getByText('Access Google Drive')).toBeVisible();
  expect(getByTitle('Google Drive')).toBeInTheDocument();
  expect(getByRole('link')).toHaveAttribute(
    'href',
    'http://drive.google.com/123',
  );
});

it('renders the subscribe button', () => {
  const { getByText, queryAllByRole } = render(
    <GroupTools calendarId="12w3" tools={{}} />,
  );

  const subscribe = getByText(/subscribe/i);
  expect(subscribe).toBeVisible();
  fireEvent.click(subscribe);

  expect(queryAllByRole('link').map((s) => s.getAttribute('href')))
    .toMatchInlineSnapshot(`
    Array [
      "https://calendar.google.com/calendar/r?cid=12w3",
      "webcal://calendar.google.com/calendar/ical/12w3/public/basic.ics",
      "webcal://calendar.google.com/calendar/ical/12w3/public/basic.ics",
    ]
  `);
});
