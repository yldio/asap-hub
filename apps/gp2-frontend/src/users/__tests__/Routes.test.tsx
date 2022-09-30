import { gp2 } from '@asap-hub/fixtures';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getUsers } from '../api';
import Routes from '../Routes';
import { refreshUsersState } from '../state';

const renderRoutes = async () => {
  render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(refreshUsersState, Math.random());
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/users']}>
              <Route path="/users">
                <Routes />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  return waitForElementToBeRemoved(() => screen.queryByText(/loading/i), {
    timeout: 30_000,
  });
};
beforeEach(() => {
  jest.resetAllMocks();
});

jest.mock('../api');
describe('Routes', () => {
  it('renders a list of users', async () => {
    const mockGetUsers = getUsers as jest.MockedFunction<typeof getUsers>;
    const firstGroup = gp2.createUserResponse({
      id: '1',
      displayName: 'Homer Simpson',
      firstName: 'Homer',
      lastName: 'Simpson',
      degrees: ['PhD' as const],
      role: 'Administrator' as const,
      region: 'Europe' as const,
    });
    const secondGroup = gp2.createUserResponse({
      id: '2',
      displayName: 'Ned Flanders',
      firstName: 'Ned',
      lastName: 'Flanders',
      degrees: ['PhD' as const],
      role: 'Administrator' as const,
      region: 'Africa' as const,
    });
    mockGetUsers.mockResolvedValue(
      gp2.createUsersResponse([firstGroup, secondGroup]),
    );
    await renderRoutes();
    expect(
      screen.getByRole('heading', { name: 'Ned Flanders, PhD' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Homer Simpson, PhD' }),
    ).toBeInTheDocument();
  }, 30_000);
});
