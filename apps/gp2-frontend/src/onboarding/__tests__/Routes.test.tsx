import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import OnboardingRoutes from '../Routes';

const renderRoutes = async () => {
  render(
    <RecoilRoot>
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
    </RecoilRoot>,
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
