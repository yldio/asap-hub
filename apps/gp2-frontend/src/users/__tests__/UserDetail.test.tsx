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
import { getUser } from '../api';
import { refreshUserState } from '../state';
import UserDetail from '../UserDetail';

jest.mock('../api');

const renderUserDetail = async (id: string) => {
  render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(refreshUserState(id), Math.random());
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[gp2Routing.users({}).user({ userId: id }).$]}
            >
              <Route
                path={
                  gp2Routing.users.template + gp2Routing.users({}).user.template
                }
              >
                <UserDetail />
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
describe('UserDetail', () => {
  const mockGetUser = getUser as jest.MockedFunction<typeof getUser>;

  it('renders header with title', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    await renderUserDetail(user.id);
    expect(screen.getByRole('banner')).toBeVisible();
  });

  it('renders not found if no user is returned', async () => {
    mockGetUser.mockResolvedValueOnce(undefined);
    await renderUserDetail('unknown-id');
    expect(
      screen.getByRole('heading', {
        name: 'Sorry! We can’t seem to find that page.',
      }),
    ).toBeVisible();
  });
});
