import { createTestQueryClient } from '@asap-hub/frontend-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import OnboardingRoutes from '../Routes';

const renderRoutes = async () => {
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/']}>
              <Routes>
                <Route path="/*" element={<OnboardingRoutes />} />
              </Routes>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </QueryClientProvider>,
  );
  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
};
beforeEach(() => {
  jest.resetAllMocks();
});

describe('Routes', () => {
  it('render title and buttons', async () => {
    await renderRoutes();
    expect(
      screen.getByRole('heading', { name: 'Welcome to the GP2 Hub' }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: 'Get Started' }),
    ).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'Sign Out' })).toBeInTheDocument();
  });
});
