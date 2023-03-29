import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import {
  render,
  waitForElementToBeRemoved,
  screen,
} from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getUser } from '../../users/api';
import Groups from '../Groups';

jest.mock('../../users/api');

mockConsoleError();

const renderGroups = async (id: string) => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{ onboarded: false, id }}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[gp2Routing.onboarding({}).groups({}).$]}
            >
              <Route path={gp2Routing.onboarding({}).groups.template}>
                <Groups />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};
describe('Groups', () => {
  beforeEach(jest.resetAllMocks);
  const mockGetUser = getUser as jest.MockedFunction<typeof getUser>;

  it('renders projects and working groups', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    await renderGroups(user.id);
    expect(screen.getByRole('heading', { name: 'Projects' })).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Working Groups' }),
    ).toBeVisible();
  });

  it('renders not found if no user is returned', async () => {
    mockGetUser.mockResolvedValueOnce(undefined);
    await renderGroups('unknown-id');
    expect(
      screen.getByRole('heading', {
        name: 'Sorry! We can’t seem to find that page.',
      }),
    ).toBeVisible();
  });
});
