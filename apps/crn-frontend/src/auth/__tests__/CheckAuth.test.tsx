import { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import { authTestUtils } from '@asap-hub/react-components';

import CheckAuth from '../CheckAuth';

it('renders a loading indicator while Auth0 is initializing', async () => {
  const { getByText, queryByText } = render(
    <Suspense fallback="suspended">
      <authTestUtils.UserAuth0Provider>
        <CheckAuth>{() => 'content'}</CheckAuth>
      </authTestUtils.UserAuth0Provider>
    </Suspense>,
    { wrapper: MemoryRouter },
  );

  expect(getByText(/loading/i)).toBeVisible();
  await waitFor(() => expect(queryByText(/loading/i)).not.toBeInTheDocument());
});

it('renders a sign in page if the user is not authenticated', async () => {
  const { findByText } = render(
    <authTestUtils.UserAuth0Provider>
      <CheckAuth>
        {({ isAuthenticated }) => (isAuthenticated ? 'secure' : 'Sign in')}
      </CheckAuth>
    </authTestUtils.UserAuth0Provider>,
    { wrapper: MemoryRouter },
  );
  expect(await findByText('Sign in')).toBeVisible();
});

it('renders the children if the user is authenticated', async () => {
  const { findByText } = render(
    <authTestUtils.UserAuth0Provider>
      <authTestUtils.UserLoggedIn user={{}}>
        <CheckAuth>
          {({ isAuthenticated }) => (isAuthenticated ? 'secure' : 'Sign in')}
        </CheckAuth>
      </authTestUtils.UserLoggedIn>
    </authTestUtils.UserAuth0Provider>,
    { wrapper: MemoryRouter },
  );
  expect(await findByText('secure')).toBeVisible();
});
