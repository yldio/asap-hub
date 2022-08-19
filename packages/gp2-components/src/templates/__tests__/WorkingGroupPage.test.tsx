import { render, screen } from '@testing-library/react';
import WorkingGroupsPage from '../WorkingGroupsPage';

describe('WorkingGroupsPage', () => {
  it('renders a banner', () => {
    const workingGroups = {
      total: 1,
      items: [
        {
          id: '42',
          title: 'Working Group',
          shortDescription: 'WG',
          leadingMembers: 'Leading Members',
          members: [],
        },
      ],
    };
    render(<WorkingGroupsPage workingGroups={workingGroups} />);
    expect(screen.getByRole('banner')).toBeVisible();
  });
});
