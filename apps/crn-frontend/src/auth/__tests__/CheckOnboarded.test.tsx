import { useEffect, act } from 'react';
import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { createUserResponse } from '@asap-hub/fixtures';
import {
  dashboard,
  network,
  sharedResearch,
  staticPages,
} from '@asap-hub/routing';
import { render, waitFor } from '@testing-library/react';
import { ErrorBoundary } from 'react-error-boundary';
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import CheckOnboarded, { navigationPromptHandler } from '../CheckOnboarded';
import { Auth0Provider, WhenReady } from '../test-utils';

// Helper component to trigger navigation in tests
let navigateToPath: ((path: string) => void) | null = null;
const NavigationHelper = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigateToPath = navigate;
    return () => {
      navigateToPath = null;
    };
  }, [navigate]);
  return null;
};

// Helper component to display current location for redirect tests
const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
};

const user = {
  ...createUserResponse({}, 1),
  onboarded: false,
  algoliaApiKey: 'algolia-mock-key',
};

const ownProfilePath = network({})
  .users({})
  .user({ userId: user.id })
  .research({}).$;

const teamPage = network({})
  .teams({})
  .team({ teamId: user.teams[0]!.id })
  .about({}).$;

const outputs = network({}).users({}).user({ userId: user.id }).outputs({}).$;
const privacy = staticPages({}).privacyPolicy({}).$;
const tos = staticPages({}).terms({}).$;

describe('an unauthenticated user', () => {
  mockConsoleError();

  it('is not allowed', async () => {
    const { findByText } = render(
      <RecoilRoot>
        <ErrorBoundary fallbackRender={({ error }) => <>{error.toString()}</>}>
          <Auth0Provider user={undefined}>
            <WhenReady>
              <MemoryRouter>
                <CheckOnboarded>text</CheckOnboarded>
              </MemoryRouter>
            </WhenReady>
          </Auth0Provider>
        </ErrorBoundary>
      </RecoilRoot>,
    );
    expect(await findByText(/authenticate/i)).toBeVisible();
  });
});

describe('an authenticated and onboarded user', () => {
  it('is let through', async () => {
    const { findByText } = render(
      <RecoilRoot>
        <Auth0Provider user={{ ...user, onboarded: true }}>
          <WhenReady>
            <MemoryRouter>
              <CheckOnboarded>text</CheckOnboarded>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </RecoilRoot>,
    );
    expect(await findByText('text')).toBeVisible();
  });

  it('can navigate to any page', async () => {
    const { findByText } = render(
      <RecoilRoot>
        <Auth0Provider user={{ ...user, onboarded: true }}>
          <WhenReady>
            <MemoryRouter initialEntries={[ownProfilePath]}>
              <NavigationHelper />
              <CheckOnboarded>
                <Routes>
                  <Route path={ownProfilePath} element={<>profile page</>} />
                  <Route path={teamPage} element={<>team page</>} />
                  <Route path={outputs} element={<>outputs page</>} />
                </Routes>
              </CheckOnboarded>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </RecoilRoot>,
    );

    expect(await findByText('profile page')).toBeVisible();

    act(() => {
      navigateToPath?.(teamPage);
    });
    expect(await findByText('team page')).toBeVisible();

    act(() => {
      navigateToPath?.(outputs);
    });
    expect(await findByText('outputs page')).toBeVisible();
  });
});

