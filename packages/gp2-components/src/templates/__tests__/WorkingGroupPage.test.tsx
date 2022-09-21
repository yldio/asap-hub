import { render, screen } from '@testing-library/react';
import WorkingGroupsPage from '../WorkingGroupsPage';

describe('WorkingGroupsPage', () => {
  it('renders a banner', () => {
    render(<WorkingGroupsPage />);
    expect(screen.getByRole('banner')).toBeVisible();
  });
  it('renders a children', () => {
    render(
      <WorkingGroupsPage>
        <div>here is a child component</div>
      </WorkingGroupsPage>,
    );
    expect(screen.getByText('here is a child component')).toBeVisible();
  });
});
