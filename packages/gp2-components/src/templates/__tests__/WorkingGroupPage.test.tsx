import { render, screen } from '@testing-library/react';
import WorkingGroupsPage from '../WorkingGroupsPage';

describe('WorkingGroupsPage', () => {
  it('renders a banner', () => {
    render(<WorkingGroupsPage />);
    expect(screen.getByRole('banner')).toBeVisible();
  });
  it('renders the children', () => {
    const { getByText } = render(
      <WorkingGroupsPage>Content</WorkingGroupsPage>,
    );
    expect(getByText('Content')).toBeVisible();
  });
});
