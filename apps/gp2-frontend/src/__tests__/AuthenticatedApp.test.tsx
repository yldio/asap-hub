import { authTestUtils } from '@asap-hub/gp2-components';
import { render, screen } from '@testing-library/react';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { Suspense } from 'react';
import { StaticRouter } from 'react-router-dom';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { getUser } from '../users/api';
import { authorizationState } from '../auth/state';
import AuthenticatedApp from '../AuthenticatedApp';
import Dashboard from '../dashboard/Dashboard';

// We're not actually interested in testing what's rendered since it's all
// declarative routes at this level - get any backend requests out of the way
// so that it just easily renders
jest.mock('../dashboard/Dashboard', () => jest.fn());
jest.mock('../users/api');
const MockDashboard = Dashboard as jest.MockedFunction<typeof Dashboard>;
const mockGetUser = getUser as jest.MockedFunction<typeof getUser>;
beforeEach(jest.resetAllMocks);
beforeEach(() => {
  MockDashboard.mockImplementation(() => {
    const authorization = useRecoilValue(authorizationState);
    return <>{authorization}</>;
  });
});
const renderAuthenticatedApp = (onboarded: boolean) =>
  render(
    <RecoilRoot>
      <authTestUtils.UserAuth0Provider>
        <authTestUtils.UserLoggedIn user={{ onboarded }}>
          <StaticRouter>
            <Suspense fallback="loading">
              <AuthenticatedApp />
            </Suspense>
          </StaticRouter>
        </authTestUtils.UserLoggedIn>
      </authTestUtils.UserAuth0Provider>
    </RecoilRoot>,
  );

it('syncs the auth state to recoil for the onboarded user', async () => {
  const user = gp2Fixtures.createUserResponse();
  mockGetUser.mockResolvedValueOnce(user);
  renderAuthenticatedApp(true);
  expect(await screen.findByText(/Bearer token/i)).toBeVisible();
});

it('syncs the auth state to recoil for the non-onboarded user', async () => {
  renderAuthenticatedApp(false);
  expect(await screen.findByText(/Welcome to the GP2 Hub/i)).toBeVisible();
});