describe('an authenticated user in onboarding', () => {
  const ownProfileBasePath = network({}).users({}).user({ userId: user.id }).$;

  it('is let through to their own profile', async () => {
    const { findByText, findByTestId } = render(
      <RecoilRoot>
        <Auth0Provider user={{ ...user, onboarded: false }}>
          <WhenReady>
            <MemoryRouter initialEntries={[ownProfilePath]}>
              <NavigationHelper />
              <LocationDisplay />
              <CheckOnboarded>profile</CheckOnboarded>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </RecoilRoot>,
    );

    expect(await findByText('profile')).toBeVisible();
    const locationElement = await findByTestId('location');
    expect(locationElement.textContent).toContain(ownProfileBasePath);
  });

  it('redirects from dashboard to profile', async () => {
    // mock console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const dashboardPath = dashboard({}).$;
    const { findByTestId } = render(
      <RecoilRoot>
        <Auth0Provider user={{ ...user, onboarded: false }}>
          <WhenReady>
            <MemoryRouter initialEntries={[dashboardPath]}>
              <LocationDisplay />
              <CheckOnboarded>
                <Routes>
                  <Route
                    path={`${ownProfileBasePath}/*`}
                    element={<>profile</>}
                  />
                  <Route path={dashboardPath} element={<>dashboard</>} />
                </Routes>
              </CheckOnboarded>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </RecoilRoot>,
    );

    // Should redirect to profile
    const locationElement = await findByTestId('location');
    await waitFor(() => {
      expect(locationElement.textContent).toContain(ownProfileBasePath);
    });
  });

  it("redirects from someone else's profile to own profile", async () => {
    window.alert = jest.fn();
    const foreignProfilePath = network({}).users({}).user({ userId: '1337' }).$;
    const { findByTestId } = render(
      <RecoilRoot>
        <Auth0Provider user={{ ...user, onboarded: false }}>
          <WhenReady>
            <MemoryRouter initialEntries={[foreignProfilePath]}>
              <LocationDisplay />
              <CheckOnboarded>
                <Routes>
                  <Route
                    path={`${ownProfileBasePath}/*`}
                    element={<>own profile</>}
                  />
                </Routes>
              </CheckOnboarded>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </RecoilRoot>,
    );

    // Should redirect to own profile
    const locationElement = await findByTestId('location');
    await waitFor(() => {
      expect(locationElement.textContent).toContain(ownProfileBasePath);
    });
  });

  it('redirects from another page to profile', async () => {
    window.alert = jest.fn();
    const anotherPagePath = sharedResearch({}).$;
    const { findByTestId } = render(
      <RecoilRoot>
        <Auth0Provider user={{ ...user, onboarded: false }}>
          <WhenReady>
            <MemoryRouter initialEntries={[anotherPagePath]}>
              <LocationDisplay />
              <CheckOnboarded>
                <Routes>
                  <Route
                    path={`${ownProfileBasePath}/*`}
                    element={<>own profile</>}
                  />
                </Routes>
              </CheckOnboarded>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </RecoilRoot>,
    );

    // Should redirect to own profile
    const locationElement = await findByTestId('location');
    await waitFor(() => {
      expect(locationElement.textContent).toContain(ownProfileBasePath);
    });
  });

  it('should trigger an alert when accessing protected routes', async () => {
    window.alert = jest.fn();

    const { findByText } = render(
      <RecoilRoot>
        <Auth0Provider user={{ ...user, onboarded: false }}>
          <WhenReady>
            <MemoryRouter initialEntries={[ownProfilePath]}>
              <NavigationHelper />
              <CheckOnboarded>profile page</CheckOnboarded>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </RecoilRoot>,
    );

    expect(await findByText('profile page')).toBeVisible();
    expect(window.alert).not.toHaveBeenCalled();

    act(() => {
      navigateToPath?.(teamPage);
    });
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalled();
    });
    // Should still be on profile page after blocked navigation
    expect(await findByText('profile page')).toBeVisible();
  });
});

describe('navigationPromptHandler', () => {
  it('should handle protected routes during onboarding', async () => {
    window.alert = jest.fn();

    const nonOnboardedUser = { ...user, onboarded: false };

    [ownProfilePath, '/', privacy, tos].forEach((route) => {
      const result = navigationPromptHandler(nonOnboardedUser, route);
      expect(result).toBeUndefined();
      expect(window.alert).not.toHaveBeenCalled();
    });

    [teamPage, outputs].forEach((protectedRoute) => {
      const result = navigationPromptHandler(nonOnboardedUser, protectedRoute);
      expect(result).toBe(false);
      expect(window.alert).toHaveBeenCalled();
    });
  });

  it('should allow navigation after onboarding', async () => {
    window.alert = jest.fn();

    const onboardedUser = { ...user, onboarded: true };

    [teamPage, outputs, privacy, tos, ownProfilePath, '/'].forEach((route) => {
      const result = navigationPromptHandler(onboardedUser, route);
      expect(result).toBeUndefined();
      expect(window.alert).not.toHaveBeenCalled();
    });
  });
});
