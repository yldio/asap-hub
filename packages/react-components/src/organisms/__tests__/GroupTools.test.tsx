import { render, fireEvent } from '@testing-library/react';
import { ComponentProps } from 'react';

import GroupTools from '../GroupTools';

const props: ComponentProps<typeof GroupTools> = {
  tools: {},
  active: true,
};

it('renders group tools header', () => {
  const { getByRole } = render(<GroupTools {...props} />);
  expect(getByRole('heading').textContent).toMatchInlineSnapshot(
    `"Group Tools"`,
  );
});

it('renders a slack tool', () => {
  const { getByRole, getByTitle, getByText } = render(
    <GroupTools {...props} tools={{ slack: 'http://asap.slack.com' }} />,
  );
  expect(getByText(/join slack/i)).toBeVisible();
  expect(getByTitle('Slack')).toBeInTheDocument();
  expect(getByRole('link')).toHaveAttribute('href', 'http://asap.slack.com');
});

it('renders a google drive tool', () => {
  const { getByRole, getByTitle, getByText } = render(
    <GroupTools
      {...props}
      tools={{ googleDrive: 'http://drive.google.com/123' }}
    />,
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
    <GroupTools {...props} calendarId="12w3" />,
  );

  const subscribe = getByText(/subscribe/i);
  expect(subscribe).toBeVisible();
  fireEvent.click(subscribe);

  expect(queryAllByRole('link').map((s) => s.getAttribute('href')))
    .toMatchInlineSnapshot(`
    Array [
      "https://calendar.google.com/calendar/r?cid=12w3",
      "webcal://calendar.google.com/calendar/ical/12w3/public/basic.ics",
    ]
  `);
});

it('hides the subscribe button for inactive groups', () => {
  const { getByText, queryByText, rerender } = render(
    <GroupTools {...props} calendarId="12w3" active={true} />,
  );
  expect(getByText(/subscribe/i)).toBeVisible();
  rerender(<GroupTools {...props} calendarId="12w3" active={false} />);
  expect(queryByText(/subscribe/i)).not.toBeInTheDocument();
});
