import { User } from '@asap-hub/auth';
import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import Dashboard from '../Dashboard';

afterEach(() => {
  jest.resetAllMocks();
});

const renderDashboard = async (user: Partial<User>) => {
  render(
    <Suspense fallback="loading">
      <RecoilRoot>
        <Auth0Provider user={user}>
          <WhenReady>
            <Dashboard />
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
  expect(await screen.findByText(/welcome/i, { selector: 'h1' })).toBeVisible();
});
