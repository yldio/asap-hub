import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';

import PeopleCard from '../PeopleCard';

const props: ComponentProps<typeof PeopleCard> = {
  displayName: 'Jane Doe',
  teams: [
    {
      id: '321',
      displayName: 'Team 321',
      role: 'Team Role',
      href: 'http://localhost/teams/321',
    },
  ],
  createdDate: new Date(2020, 6, 12, 14, 32).toISOString(),
  href: 'http://localhost/users/321',
};

it('renders the display name', () => {
  const { getByRole } = render(
    <PeopleCard {...props} displayName="John Doe" />,
  );
  expect(getByRole('heading').textContent).toEqual('John Doe');
  expect(getByRole('heading').tagName).toEqual('H2');
});

it('renders the date in the correct format', () => {
  const { getByText } = render(<PeopleCard {...props} />);
  expect(getByText(/joined/i).textContent).toMatchInlineSnapshot(
    `"Joined: 7th July 2020"`,
  );
});

it('links to the profile', () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={['/card']}>
      <Route path="/card">
        <PeopleCard {...props} displayName="John Doe" href="/profile" />,
      </Route>
      <Route path="/profile">Full Profile</Route>
    </MemoryRouter>,
  );

  userEvent.click(getByText('John Doe'));
  expect(getByText('Full Profile')).toBeVisible();
});
