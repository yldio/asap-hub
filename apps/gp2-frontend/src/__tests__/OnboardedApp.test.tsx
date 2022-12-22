import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { Suspense } from 'react';
import { StaticRouter } from 'react-router-dom';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { authorizationState } from '../auth/state';
import { Auth0Provider, WhenReady } from '../auth/test-utils';
import Dashboard from '../dashboard/Dashboard';
import OnboardedApp from '../OnboardedApp';
import { getUser } from '../users/api';

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
const renderAuthenticatedApp = async () => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <StaticRouter>
              <OnboardedApp />
            </StaticRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};
it('displays the onboarded page', async () => {
  const user = gp2Fixtures.createUserResponse();
  mockGetUser.mockResolvedValueOnce(user);
  await renderAuthenticatedApp();
  expect(screen.getByRole('banner')).toBeVisible();
});

it('handles empty projects and working groups', async () => {
  const user = gp2Fixtures.createUserResponse({
    projects: undefined,
    workingGroups: undefined,
  });
  mockGetUser.mockResolvedValueOnce(user);
  await renderAuthenticatedApp();
  expect(screen.getByRole('banner')).toBeVisible();
});

it('handles empty user', async () => {
  mockGetUser.mockRejectedValueOnce(undefined);
  await renderAuthenticatedApp();
  expect(screen.getByRole('banner')).toBeVisible();
});
