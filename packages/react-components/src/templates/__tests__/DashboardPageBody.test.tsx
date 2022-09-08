import { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import { createListEventResponse } from '@asap-hub/fixtures';

import DashboardPageBody from '../DashboardPageBody';

const props: ComponentProps<typeof DashboardPageBody> = {
  news: [
    {
      id: '55724942-3408-4ad6-9a73-14b92226ffb6',
      created: '2020-09-07T17:36:54Z',
      title: 'News Title',
      type: 'News',
    },
    {
      id: '55724942-3408-4ad6-9a73-14b92226ffb77',
      created: '2020-09-07T17:36:54Z',
      title: 'Event Title',
      type: 'Event',
    },
  ],
  userId: '42',
  teamId: '1337',
  roles: [],
  reminders: [],
  dismissedGettingStarted: false,
  upcomingEvents: undefined,
};
it('renders multiple news cards', () => {
  render(
    <DashboardPageBody
      {...props}
      news={[
        {
          id: '55724942-3408-4ad6-9a73-14b92226ffb6',
          created: '2020-09-07T17:36:54Z',
          title: 'News Title 1',
          type: 'News',
        },
        {
          id: '55724942-3408-4ad6-9a73-14b92226ffb77',
          created: '2020-09-07T17:36:54Z',
          title: 'Event Title 1',
          type: 'Event',
        },
      ]}
    />,
  );
  expect(
    screen
      .queryAllByText(/title/i, { selector: 'h4' })
      .map(({ textContent }) => textContent),
  ).toEqual(['News Title 1', 'Event Title 1']);
});

it('renders news section when there are no news', () => {
  render(<DashboardPageBody {...props} news={[]} />);

  expect(screen.queryByText('Latest news from ASAP')).not.toBeInTheDocument();
});

it('renders news section', () => {
  render(<DashboardPageBody {...props} />);

  expect(
    screen.getAllByRole('heading').map(({ textContent }) => textContent),
  ).toEqual(expect.arrayContaining(['News Title', 'Event Title']));
});

it('hides add links to your work space section when user is not a member of a team', () => {
  const { rerender } = render(<DashboardPageBody {...props} teamId="12345" />);
  expect(screen.queryByText(/Add important links/i)).toBeVisible();
  rerender(<DashboardPageBody {...props} teamId={undefined} />);
  expect(screen.queryByText(/Add important links/i)).toBeNull();
});

it('displays events cards or placeholder if there are no events', () => {
  const { rerender } = render(
    <DashboardPageBody
      {...props}
      upcomingEvents={createListEventResponse(4, { customTitle: 'TestEvent' })}
    />,
  );
  expect(screen.getByText('Upcoming Events')).toBeVisible();
  expect(screen.getByText("Here're some upcoming events.")).toBeVisible();
  expect(screen.getByText('TestEvent 1')).toBeVisible();
  expect(screen.getByText('TestEvent 2')).toBeVisible();
  expect(screen.getByText('TestEvent 3')).toBeVisible();
  expect(screen.getByRole('link', { name: 'View All →' })).toBeVisible();

  rerender(<DashboardPageBody {...props} upcomingEvents={undefined} />);
  expect(screen.getByText('Upcoming Events')).toBeVisible();
  expect(screen.getByText("Here're some upcoming events.")).toBeVisible();

  expect(screen.getByText('There are no upcoming events.')).toBeVisible();
});

describe('the reminders card', () => {
  it.each`
    description                                                | roles                                   | selector
    ${'shows messaging for staff'}                             | ${['ASAP Staff']}                       | ${/no reminders/i}
    ${'shows messaging for PMs'}                               | ${['Project Manager']}                  | ${/no reminders/i}
    ${'shows staff messaging for users with one staff role'}   | ${['Key Personnel', 'Project Manager']} | ${/no reminders/i}
    ${'informs other users to contact their project managers'} | ${['Key Personnel']}                    | ${/anything to share /i}
  `('$description', ({ roles, selector }) => {
    render(<DashboardPageBody {...props} roles={roles} />);
    expect(screen.getByText(selector)).toBeVisible();
  });
});
