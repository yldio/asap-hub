import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import GroupCard from '../GroupCard';

const props: ComponentProps<typeof GroupCard> = {
  name: 'My Group',
  href: '/my-group',
  tags: ['Tag 1', 'Tag 2'],
  description: 'My Group Description',
  numberOfTeams: 2,
};

it('renders the group name linking to the group', () => {
  const { getByText } = render(
    <GroupCard {...props} name="My Group" href="/my-group" />,
  );
  expect(getByText('My Group').closest('a')).toHaveAttribute(
    'href',
    '/my-group',
  );
});

it('generates a singular team count', () => {
  const { getByText } = render(<GroupCard {...props} numberOfTeams={1} />);
  expect(getByText(/1 team(\s|$)/i)).toBeVisible();
});

it('generates a plural team count', () => {
  const { getByText } = render(<GroupCard {...props} numberOfTeams={2} />);
  expect(getByText(/2 teams/i)).toBeVisible();
});
