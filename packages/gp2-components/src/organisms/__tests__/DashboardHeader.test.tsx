import { render, screen } from '@testing-library/react';

import DashboardPageHeader from '../DashboardPageHeader';

it('renders the header', () => {
  render(<DashboardPageHeader />);
  expect(screen.getByRole('heading')).toBeVisible();
});

it('displays welcome mesage', () => {
  render(<DashboardPageHeader />);

  expect(screen.getByRole('heading').textContent).toMatchInlineSnapshot(
    `"Welcome to the GP2 Hub!"`,
  );
});
