import React from 'react';
import nock from 'nock';
import { render, waitFor } from '@testing-library/react';
import { authTestUtils } from '@asap-hub/react-components';
import { MemoryRouter, Route } from 'react-router-dom';
import Home from '../Home';

import { API_BASE_URL } from '../../config';

const renderHome = async () => {
  const result = render(
    <authTestUtils.Auth0Provider>
      <authTestUtils.WhenReady>
        <authTestUtils.LoggedIn user={{}}>
          <MemoryRouter initialEntries={['/']}>
            <Route exact path="/" component={Home} />
          </MemoryRouter>
        </authTestUtils.LoggedIn>
      </authTestUtils.WhenReady>
    </authTestUtils.Auth0Provider>,
  );
  await waitFor(() =>
    expect(result.queryByText(/auth0/i)).not.toBeInTheDocument(),
  );
  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return result;
};

test('renders asap link', async () => {
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/dashboard')
    .once()
    .reply(200, {
      newsAndEvents: [],
      pages: [],
    });

  const { getByText } = await renderHome();
  expect(getByText(/welcome/i, { selector: 'h1' })).toBeVisible();
});
