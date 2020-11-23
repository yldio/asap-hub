import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import UserProfilePage from '../UserProfilePage';

const boilerplateProps: Omit<
  ComponentProps<typeof UserProfilePage>,
  'children'
> = {
  firstName: 'John',
  lastName: 'Doe',
  displayName: 'John Doe',
  lastModifiedDate: new Date(2020, 6, 12, 14, 32).toISOString(),
  teams: [],
  email: 'test@test.com',
  aboutHref: '#',
  outputsHref: '#',
  researchHref: '#',
  discoverHref: '#',
  role: 'Grantee',
};

it('renders the header', () => {
  const { getByText } = render(
    <UserProfilePage {...boilerplateProps} displayName="John Doe">
      Tab Content
    </UserProfilePage>,
  );
  expect(getByText('John Doe')).toBeVisible();
});

it('renders the children', () => {
  const { getByText } = render(
    <UserProfilePage {...boilerplateProps}>Tab Content</UserProfilePage>,
  );
  expect(getByText('Tab Content')).toBeVisible();
});
