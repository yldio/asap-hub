import { render, screen } from '@testing-library/react';
import WorkingGroupsPage from '../WorkingGroupsPage';

describe('WorkingGroupsPage', () => {
  it('renders a banner', () => {
    render(<WorkingGroupsPage />);
    expect(screen.getByRole('banner')).toBeVisible();
  });
});
