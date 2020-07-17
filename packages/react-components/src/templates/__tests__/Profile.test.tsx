import React from 'react';
import { render } from '@testing-library/react';

import Profile from '../Profile';

it('renders profile information', () => {
  const { getByRole } = render(
    <Profile
      department=""
      displayName="John Doe"
      initials="JD"
      institution=""
      lastModified={new Date()}
      location="New Haven, Connecticut"
      role=""
      team=""
      title=""
    />,
  );

  expect(getByRole('heading').textContent).toMatchInlineSnapshot(`"John Doe"`);
});

it('renders profile without location', () => {
  const { getByRole } = render(
    <Profile
      department=""
      displayName="John Doe"
      initials="JD"
      institution=""
      lastModified={new Date()}
      role=""
      team=""
      title=""
    />,
  );

  expect(getByRole('heading').textContent).toMatchInlineSnapshot(`"John Doe"`);
});
