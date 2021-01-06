import React from 'react';
import { useRecoilValue } from 'recoil';
import { StaticRouter } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import { authTestUtils } from '@asap-hub/react-components';

import GuardedApp from '../GuardedApp';
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

const wrapper: React.FC<Record<string, never>> = ({ children }) => (
  <authTestUtils.Auth0Provider>
    <authTestUtils.LoggedIn user={{}}>
      <StaticRouter>
        <React.Suspense fallback="loading">{children}</React.Suspense>
      </StaticRouter>
    </authTestUtils.LoggedIn>
  </authTestUtils.Auth0Provider>
);

it('syncs the auth state to recoil', async () => {
  MockDashboard.mockImplementation(() => {
    const authorization = useRecoilValue(authorizationState);
    return <>{authorization}</>;
  });
  const { container } = render(<GuardedApp />, { wrapper });
  await waitFor(() => expect(container).not.toHaveTextContent(/loading/i));
  expect(container.textContent).toMatchInlineSnapshot(`"Bearer token"`);
});
