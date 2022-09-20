import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Routing } from '@asap-hub/routing';
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
import { refreshUsersState } from '../state';
import Users from '../Users';

jest.mock('../api');

describe('Users', () => {
  const renderUsersList = async () => {
    render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(refreshUsersState, Math.random());
        }}
      >
        <Suspense fallback="loading">
          <Auth0Provider user={{}}>
            <WhenReady>
              <MemoryRouter initialEntries={[gp2Routing.users({}).$]}>
                <Route path={gp2Routing.users.template}>
                  <Users />
                </Route>
              </MemoryRouter>
            </WhenReady>
          </Auth0Provider>
        </Suspense>
      </RecoilRoot>,
    );
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  };
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('renders the Title', async () => {
    const mockGetUsers = getUsers as jest.MockedFunction<typeof getUsers>;
    mockGetUsers.mockResolvedValueOnce(gp2Fixtures.createUsersResponse());
    await renderUsersList();
    expect(
      screen.getByRole('heading', { name: 'User Directory' }),
    ).toBeInTheDocument();
  });
});
