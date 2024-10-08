import { render, screen } from '@testing-library/react';
import { createTeamResponseMembers } from '@asap-hub/fixtures';

import UserAvatarList from '../UserAvatarList';

it('renders a list of members', () => {
  render(
    <UserAvatarList
      fullListRoute="route"
      members={[
        {
          id: '42',
          firstName: 'unknown',
          lastName: 'unknown',
          avatarUrl: 'https://example.com',
        },
      ]}
    />,
  );
  expect(screen.getAllByRole('img')).toHaveLength(1);
});

it('renders no more than 5 members', () => {
  render(
    <UserAvatarList
      fullListRoute="route"
      members={createTeamResponseMembers({ teamMembers: 6 })}
    />,
  );
  expect(screen.getAllByLabelText(/pic.+ of .+/)).toHaveLength(5);
  expect(screen.getByLabelText(/\+1/)).toBeVisible();
});
