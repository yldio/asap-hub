import { render, screen } from '@testing-library/react';
import { createTeamResponseMembers } from '@asap-hub/fixtures';

import UsersAvatars from '../UsersAvatars';

it('renders a list of members', () => {
  render(
    <UsersAvatars
      fullListRoute="route"
      members={[
        {
          id: '42',
          displayName: 'Unknown',
          email: 'foo@bar.com',
          avatarUrl: 'https://example.com',
          role: 'Collaborating PI',
        },
      ]}
    />,
  );
  expect(screen.getAllByRole('img')).toHaveLength(1);
});

it('renders no more than 5 members', () => {
  render(
    <UsersAvatars
      fullListRoute="route"
      members={createTeamResponseMembers({ teamMembers: 6 })}
    />,
  );
  expect(screen.getAllByLabelText(/pic.+ of .+/)).toHaveLength(5);
  expect(screen.getByLabelText(/\+1/)).toBeVisible();
});
