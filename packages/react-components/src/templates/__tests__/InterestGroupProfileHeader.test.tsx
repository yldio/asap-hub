import { ComponentProps } from 'react';
import { StaticRouter } from 'react-router-dom/server';
import { networkRoutes, searchQueryParam } from '@asap-hub/routing';
import { render, screen } from '@testing-library/react';
import subYears from 'date-fns/subYears';
import userEvent from '@testing-library/user-event';

import InterestGroupProfileHeader from '../InterestGroupProfileHeader';

const props: ComponentProps<typeof InterestGroupProfileHeader> = {
  id: '42',
  active: true,
  name: 'Group Name',
  numberOfTeams: 2,
  lastModifiedDate: '2021-01-01',
  groupTeamsHref: '#teams',
  pastEventsCount: 2,
  upcomingEventsCount: 3,
  tools: {},
  contactEmails: [],
};

it('renders the name as a heading', () => {
  render(<InterestGroupProfileHeader {...props} name="My Group" />);
  expect(screen.getByRole('heading')).toHaveTextContent('My Group');
});

it('renders the tag for inactive groups', () => {
  render(
    <InterestGroupProfileHeader {...props} name="My Group" active={false} />,
  );
  expect(screen.getByText('Inactive', { selector: 'span' })).toBeVisible();
  expect(screen.getByTitle('Inactive Interest Group')).toBeInTheDocument();
});

it('renders group google drive link if present', () => {
  const { queryByRole, rerender } = render(
    <InterestGroupProfileHeader {...props} />,
  );
  expect(
    queryByRole('link', { name: /access drive/i }),
  ).not.toBeInTheDocument();
  rerender(
    <InterestGroupProfileHeader
      {...props}
      tools={{ googleDrive: 'http://drive.google.com/123' }}
    />,
  );
  expect(queryByRole('link', { name: /access drive/i })).toBeVisible();
});

it('renders group calendar link if present and group is active', () => {
  const { queryByRole, rerender } = render(
    <InterestGroupProfileHeader {...props} calendarId="1234" active={false} />,
  );
  expect(queryByRole('button', { name: /calendar/i })).not.toBeInTheDocument();
  rerender(<InterestGroupProfileHeader {...props} calendarId="1234" />);
  expect(queryByRole('button', { name: /calendar/i })).toBeVisible();
});

it('copy button adds emails to clipboard', async () => {
  Object.assign(navigator, {
    clipboard: {
      writeText: jest.fn(),
    },
  });
  jest.spyOn(navigator.clipboard, 'writeText');
  render(
    <InterestGroupProfileHeader
      {...props}
      contactEmails={['test@example.com', 'contact@example.com']}
    />,
  );
  const copyButton = screen.getByRole('button', { name: 'Copy' });
  expect(copyButton).toBeVisible();
  userEvent.click(copyButton);
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
    'test@example.com,contact@example.com',
  );
});

it('shows the number of teams and links to them', () => {
  render(<InterestGroupProfileHeader {...props} numberOfTeams={1} />);
  expect(screen.getByText(/1 team(\s|$)/i).closest('a')).toHaveAttribute(
    'href',
  );
});

it('does not show the number of teams and links to them if the group is inactive', () => {
  render(
    <InterestGroupProfileHeader {...props} numberOfTeams={1} active={false} />,
  );
  expect(screen.queryByText(/1 team(\s|$)/i)).not.toBeInTheDocument();
});

it('pluralizes the number of teams', () => {
  render(<InterestGroupProfileHeader {...props} numberOfTeams={2} />);
  expect(screen.getByText(/2 teams(\s|$)/i)).toBeVisible();
});

it('shows the last updated date', () => {
  render(
    <InterestGroupProfileHeader
      {...props}
      lastModifiedDate={subYears(new Date(), 1).toISOString()}
    />,
  );
  expect(screen.getByText(/1 year/).textContent).toMatchInlineSnapshot(
    `"Last updated: about 1 year ago"`,
  );
});

it('renders the navigation for active and inactive groups', () => {
  const { rerender } = render(
    <InterestGroupProfileHeader {...props} active={true} />,
  );
  expect(
    screen.getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual(['About', 'Calendar', 'Upcoming Events (3)', 'Past Events (2)']);

  rerender(<InterestGroupProfileHeader {...props} active={false} />);
  expect(
    screen.getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual(['About', 'Past Events (2)']);
});

it('preserves the search query when navigating', () => {
  render(
    <StaticRouter
      location={networkRoutes.DEFAULT.INTEREST_GROUPS.DETAILS.UPCOMING.buildPath(
        { interestGroupId: '42' },
      )}
    >
      <InterestGroupProfileHeader {...props} searchQuery="searchterm" />
    </StaticRouter>,
  );
  expect(
    new URL(screen.getByText(/past/i).closest('a')!.href).searchParams.get(
      searchQueryParam,
    ),
  ).toBe('searchterm');
});

it('displays number of upcoming events', () => {
  render(
    <StaticRouter
      location={networkRoutes.DEFAULT.INTEREST_GROUPS.DETAILS.UPCOMING.buildPath(
        { interestGroupId: '42' },
      )}
    >
      <InterestGroupProfileHeader {...props} upcomingEventsCount={10} />
    </StaticRouter>,
  );
  expect(screen.queryByText('Upcoming Events (10)')).toBeInTheDocument();
});

it('displays number of past events', () => {
  render(
    <StaticRouter
      location={networkRoutes.DEFAULT.INTEREST_GROUPS.DETAILS.UPCOMING.buildPath(
        { interestGroupId: '42' },
      )}
    >
      <InterestGroupProfileHeader {...props} pastEventsCount={12} />
    </StaticRouter>,
  );
  expect(screen.queryByText('Past Events (12)')).toBeInTheDocument();
});
