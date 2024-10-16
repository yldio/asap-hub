import { Suspense } from 'react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { StaticRouter } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import { authTestUtils } from '@asap-hub/react-components';

import AuthenticatedApp from '../AuthenticatedApp';
import { authorizationState } from '../auth/state';
import Dashboard from '../dashboard/Dashboard';

// We're not actually interested in testing what's rendered since it's all
// declarative routes at this level - get any backend requests out of the way
// so that it just easily renders
jest.mock('../dashboard/Dashboard', () => jest.fn());
const MockDashboard = Dashboard as jest.MockedFunction<typeof Dashboard>;
beforeEach(() => {
  MockDashboard.mockReset().mockReturnValue(null);
});

it('syncs the auth state to recoil', async () => {
  MockDashboard.mockImplementation(() => {
    const authorization = useRecoilValue(authorizationState);
    return <>{authorization}</>;
  });
  const { queryByText, getByText } = render(
    <RecoilRoot>
      <authTestUtils.UserAuth0Provider>
        <authTestUtils.UserLoggedIn user={{}}>
          <StaticRouter>
            <Suspense fallback="loading">
              <AuthenticatedApp />
            </Suspense>
          </StaticRouter>
        </authTestUtils.UserLoggedIn>
      </authTestUtils.UserAuth0Provider>
    </RecoilRoot>,
  );
  await waitFor(
    () => {
      expect(queryByText(/loading/i)).not.toBeInTheDocument();
      expect(getByText(/Bearer token/i)).toBeVisible();
    },
    { timeout: 2000 },
  );
});
