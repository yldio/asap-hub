import { render, screen } from '@testing-library/react';
import DashboardPageBody from '../DashboardPageBody';

describe('DashboardPageBody', () => {
  it('should render tools and tutorials', () => {
    render(<DashboardPageBody />);
    expect(
      screen.getByRole('heading', { name: 'Tools and Tutorials' }),
    ).toBeVisible();
  });
});
