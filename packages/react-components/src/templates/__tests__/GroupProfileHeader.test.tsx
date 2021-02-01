import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import subYears from 'date-fns/subYears';

import GroupProfileHeader from '../GroupProfileHeader';

const props: ComponentProps<typeof GroupProfileHeader> = {
  name: 'Group Name',
  numberOfTeams: 2,
  groupTeamsHref: '#teams',
  lastModifiedDate: '2021-01-01',
  aboutHref: '/about',
  calendarHref: '/calendar',
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
