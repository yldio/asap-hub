import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DashboardPage from '../DashboardPage';

const defaultProps = {
  firstName: 'Tony',
  showWelcomeBackBanner: false,
  dismissBanner: jest.fn(),
};

it('renders the header', () => {
  render(<DashboardPage {...defaultProps}>Content</DashboardPage>);
  expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});

it('renders the children', () => {
  render(<DashboardPage {...defaultProps}>Content</DashboardPage>);
  expect(screen.getByText('Content')).toBeVisible();
});

it('renders the welcome back banner when enabled', () => {
  render(
    <DashboardPage {...defaultProps} showWelcomeBackBanner={true}>
      Content
    </DashboardPage>,
  );
  expect(screen.getByText('Welcome back to the GP2 Hub, Tony!')).toBeVisible();
});

it('calls the dismissBanner function when pressing the close button on the banner', () => {
  const dismissBanner = jest.fn();
  render(
    <DashboardPage
      {...defaultProps}
      showWelcomeBackBanner={true}
      dismissBanner={dismissBanner}
    >
      Content
    </DashboardPage>,
  );
  userEvent.click(screen.getByRole('button', { name: 'Close' }));
  expect(dismissBanner).toHaveBeenCalled();
});
