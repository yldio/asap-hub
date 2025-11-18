import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { createUserResponse } from '@asap-hub/fixtures';
import { network, sharedResearch, staticPages } from '@asap-hub/routing';
import { render, waitFor } from '@testing-library/react';
import { ErrorBoundary } from 'react-error-boundary';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import CheckOnboarded, { navigationPromptHandler } from '../CheckOnboarded';
import { Auth0Provider, WhenReady } from '../test-utils';
import { useEffect } from 'react';
import { act } from 'react';

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
  it('is let through to their own profile', async () => {
    const { findByText } = render(
      <RecoilRoot>
        <Auth0Provider user={{ ...user, onboarded: false }}>
          <WhenReady>
            <MemoryRouter initialEntries={[ownProfilePath]}>
              <NavigationHelper />
              <CheckOnboarded>profile</CheckOnboarded>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </RecoilRoot>,
    );

    expect(await findByText('profile')).toBeVisible();
  });

  it("is not let through to someone else's profile", async () => {
    window.alert = jest.fn();
    const foreignProfilePath = network({}).users({}).user({ userId: '1337' }).$;
    const { findByText } = render(
      <RecoilRoot>
        <Auth0Provider user={{ ...user, onboarded: false }}>
          <WhenReady>
            <MemoryRouter initialEntries={[foreignProfilePath]}>
              <NavigationHelper />
              <CheckOnboarded>own profile</CheckOnboarded>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </RecoilRoot>,
    );

    expect(await findByText('own profile')).toBeVisible();
  });

  it('is not let through to another page', async () => {
    window.alert = jest.fn();
    const anotherPagePath = sharedResearch({}).$;
    const { findByText } = render(
      <RecoilRoot>
        <Auth0Provider user={{ ...user, onboarded: false }}>
          <WhenReady>
            <MemoryRouter initialEntries={[anotherPagePath]}>
              <NavigationHelper />
              <CheckOnboarded>own profile</CheckOnboarded>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </RecoilRoot>,
    );

    expect(await findByText('own profile')).toBeVisible();
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
