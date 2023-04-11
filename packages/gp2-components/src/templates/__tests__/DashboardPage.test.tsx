import { render, screen } from '@testing-library/react';

import DashboardPage from '../DashboardPage';

const defaultProps = {
  firstName: 'Tony',
};

it('renders the header', () => {
  render(<DashboardPage {...defaultProps}>Content</DashboardPage>);
  expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});

it('renders the children', () => {
  render(<DashboardPage {...defaultProps}>Content</DashboardPage>);
  expect(screen.getByText('Content')).toBeVisible();
});
