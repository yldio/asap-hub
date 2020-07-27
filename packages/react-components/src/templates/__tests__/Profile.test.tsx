import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import Profile from '../Profile';

const Component = (props: ComponentProps<typeof Profile>) => (
  <MemoryRouter initialEntries={['/']}>
    <Route exact path="/" component={() => <Profile {...props} />} />
  </MemoryRouter>
);

it('renders profile', () => {
  const user = {
    department: 'Unkown department',
    displayName: 'John Doe',
    initials: 'JD',
    institution: 'Unknown institution',
    lastModified: new Date(),
    role: 'Unknown role',
    team: 'Unkown team',
    title: 'Unknown title',
  };

  const { rerender, getByRole } = render(<Component {...user} />);
  expect(getByRole('heading').textContent).toMatchInlineSnapshot(`"John Doe"`);

  const userWithLocation = {
    ...user,
    location: 'Unknown location',
  };

  rerender(<Component {...userWithLocation} />);

  expect(getByRole('heading').textContent).toMatchInlineSnapshot(`"John Doe"`);
});
