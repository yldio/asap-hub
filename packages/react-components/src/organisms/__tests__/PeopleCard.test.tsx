import React from 'react';
import { render } from '@testing-library/react';

import PeopleCard from '../PeopleCard';

const props = {
  displayName: 'John Doe',
  teams: [],
  lastModifiedDate: new Date(2020, 6, 12, 14, 32).toISOString(),
  createdDate: new Date(2020, 6, 12, 14, 32).toISOString(),
  profileHref: 'http://localhost/users/123',
};

it('renders the display name', () => {
  const { getByRole } = render(<PeopleCard {...props} />);
  expect(getByRole('heading').textContent).toEqual('John Doe');
  expect(getByRole('heading').tagName).toEqual('H2');
});

it('renders the date in the correct format', () => {
  const { getByText } = render(<PeopleCard {...props} />);
  expect(getByText('Joined: 7th July 2020')).toBeVisible();
});

it('Card is clickable', () => {
  const { getByRole } = render(<PeopleCard {...props} />);
  const { href } = getByRole('link') as HTMLAnchorElement;
  expect(href).toEqual('http://localhost/users/123');
});
