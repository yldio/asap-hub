import { render, screen } from '@testing-library/react';
import { gp2 } from '@asap-hub/fixtures';
import DashboardUserCard from '../DashboardUserCard';

describe('Dashboard User Card', () => {
  it('renders the dashboard user card', () => {
    const { getByRole } = render(
      <DashboardUserCard
        user={{
          ...gp2.createUserResponse(),
          id: 'user-1',
          firstName: 'Test',
          lastName: 'User',
          displayName: 'Test User',
          tags: [{ id: 'tag-1', name: 'Tag 1' }],
          role: 'Network Collaborator',
          avatarUrl:
            'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y',
        }}
      />,
    );
    expect(getByRole('link', { name: /^Test User/i })).toBeVisible();
    expect(
      getByRole('link', { name: 'Profile picture of Test User' }),
    ).toBeVisible();
    expect(screen.getByText('Network Collaborator')).toBeVisible();
    expect(screen.getByText('Tag 1')).toBeVisible();
  });
});
