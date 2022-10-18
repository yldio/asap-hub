import { ComponentProps } from 'react';
import { StaticRouter } from 'react-router-dom';
import { network, searchQueryParam } from '@asap-hub/routing';
import { render, screen } from '@testing-library/react';
import subYears from 'date-fns/subYears';

import GroupProfileHeader from '../GroupProfileHeader';

const props: ComponentProps<typeof GroupProfileHeader> = {
  id: '42',
  active: true,
  name: 'Group Name',
  numberOfTeams: 2,
  lastModifiedDate: '2021-01-01',
  groupTeamsHref: '#teams',
  pastEventsCount: 2,
  upcomingEventsCount: 3,
};

it('renders the name as a heading', () => {
  render(<GroupProfileHeader {...props} name="My Group" />);
  expect(screen.getByRole('heading')).toHaveTextContent('My Group');
});

it('renders the tag for inactive groups', () => {
  render(<GroupProfileHeader {...props} name="My Group" active={false} />);
  expect(screen.getByText('Inactive', { selector: 'span' })).toBeVisible();
  expect(screen.getByTitle('Inactive')).toBeInTheDocument();
});

it('shows the number of teams and links to them', () => {
  render(<GroupProfileHeader {...props} numberOfTeams={1} />);
  expect(screen.getByText(/1 team(\s|$)/i).closest('a')).toHaveAttribute(
    'href',
  );
});

it('does not show the number of teams and links to them if the group is inactive', () => {
  render(<GroupProfileHeader {...props} numberOfTeams={1} active={false} />);
  expect(screen.queryByText(/1 team(\s|$)/i)).not.toBeInTheDocument();
});

it('pluralizes the number of teams', () => {
  render(<GroupProfileHeader {...props} numberOfTeams={2} />);
  expect(screen.getByText(/2 teams(\s|$)/i)).toBeVisible();
});

it('shows the last updated date', () => {
  render(
    <GroupProfileHeader
      {...props}
      lastModifiedDate={subYears(new Date(), 1).toISOString()}
    />,
  );
  expect(screen.getByText(/1 year/).textContent).toMatchInlineSnapshot(
    `"Last updated: about 1 year ago"`,
  );
});

it('renders the navigation for active and inactive groups', () => {
  const { rerender } = render(<GroupProfileHeader {...props} active={true} />);
  expect(
    screen.getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual(['About', 'Calendar', 'Upcoming Events (3)', 'Past Events (2)']);

  rerender(<GroupProfileHeader {...props} active={false} />);
  expect(
    screen.getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual(['About', 'Past Events (2)']);
});

it('preserves the search query when navigating', () => {
  render(
    <StaticRouter
      location={network({}).groups({}).group({ groupId: '42' }).upcoming({}).$}
    >
      <GroupProfileHeader {...props} searchQuery="searchterm" />
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
      location={network({}).groups({}).group({ groupId: '42' }).upcoming({}).$}
    >
      <GroupProfileHeader {...props} upcomingEventsCount={10} />
    </StaticRouter>,
  );
  expect(screen.queryByText('Upcoming Events (10)')).toBeInTheDocument();
});

it('displays number of past events', () => {
  render(
    <StaticRouter
      location={network({}).groups({}).group({ groupId: '42' }).upcoming({}).$}
    >
      <GroupProfileHeader {...props} pastEventsCount={12} />
    </StaticRouter>,
  );
  expect(screen.queryByText('Past Events (12)')).toBeInTheDocument();
});
