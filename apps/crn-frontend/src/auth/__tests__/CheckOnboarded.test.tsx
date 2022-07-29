import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { createUserResponse } from '@asap-hub/fixtures';
import { network, sharedResearch, staticPages } from '@asap-hub/routing';
import { render } from '@testing-library/react';
import { createBrowserHistory, History } from 'history';
import { ErrorBoundary } from 'react-error-boundary';
import { Route, Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import CheckOnboarded, { navigationPromptHandler } from '../CheckOnboarded';
import { Auth0Provider, WhenReady } from '../test-utils';

let history: History;

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
  .team({ teamId: user.teams[0].id })
  .about({}).$;

const outputs = network({}).users({}).user({ userId: user.id }).outputs({}).$;
const privacy = staticPages({}).privacyPolicy({}).$;
const tos = staticPages({}).terms({}).$;

beforeEach(() => {
  history = createBrowserHistory();
});

describe('an unauthenticated user', () => {
  mockConsoleError();

  it('is not allowed', async () => {
    const { findByText } = render(
      <RecoilRoot>
        <ErrorBoundary fallbackRender={({ error }) => <>{error.toString()}</>}>
          <Auth0Provider user={undefined}>
            <WhenReady>
              <CheckOnboarded>text</CheckOnboarded>
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
            <Router history={history}>
              <CheckOnboarded>text</CheckOnboarded>
            </Router>
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
            <Router history={history}>
              <CheckOnboarded>
                <Route path={ownProfilePath}>profile page</Route>
                <Route path={teamPage}>team page</Route>
                <Route path={outputs}>outputs page</Route>
              </CheckOnboarded>
            </Router>
          </WhenReady>
        </Auth0Provider>
      </RecoilRoot>,
    );

    history.push(ownProfilePath);
    expect(await findByText('profile page')).toBeVisible();

    history.push(teamPage);
    expect(await findByText('team page')).toBeVisible();

    history.push(outputs);
    expect(await findByText('outputs page')).toBeVisible();
  });
});

describe('an authenticated user in onboarding', () => {
  it('is let through to their own profile', async () => {
    const { findByText } = render(
      <RecoilRoot>
        <Auth0Provider user={{ ...user, onboarded: false }}>
          <WhenReady>
            <Router history={history}>
              <CheckOnboarded>
                <Route path={ownProfilePath}>profile</Route>
              </CheckOnboarded>
            </Router>
          </WhenReady>
        </Auth0Provider>
      </RecoilRoot>,
    );

    history.push(ownProfilePath);
    expect(await findByText('profile')).toBeVisible();
  });

  it("is not let through to someone else's profile", async () => {
    const foreignProfilePath = network({}).users({}).user({ userId: '1337' }).$;
    const { findByText } = render(
      <RecoilRoot>
        <Auth0Provider user={{ ...user, onboarded: false }}>
          <WhenReady>
            <Router history={history}>
              <CheckOnboarded>
                <Route path={foreignProfilePath}>foreign profile</Route>
                <Route path={network({}).users({}).user({ userId: user.id }).$}>
                  own profile
                </Route>
              </CheckOnboarded>
            </Router>
          </WhenReady>
        </Auth0Provider>
      </RecoilRoot>,
    );

    history.push(foreignProfilePath);
    expect(await findByText('own profile')).toBeVisible();
  });
  it('is not let through to another page', async () => {
    const anotherPagePath = sharedResearch({}).$;
    const { findByText } = render(
      <RecoilRoot>
        <Auth0Provider user={{ ...user, onboarded: false }}>
          <WhenReady>
            <Router history={history}>
              <CheckOnboarded>
                <Route path={anotherPagePath}>another page</Route>
                <Route path={network({}).users({}).user({ userId: user.id }).$}>
                  own profile
                </Route>
              </CheckOnboarded>
            </Router>
          </WhenReady>
        </Auth0Provider>
      </RecoilRoot>,
    );

    history.push(anotherPagePath);
    expect(await findByText('own profile')).toBeVisible();
  });

  it('should trigger an alert when accessing protected routes', async () => {
    window.alert = jest.fn();

    const { findByText } = render(
      <RecoilRoot>
        <Auth0Provider user={{ ...user, onboarded: false }}>
          <WhenReady>
            <Router history={history}>
              <CheckOnboarded>
                <Route path={teamPage}>team page</Route>
                <Route path={ownProfilePath}>profile page</Route>
              </CheckOnboarded>
            </Router>
          </WhenReady>
        </Auth0Provider>
      </RecoilRoot>,
    );

    history.push(ownProfilePath);
    expect(await findByText('profile page')).toBeVisible();
    expect(window.alert).not.toHaveBeenCalled();

    history.push(teamPage);
    expect(await findByText('profile page')).toBeVisible();
    expect(window.alert).toHaveBeenCalled();
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
