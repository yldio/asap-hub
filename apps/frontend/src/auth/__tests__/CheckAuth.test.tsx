import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { authTestUtils } from '@asap-hub/react-components';

import CheckAuth from '../CheckAuth';

it('renders a loading indicator while Auth0 is initializing', async () => {
  const { getByText, queryByText } = render(
    <React.Suspense fallback="suspended">
      <authTestUtils.Auth0Provider>
        <CheckAuth>content</CheckAuth>
      </authTestUtils.Auth0Provider>
    </React.Suspense>,
  );

  expect(getByText(/loading/i)).toBeVisible();
  await waitFor(() => expect(queryByText(/loading/i)).not.toBeInTheDocument());
});

it('renders a sign in page if the user is not authenticated', async () => {
  const { findByText } = render(
    <authTestUtils.Auth0Provider>
      <CheckAuth>
        <p>secure</p>
      </CheckAuth>
    </authTestUtils.Auth0Provider>,
  );
  expect(await findByText('Sign in')).toBeVisible();
});

it('renders the children if the user is authenticated', async () => {
  const { findByText } = render(
    <authTestUtils.Auth0Provider>
      <authTestUtils.LoggedIn user={{}}>
        <CheckAuth>
          <p>secure</p>
        </CheckAuth>
      </authTestUtils.LoggedIn>
    </authTestUtils.Auth0Provider>,
  );
  expect(await findByText('secure')).toBeVisible();
});
