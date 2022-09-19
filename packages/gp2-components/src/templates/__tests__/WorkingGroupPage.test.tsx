import { gp2 } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
import WorkingGroupsPage from '../WorkingGroupsPage';

describe('WorkingGroupsPage', () => {
  it('renders a banner', () => {
    render(
      <WorkingGroupsPage workingGroups={gp2.createWorkingGroupsResponse()} />,
    );
    expect(screen.getByRole('banner')).toBeVisible();
  });
});
