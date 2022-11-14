import { render } from '@testing-library/react';
import { createUserResponse } from '@asap-hub/fixtures';
import DashboardRecommendedUsers from '../DashboardRecommendedUsers';

it('renders the dashboard recommended users', () => {
  const { getByRole } = render(
    <DashboardRecommendedUsers
      recommendedUsers={[
        {
          ...createUserResponse(),
          displayName: 'John Doe',
        },
        {
          ...createUserResponse(),
          displayName: 'Octavian Ratiu',
        },
        {
          ...createUserResponse(),
          displayName: 'User 3',
        },
      ]}
    />,
  );
  expect(getByRole('link', { name: 'John Doe' })).toBeVisible();
  expect(getByRole('link', { name: 'Octavian Ratiu' })).toBeVisible();
  expect(getByRole('link', { name: 'User 3' })).toBeVisible();
});
