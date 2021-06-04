import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { network, sharedResearch } from '@asap-hub/routing';
import { render } from '@testing-library/react';
import { ErrorBoundary } from 'react-error-boundary';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import CheckOnboarded from '../CheckOnboarded';
import { Auth0Provider, WhenReady } from '../test-utils';

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
          <CheckOnboarded>text</CheckOnboarded>
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
          <MemoryRouter initialEntries={[ownProfilePath]}>
            <CheckOnboarded>
              <Route path={ownProfilePath}>profile</Route>
            </CheckOnboarded>
          </MemoryRouter>
        </WhenReady>
      </Auth0Provider>,
      { wrapper: RecoilRoot },
    );
    expect(await findByText('profile')).toBeVisible();
  });

  it("is not let through to someone else's profile", async () => {
    const foreignProfilePath = network({}).users({}).user({ userId: '1337' }).$;
    const { findByText } = render(
      <Auth0Provider user={{ id: '42', onboarded: false }}>
        <WhenReady>
          <MemoryRouter initialEntries={[foreignProfilePath]}>
            <CheckOnboarded>
              <Route path={foreignProfilePath}>foreign profile</Route>
              <Route path={network({}).users({}).user({ userId: '42' }).$}>
                own profile
              </Route>
            </CheckOnboarded>
          </MemoryRouter>
        </WhenReady>
      </Auth0Provider>,
      { wrapper: RecoilRoot },
    );
    expect(await findByText('own profile')).toBeVisible();
  });

  it('is not let through to another page', async () => {
    const anotherPagePath = sharedResearch({}).$;
    const { findByText } = render(
      <Auth0Provider user={{ id: '42', onboarded: false }}>
        <WhenReady>
          <MemoryRouter initialEntries={[anotherPagePath]}>
            <CheckOnboarded>
              <Route path={anotherPagePath}>another page</Route>
              <Route path={network({}).users({}).user({ userId: '42' }).$}>
                own profile
              </Route>
            </CheckOnboarded>
          </MemoryRouter>
        </WhenReady>
      </Auth0Provider>,
      { wrapper: RecoilRoot },
    );
    expect(await findByText('own profile')).toBeVisible();
  });
});
