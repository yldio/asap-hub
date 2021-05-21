import { ComponentProps } from 'react';
import { StaticRouter } from 'react-router-dom';
import { network, searchQueryParam } from '@asap-hub/routing';
import { render } from '@testing-library/react';
import subYears from 'date-fns/subYears';

import GroupProfileHeader from '../GroupProfileHeader';

const props: ComponentProps<typeof GroupProfileHeader> = {
  id: '42',
  name: 'Group Name',
  numberOfTeams: 2,
  lastModifiedDate: '2021-01-01',
  groupTeamsHref: '#teams',
};

it('renders the name as a heading', () => {
  const { getByRole } = render(
    <GroupProfileHeader {...props} name="My Group" />,
  );
  expect(getByRole('heading')).toHaveTextContent('My Group');
});

it('shows the number of teams and links to them', () => {
  const { getByText } = render(
    <GroupProfileHeader {...props} numberOfTeams={1} />,
  );
  expect(getByText(/1 team(\s|$)/i).closest('a')).toHaveAttribute('href');
});
it('pluralizes the number of teams', () => {
  const { getByText } = render(
    <GroupProfileHeader {...props} numberOfTeams={2} />,
  );
  expect(getByText(/2 teams(\s|$)/i)).toBeVisible();
});

it('shows the last updated date', () => {
  const { getByText } = render(
    <GroupProfileHeader
      {...props}
      lastModifiedDate={subYears(new Date(), 1).toISOString()}
    />,
  );
  expect(getByText(/1 year/).textContent).toMatchInlineSnapshot(
    `"Last updated: about 1 year ago"`,
  );
});

it('renders the navigation', () => {
  const { getAllByRole } = render(<GroupProfileHeader {...props} />);
  expect(
    getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual(['About', 'Calendar', 'Upcoming Events', 'Past Events']);
});

it('preserves the search query when navigating', () => {
  const { getByText } = render(
    <StaticRouter
      location={network({}).groups({}).group({ groupId: '42' }).upcoming({}).$}
    >
      <GroupProfileHeader {...props} searchQuery="searchterm" />
    </StaticRouter>,
  );
  expect(
    new URL(getByText(/past/i).closest('a')!.href).searchParams.get(
      searchQueryParam,
    ),
  ).toBe('searchterm');
});
