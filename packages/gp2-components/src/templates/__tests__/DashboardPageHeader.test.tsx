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

it('displays user first name in welcome mesage', () => {
  render(<DashboardPageHeader firstName={'John'} />);

  expect(screen.getByRole('heading').textContent).toMatchInlineSnapshot(
    `"Welcome to the GP2 Hub, John!"`,
  );
});
