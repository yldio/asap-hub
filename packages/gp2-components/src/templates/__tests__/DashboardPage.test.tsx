import { render, screen } from '@testing-library/react';

import DashboardPage from '../DashboardPage';

const defaultProps = {
  firstName: 'Tony',
  showWelcomeBackBanner: false,
  dismissBanner: jest.fn(),
};

it('renders the header', () => {
  render(<DashboardPage {...defaultProps}>Content</DashboardPage>);
  expect(screen.getByRole('heading')).toBeVisible();
  expect(screen.getByRole('heading').textContent).toMatchInlineSnapshot(
    `"Welcome to the GP2 Hub!"`,
  );
});

it('renders the children', () => {
  render(<DashboardPage {...defaultProps}>Content</DashboardPage>);
  expect(screen.getByText('Content')).toBeVisible();
});
