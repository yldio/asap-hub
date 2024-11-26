import { authTestUtils } from '@asap-hub/react-components';
import { cleanup, render, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { StaticRouter, MemoryRouter } from 'react-router-dom';
import { RecoilRoot, useRecoilValue } from 'recoil';

import { useCurrentUserCRN } from '@asap-hub/react-context';
import { authorizationState } from '../auth/state';
import AuthenticatedApp from '../AuthenticatedApp';
import Dashboard from '../dashboard/Dashboard';

// We're not actually interested in testing what's rendered since it's all
// declarative routes at this level - get any backend requests out of the way
// so that it just easily renders
jest.mock('../dashboard/Dashboard', () => jest.fn());
jest.mock('@asap-hub/react-context', () => ({
  ...jest.requireActual('@asap-hub/react-context'),
  useCurrentUserCRN: jest.fn(),
}));

const mockedUser = {
  id: 'user-1',
  role: 'Staff',
  onboarded: true,
  firstName: 'Test',
  lastName: 'User',
  displayName: 'Test User',
  avatarUrl: '',
  teams: [],
  workingGroups: [],
  interestGroups: [],
};

const MockDashboard = Dashboard as jest.MockedFunction<typeof Dashboard>;
beforeEach(() => {
  cleanup();
  MockDashboard.mockReset().mockReturnValue(null);
  (useCurrentUserCRN as jest.Mock).mockReturnValue(mockedUser);
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
it("should call setIsOnboardable if it's set", async () => {
  MockDashboard.mockImplementation(() => {
    const authorization = useRecoilValue(authorizationState);
    return <>{authorization}</>;
  });

  const setIsOnboardable = jest.fn();
  render(
    <RecoilRoot>
      <authTestUtils.UserAuth0Provider>
        <authTestUtils.UserLoggedIn user={{}}>
          <StaticRouter>
            <Suspense fallback="loading">
              <AuthenticatedApp setIsOnboardable={setIsOnboardable} />
            </Suspense>
          </StaticRouter>
        </authTestUtils.UserLoggedIn>
      </authTestUtils.UserAuth0Provider>
    </RecoilRoot>,
  );
  await waitFor(
    () => {
      expect(setIsOnboardable).toHaveBeenCalled();
    },
    { timeout: 2000 },
  );
});

it('renders the Analytics route when user has Staff role', async () => {
  const { findAllByText } = render(
    <RecoilRoot>
      <MemoryRouter initialEntries={['/analytics']}>
        <AuthenticatedApp />
      </MemoryRouter>
    </RecoilRoot>,
  );

  const analyticsElements = await findAllByText('Analytics');
  expect(analyticsElements.length).toBeGreaterThan(0);
});

it('renders the application layout correctly', async () => {
  const { getByText, findAllByText } = render(
    <RecoilRoot>
      <MemoryRouter>
        <AuthenticatedApp />
      </MemoryRouter>
    </RecoilRoot>,
  );

  // Verify layout is rendered
  expect(getByText('Menu')).toBeInTheDocument();
  expect(getByText('ASAP Logo')).toBeInTheDocument();
  expect(getByText('Shared Research')).toBeInTheDocument();
  expect(getByText('Calendar & Events')).toBeInTheDocument();
  expect(getByText('Guides & Tutorials')).toBeInTheDocument();

  const network = await findAllByText('Network');
  expect(network.length).toBeGreaterThan(0);

  const news = await findAllByText('News');
  expect(news.length).toBeGreaterThan(0);

  const about = await findAllByText('About ASAP');
  expect(about.length).toBeGreaterThan(0);

  const analyticsElements = await findAllByText('Analytics');
  expect(analyticsElements.length).toBeGreaterThan(0);
});
