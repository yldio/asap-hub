import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import InterestGroupCard from '../InterestGroupCard';

const props: ComponentProps<typeof InterestGroupCard> = {
  id: '42',
  name: 'My Group',
  tags: [
    { id: '1', name: 'Tag 1' },
    { id: '2', name: 'Tag 2' },
  ],
  description: 'My Interest Group Description',
  numberOfTeams: 2,
  active: true,
};

it('renders the group name linking to the group', () => {
  const { getByText } = render(
    <InterestGroupCard {...props} id="42" name="My Group" />,
  );
  expect(getByText('My Group').closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/42$/),
  );
});

it('renders the state tag for a inactive group', () => {
  const { getByText, getByTitle, rerender, queryByText } = render(
    <InterestGroupCard {...props} active={false} />,
  );
  expect(getByText('Inactive', { selector: 'span' })).toBeVisible();
  expect(getByTitle('Inactive Interest Group')).toBeInTheDocument();
  rerender(<InterestGroupCard {...props} active={true} />);
  expect(queryByText('Inactive')).not.toBeInTheDocument();
});

it('renders the link to google drive if present', () => {
  const { rerender, queryByRole } = render(
    <InterestGroupCard {...props} id="42" name="My Group" />,
  );
  expect(
    queryByRole('link', { name: /access drive/i }),
  ).not.toBeInTheDocument();
  rerender(
    <InterestGroupCard
      {...props}
      id="42"
      name="My Group"
      googleDrive="http://drive.google.com/123"
    />,
  );
  expect(queryByRole('link', { name: /access drive/i })).toBeVisible();
});

it('generates a singular team count', () => {
  const { getByText } = render(
    <InterestGroupCard {...props} numberOfTeams={1} />,
  );
  expect(getByText(/1 team(\s|$)/i)).toBeVisible();
});

it('generates a plural team count', () => {
  const { getByText } = render(
    <InterestGroupCard {...props} numberOfTeams={2} />,
  );
  expect(getByText(/2 teams/i)).toBeVisible();
});
