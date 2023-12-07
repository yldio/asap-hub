import { render } from '@testing-library/react';
import { createUserAlgoliaResponse } from '@asap-hub/fixtures';
import DashboardRecommendedUsers from '../DashboardRecommendedUsers';

it('renders the dashboard recommended users', () => {
  const { getByRole } = render(
    <DashboardRecommendedUsers
      recommendedUsers={[
        {
          ...createUserAlgoliaResponse(undefined, 0),
          displayName: 'John Doe',
        },
        {
          ...createUserAlgoliaResponse(undefined, 1),
          displayName: 'Octavian Ratiu',
        },
        {
          ...createUserAlgoliaResponse(undefined, 2),
          id: '345',
          displayName: 'User 3',
        },
      ]}
    />,
  );
  expect(getByRole('link', { name: 'John Doe' })).toBeVisible();
  expect(getByRole('link', { name: 'Octavian Ratiu' })).toBeVisible();
  expect(getByRole('link', { name: 'User 3' })).toBeVisible();
});

it('renders the recommended user', () => {
  const { getByText, getByRole } = render(
    <DashboardRecommendedUsers
      recommendedUsers={[
        {
          ...createUserAlgoliaResponse(),
          id: 'user-1',
          firstName: 'Test',
          lastName: 'User',
          displayName: 'Test User',
          _tags: ['Tag 1'],
          avatarUrl:
            'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y',
          teams: [
            { id: 'team-1', displayName: 'Team 1', role: 'Key Personnel' },
          ],
        },
        createUserAlgoliaResponse(undefined, 1),
        createUserAlgoliaResponse(undefined, 2),
      ]}
    />,
  );
  expect(getByRole('link', { name: 'Test User' })).toBeVisible();
  expect(
    getByRole('link', { name: 'Profile picture of Test User' }),
  ).toBeVisible();
  expect(getByText(/Key Personnel/)).toBeVisible();
  expect(getByText('Team 1')).toBeVisible();
  expect(getByText('Tag 1')).toBeVisible();
});
