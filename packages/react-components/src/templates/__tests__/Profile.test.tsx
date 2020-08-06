import React from 'react';
import { render } from '@testing-library/react';
import ProfileHeader from '../ProfileHeader';

const tabLinks = {
  aboutHref: './about',
  researchInterestsHref: './research-interests',
  outputsHref: './outputs',
};

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

  const { rerender, getByRole } = render(
    <ProfileHeader {...user} {...tabLinks} />,
  );
  expect(getByRole('heading').textContent).toMatchInlineSnapshot(`"John Doe"`);

  const userWithLocation = {
    ...user,
    location: 'Unknown location',
  };

  rerender(<ProfileHeader {...userWithLocation} {...tabLinks} />);

  expect(getByRole('heading').textContent).toMatchInlineSnapshot(`"John Doe"`);
});
