import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { StaticRouter } from 'react-router';
import { Auth0Provider, WhenReady } from '../auth/test-utils';
import AuthenticatedApp from '../AuthenticatedApp';

// We're not actually interested in exercising the onboarded app's data layer
// here — this suite only verifies that AuthenticatedApp routes to the onboarded
// app vs. the onboarding flow based on `user.onboarded`. Mock the onboarded app
// to a marker so no user/query fetching is involved.
jest.mock('../OnboardedApp', () => () => <>Onboarded app</>);
jest.setTimeout(30000);

const renderAuthenticatedApp = (onboarded: boolean) =>
  render(
    <Suspense fallback="loading">
      <Auth0Provider user={{ onboarded }}>
        <WhenReady>
          <StaticRouter location="/">
            <AuthenticatedApp />
          </StaticRouter>
        </WhenReady>
      </Auth0Provider>
    </Suspense>,
  );

it('renders the onboarded app for the onboarded user', async () => {
  renderAuthenticatedApp(true);
  expect(
    await screen.findByText(/Onboarded app/i, {}, { timeout: 10000 }),
  ).toBeVisible();
});

it('renders the onboarding flow for the non-onboarded user', async () => {
  renderAuthenticatedApp(false);
  await waitFor(() =>
    expect(screen.getByText(/Welcome to the GP2 Hub/i)).toBeVisible(),
  );
});
