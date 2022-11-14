import { render } from '@testing-library/react';
import { createUserResponse } from '@asap-hub/fixtures';
import RecommendedUser from '../RecommendedUser';

it('renders the recommended user', () => {
  const { getByText, getByRole } = render(
    <RecommendedUser
      user={{
        ...createUserResponse(),
        id: 'user-1',
        firstName: 'Test',
        lastName: 'User',
        displayName: 'Test User',
        expertiseAndResourceTags: ['Tag 1'],
        avatarUrl:
          'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y',
        teams: [{ id: 'team-1', displayName: 'Team 1', role: 'Key Personnel' }],
      }}
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

it('renders all the tags', () => {
  const { getByText, queryByText } = render(
    <RecommendedUser
      user={{
        ...createUserResponse(),
        expertiseAndResourceTags: [
          'Tag 1',
          'Tag 2',
          'Tag 3',
          'Tag 4',
          'Tag 5',
          'Tag 6',
        ],
      }}
    />,
  );

  expect(getByText('Tag 1')).toBeVisible();
  expect(getByText('Tag 2')).toBeVisible();
  expect(getByText('Tag 3')).toBeVisible();
  expect(getByText('Tag 4')).toBeVisible();
  expect(getByText('Tag 5')).toBeVisible();
  expect(queryByText('Tag 6')).not.toBeInTheDocument();
  expect(getByText('+1')).toBeVisible();
});
