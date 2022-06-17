import { render, screen } from '@testing-library/react';

import DashboardPage from '../DashboardPage';

it('renders the header', () => {
  render(<DashboardPage>Content</DashboardPage>);
  expect(screen.getByRole('heading')).toBeVisible();
  expect(screen.getByRole('heading').textContent).toMatchInlineSnapshot(
    `"Welcome to the GP2 Hub!"`,
  );
});

it('renders the children', () => {
  render(<DashboardPage>Content</DashboardPage>);
  expect(screen.getByText('Content')).toBeVisible();
});
