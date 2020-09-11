import React from 'react';
import { render } from '@testing-library/react';

import PeopleCard from '../PeopleCard';

const props = {
  displayName: 'Jane Doe',
  teams: [],
  lastModifiedDate: new Date(2020, 6, 12, 14, 32).toISOString(),
  createdDate: new Date(2020, 6, 12, 14, 32).toISOString(),
  profileHref: 'http://localhost/users/321',
  teamProfileHref: 'http://localhost/teams/321',
};

it('renders the display name', () => {
  const { getByRole } = render(
    <PeopleCard {...{ ...props, displayName: 'John Doe' }} />,
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

it('Card is clickable', () => {
  const { getByRole } = render(
    <PeopleCard {...{ ...props, profileHref: 'http://localhost/users/123' }} />,
  );
  const { href } = getByRole('link') as HTMLAnchorElement;
  expect(href).toEqual('http://localhost/users/123');
});
