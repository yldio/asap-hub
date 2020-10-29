import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import ProfilePage from '../ProfilePage';

const boilerplateProps: Omit<ComponentProps<typeof ProfilePage>, 'children'> = {
  firstName: 'John',
  displayName: 'John Doe',
  lastModifiedDate: new Date(2020, 6, 12, 14, 32).toISOString(),
  teams: [],
  email: 'test@test.com',
  aboutHref: '#',
  outputsHref: '#',
  researchHref: '#',
  role: 'Grantee',
};

it('renders the header', () => {
  const { getByText } = render(
    <ProfilePage {...boilerplateProps} displayName="John Doe">
      Tab Content
    </ProfilePage>,
  );
  expect(getByText('John Doe')).toBeVisible();
});

it('renders the children', () => {
  const { getByText } = render(
    <ProfilePage {...boilerplateProps}>Tab Content</ProfilePage>,
  );
  expect(getByText('Tab Content')).toBeVisible();
});
