import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import GroupCard from '../GroupCard';

const props: ComponentProps<typeof GroupCard> = {
  id: '42',
  name: 'My Group',
  tags: ['Tag 1', 'Tag 2'],
  description: 'My Group Description',
  numberOfTeams: 2,
  active: true,
};

it('renders the group name linking to the group', () => {
  const { getByText } = render(
    <GroupCard {...props} id="42" name="My Group" />,
  );
  expect(getByText('My Group').closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/42$/),
  );
});

it('renders the state tag for a inactive group', () => {
  const { getByText } = render(
    <GroupCard {...props} id="42" name="My Group" active={false} />,
  );
  expect(getByText('Inactive')).toBeVisible();
});

it('generates a singular team count', () => {
  const { getByText } = render(<GroupCard {...props} numberOfTeams={1} />);
  expect(getByText(/1 team(\s|$)/i)).toBeVisible();
});

it('generates a plural team count', () => {
  const { getByText } = render(<GroupCard {...props} numberOfTeams={2} />);
  expect(getByText(/2 teams/i)).toBeVisible();
});
