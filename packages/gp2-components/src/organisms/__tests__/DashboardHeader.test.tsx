import { render, screen } from '@testing-library/react';

import DashboardHeader from '../DashboardHeader';

it('renders the header', () => {
  render(<DashboardHeader />);
  expect(screen.getByRole('heading')).toBeVisible();
});

it('displays welcome mesage', () => {
  render(<DashboardHeader />);

  expect(screen.getByRole('heading').textContent).toMatchInlineSnapshot(
    `"Welcome to the GP2 Hub!"`,
  );
});
