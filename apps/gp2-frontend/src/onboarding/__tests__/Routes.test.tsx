import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter, Route } from 'react-router-dom';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import Routes from '../Routes';

const renderRoutes = async () => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/']}>
              <Route path="/">
                <Routes />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  return waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
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
