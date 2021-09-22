import { TeamRole } from '@asap-hub/model';
import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { network, sharedResearch } from '@asap-hub/routing';
import { render } from '@testing-library/react';
import { ErrorBoundary } from 'react-error-boundary';
import { Route, Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { History, createBrowserHistory } from 'history';

import CheckOnboarded from '../CheckOnboarded';
import { Auth0Provider, WhenReady } from '../test-utils';

let history!: History;

beforeEach(() => {
  history = createBrowserHistory();
});

describe('an unauthenticated user', () => {
  mockConsoleError();

  it('is not allowed', async () => {
    const { findByText } = render(
      <ErrorBoundary fallbackRender={({ error }) => <>{error.toString()}</>}>
        <Auth0Provider user={undefined}>
          <WhenReady>
            <CheckOnboarded>text</CheckOnboarded>
          </WhenReady>
        </Auth0Provider>
      </ErrorBoundary>,
      { wrapper: RecoilRoot },
    );
    expect(await findByText(/authenticate/i)).toBeVisible();
  });
});

describe('an authenticated and onboarded user', () => {
  it('is let through', async () => {
    const { findByText } = render(
      <Auth0Provider user={{ id: '42', onboarded: true }}>
        <WhenReady>
          <Router history={history}>
            <CheckOnboarded>text</CheckOnboarded>
          </Router>
        </WhenReady>
      </Auth0Provider>,
      { wrapper: RecoilRoot },
    );
    expect(await findByText('text')).toBeVisible();
  });
});

describe('an authenticated user in onboarding', () => {
  it('is let through to their own profile', async () => {
    const ownProfilePath = network({}).users({}).user({ userId: '42' }).$;
    const { findByText } = render(
      <Auth0Provider user={{ id: '42', onboarded: false }}>
        <WhenReady>
          <Router history={history}>
            <CheckOnboarded>
              <Route path={ownProfilePath}>profile</Route>
            </CheckOnboarded>
          </Router>
        </WhenReady>
      </Auth0Provider>,
      { wrapper: RecoilRoot },
    );

    history.push(ownProfilePath);
    expect(await findByText('profile')).toBeVisible();
  });
  it("is not let through to someone else's profile", async () => {
    const foreignProfilePath = network({}).users({}).user({ userId: '1337' }).$;
    const { findByText } = render(
      <Auth0Provider user={{ id: '42', onboarded: false }}>
        <WhenReady>
          <Router history={history}>
            <CheckOnboarded>
              <Route path={foreignProfilePath}>foreign profile</Route>
              <Route path={network({}).users({}).user({ userId: '42' }).$}>
                own profile
              </Route>
            </CheckOnboarded>
          </Router>
        </WhenReady>
      </Auth0Provider>,
      { wrapper: RecoilRoot },
    );

    history.push(foreignProfilePath);
    expect(await findByText('own profile')).toBeVisible();
  });
  it('is not let through to another page', async () => {
    const anotherPagePath = sharedResearch({}).$;
    const { findByText } = render(
      <Auth0Provider user={{ id: '42', onboarded: false }}>
        <WhenReady>
          <Router history={history}>
            <CheckOnboarded>
              <Route path={anotherPagePath}>another page</Route>
              <Route path={network({}).users({}).user({ userId: '42' }).$}>
                own profile
              </Route>
            </CheckOnboarded>
          </Router>
        </WhenReady>
      </Auth0Provider>,
      { wrapper: RecoilRoot },
    );

    history.push(anotherPagePath);

    expect(await findByText('own profile')).toBeVisible();
  });
  it('should trigger an alert', async () => {
    window.alert = jest.fn();
    const user = {
      id: '42',
      teams: [{ id: '2', role: 'Project Manager' as TeamRole }],
      onboarded: false,
    };

    const teamPage = network({})
      .teams({})
      .team({ teamId: user.teams[0].id })
      .about({}).$;
    const ownProfilePath = network({}).users({}).user({ userId: user.id }).$;

    const { findByText } = render(
      <Auth0Provider user={{ ...user }}>
        <WhenReady>
          <Router history={history}>
            <CheckOnboarded>
              <Route path={teamPage}>team page</Route>
              <Route path={ownProfilePath}>profile page</Route>
            </CheckOnboarded>
          </Router>
        </WhenReady>
      </Auth0Provider>,
      { wrapper: RecoilRoot },
    );

    history.push(ownProfilePath);
    expect(await findByText('profile page')).toBeVisible();

    history.push(teamPage);
    expect(window.alert).toHaveBeenCalled();
  });
});
