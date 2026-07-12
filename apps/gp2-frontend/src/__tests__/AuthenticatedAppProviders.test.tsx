import { gp2 } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { StaticRouter } from 'react-router';
import { Auth0Provider, WhenReady } from '../auth/test-utils';
import AuthenticatedAppWithProviders from '../AuthenticatedApp';
import { getUser } from '../users/api';

jest.mock('../users/api');

// A child that suspends on a query, like the real onboarded app. The provider
// wrapper must commit its QueryClient before the child suspends, or every
// suspense retry gets a fresh empty cache and refetches forever.
jest.mock('../OnboardedApp', () => {
  const { useCurrentUserGP2 } = require('@asap-hub/react-context');
  const { useUserById } = require('../users/state');
  return () => {
    const user = useCurrentUserGP2();
    useUserById(user!.id);
    return <>probe settled</>;
  };
});

jest.setTimeout(30000);

const mockGetUser = getUser as jest.MockedFunction<typeof getUser>;

it('fetches through a suspending child exactly once', async () => {
  const user = gp2.createUserResponse();
  mockGetUser.mockResolvedValue(user);

  render(
    <Suspense fallback="app loading">
      <Auth0Provider user={{ id: user.id, onboarded: true }}>
        <WhenReady>
          <StaticRouter location="/">
            <AuthenticatedAppWithProviders />
          </StaticRouter>
        </WhenReady>
      </Auth0Provider>
    </Suspense>,
  );

  expect(
    await screen.findByText(/probe settled/i, {}, { timeout: 10000 }),
  ).toBeVisible();
  expect(mockGetUser).toHaveBeenCalledTimes(1);
});
