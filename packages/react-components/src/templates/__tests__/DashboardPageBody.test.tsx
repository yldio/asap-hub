import { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import { createPageResponse } from '@asap-hub/fixtures';
import { disable } from '@asap-hub/flags';

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
  pages: [createPageResponse('1'), createPageResponse('2')],
  userId: '42',
  teamId: '1337',
  roles: [],
  reminders: [],
};

it('renders multiple news cards', () => {
  render(<DashboardPageBody {...props} />);
  expect(
    screen
      .queryAllByText(/title/i, { selector: 'h4' })
      .map(({ textContent }) => textContent),
  ).toEqual(['Page 1 title', 'Page 2 title', 'News Title', 'Event Title']);
});

it('renders news section when there are no news', () => {
  render(<DashboardPageBody {...props} news={[]} />);

  expect(screen.queryByText('Latest news from ASAP')).not.toBeInTheDocument();
  expect(
    screen.getAllByRole('heading').map(({ textContent }) => textContent),
  ).toEqual(expect.arrayContaining(['Page 1 title', 'Page 2 title']));
});

it('renders news section when there are no pages', () => {
  render(<DashboardPageBody {...props} pages={[]} />);
  expect(
    screen.queryByText('Not sure where to start?'),
  ).not.toBeInTheDocument();
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

describe('the reminders card', () => {
  it('does not show reminders when the feature flag is disabled (REGRESSION)', () => {
    const { rerender } = render(<DashboardPageBody {...props} />);
    expect(screen.getByText(/remind/i, { selector: 'h2' })).toBeVisible();
    disable('REMINDERS');
    rerender(<DashboardPageBody {...props} />);
    expect(screen.queryByText(/remind/i, { selector: 'h2' })).toBeNull();
  });

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
