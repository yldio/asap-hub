import React from 'react';
import { render } from '@testing-library/react';

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

it('renders a google calendar tool', () => {
  const { getByRole, getByTitle, getByText } = render(
    <GroupTools
      tools={{ googleCalendar: 'http://calendar.google.com/r/calendar?12w3' }}
    />,
  );

  expect(getByText(/subscribe to google/i)).toBeVisible();
  expect(getByTitle('Google Calendar')).toBeInTheDocument();
  expect(getByRole('link')).toHaveAttribute(
    'href',
    'http://calendar.google.com/r/calendar?12w3',
  );
});
