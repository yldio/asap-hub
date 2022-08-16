import { render, screen } from '@testing-library/react';
import WorkingGroupsHeader from '../WorkingGroupsHeader';

describe('WorkingGroupsHeader', () => {
  it('renders a banner', () => {
    render(<WorkingGroupsHeader />);
    expect(screen.getByRole('banner')).toBeVisible();
  });
});
