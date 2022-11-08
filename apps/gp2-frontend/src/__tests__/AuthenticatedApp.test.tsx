import { authTestUtils } from '@asap-hub/react-components';
import { render, waitFor } from '@testing-library/react';
import { FC, Suspense } from 'react';
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

const wrapper: FC<Record<string, never>> = ({ children }) => (
  <RecoilRoot>
    <authTestUtils.Auth0ProviderGP2>
      <authTestUtils.LoggedInGP2 user={{}}>
        <StaticRouter>
          <Suspense fallback="loading">{children}</Suspense>
        </StaticRouter>
      </authTestUtils.LoggedInGP2>
    </authTestUtils.Auth0ProviderGP2>
  </RecoilRoot>
);

it('syncs the auth state to recoil', async () => {
  MockDashboard.mockImplementation(() => {
    const authorization = useRecoilValue(authorizationState);
    return <>{authorization}</>;
  });
  const { queryByText, getByText } = render(<AuthenticatedApp />, {
    wrapper,
  });
  await waitFor(
    () => {
      expect(queryByText(/loading/i)).not.toBeInTheDocument();
      expect(getByText(/Bearer token/i)).toBeVisible();
    },
    { timeout: 2000 },
  );
});
