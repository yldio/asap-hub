import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { discover } from '@asap-hub/routing';

import Routes from '../Routes';

jest.mock('../api');

const renderDiscoverPage = async (pathname: string, query = '') => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[{ pathname, search: query }]}>
              <Route path={discover.template}>
                <Routes />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
};
it('redirects to the guides page when the index page accessed', async () => {
  await renderDiscoverPage(discover({}).$);
  expect(
    await screen.findByText(/Guides/i, {
      selector: 'h2',
    }),
  ).toBeVisible();
});
