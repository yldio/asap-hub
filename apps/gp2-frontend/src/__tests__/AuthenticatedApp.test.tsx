import { authTestUtils } from '@asap-hub/gp2-components';
import { render, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { StaticRouter } from 'react-router-dom';
import { RecoilRoot, useRecoilValue } from 'recoil';

import { authorizationState } from '../auth/state';
import AuthenticatedApp from '../AuthenticatedApp';
import Dashboard from '../dashboard/Dashboard';

// We're not actually interested in testing what's rendered since it's all
// declarative routes at this level - get any backend requests out of the way
// so that it just easily renders
jest.mock('../dashboard/Dashboard', () => jest.fn());
const MockDashboard = Dashboard as jest.MockedFunction<typeof Dashboard>;
beforeEach(() => {
  MockDashboard.mockReset().mockReturnValue(null);
});

const renderAuthenticatedApp = (onboarded: boolean) =>
  render(
    <RecoilRoot>
      <authTestUtils.Auth0Provider>
        <authTestUtils.LoggedIn user={{ onboarded }}>
          <StaticRouter>
            <Suspense fallback="loading">
              <AuthenticatedApp />
            </Suspense>
          </StaticRouter>
        </authTestUtils.LoggedIn>
      </authTestUtils.Auth0Provider>
    </RecoilRoot>,
  );

it('syncs the auth state to recoil for the onboarded user', async () => {
  MockDashboard.mockImplementation(() => {
    const authorization = useRecoilValue(authorizationState);
    return <>{authorization}</>;
  });
  const { queryByText, getByText } = renderAuthenticatedApp(true);
  await waitFor(
    () => {
      expect(queryByText(/loading/i)).not.toBeInTheDocument();
      expect(getByText(/Bearer token/i)).toBeVisible();
    },
    { timeout: 2000 },
  );
});

it('syncs the auth state to recoil for the non-onboarded user', async () => {
  MockDashboard.mockImplementation(() => {
    const authorization = useRecoilValue(authorizationState);
    return <>{authorization}</>;
  });
  const { queryByText, getByText } = renderAuthenticatedApp(false);
  await waitFor(
    () => {
      expect(queryByText(/loading/i)).not.toBeInTheDocument();
      expect(getByText(/Welcome to the GP2 Hub/i)).toBeVisible();
    },
    { timeout: 4000 },
  );
});
