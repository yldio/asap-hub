import { User } from '@asap-hub/auth';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import Dashboard from '../Dashboard';

afterEach(() => {
  jest.resetAllMocks();
});

const renderDashboard = async ({
  user = {},
  showWelcomeBackBanner = false,
  dismissBanner = jest.fn(),
}: {
  user?: Partial<User>;
  showWelcomeBackBanner?: boolean;
  dismissBanner?: () => void;
}) => {
  render(
    <Suspense fallback="loading">
      <RecoilRoot>
        <Auth0Provider user={user}>
          <WhenReady>
            <Dashboard {...{ showWelcomeBackBanner, dismissBanner }} />
          </WhenReady>
        </Auth0Provider>
      </RecoilRoot>
    </Suspense>,
  );
  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
};

it('renders dashboard header', async () => {
  await renderDashboard({});
  expect(
    await screen.getByRole('heading', { name: 'Dashboard' }),
  ).toBeVisible();
});

it('doesnt render the welcome back banner when its disabled', async () => {
  await renderDashboard({
    user: { firstName: 'Tony' },
    showWelcomeBackBanner: false,
  });
  expect(
    screen.queryByText('Welcome back to the GP2 Hub, Tony!'),
  ).not.toBeInTheDocument();
});
it('renders the welcome back banner when its enabled', async () => {
  await renderDashboard({
    user: { firstName: 'Tony' },
    showWelcomeBackBanner: true,
  });
  expect(screen.getByText('Welcome back to the GP2 Hub, Tony!')).toBeVisible();
});

it('calls the dismissBanner function when pressing the close button on the welcome back banner', async () => {
  const dismissBanner = jest.fn();
  await renderDashboard({
    user: { firstName: 'Tony' },
    showWelcomeBackBanner: true,
    dismissBanner,
  });
  userEvent.click(screen.getByRole('button', { name: 'Close' }));
  expect(dismissBanner).toHaveBeenCalled();
});
