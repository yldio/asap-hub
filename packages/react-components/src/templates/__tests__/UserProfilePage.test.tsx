import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createUserResponse } from '@asap-hub/fixtures';

import UserProfilePage from '../UserProfilePage';

const boilerplateProps: Omit<
  ComponentProps<typeof UserProfilePage>,
  'children'
> = createUserResponse();
it('renders the header', () => {
  const { getByText } = render(
    <UserProfilePage {...boilerplateProps} fullDisplayName="John Doe">
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
