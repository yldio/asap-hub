import { render, screen } from '@testing-library/react';

import DashboardHeader from '../DashboardHeader';

it('renders the header', () => {
  render(<DashboardHeader />);
  expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});

it('renders a banner', () => {
  render(<DashboardHeader />);
  expect(screen.getByRole('banner')).toBeVisible();
});
