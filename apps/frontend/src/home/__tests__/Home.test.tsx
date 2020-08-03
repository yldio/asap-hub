import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { authTestUtils } from '@asap-hub/react-components';
import { MemoryRouter, Route } from 'react-router-dom';
import Home from '../Home';

const renderHome = async () => {
  const result = render(
    <authTestUtils.Auth0Provider>
      <authTestUtils.WhenReady>
        <authTestUtils.LoggedIn user={{ sub: '42', name: 'John Doe' }}>
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
  return result;
};

test('renders asap link', async () => {
  const { getByRole } = await renderHome();
  expect(getByRole('heading').textContent).toEqual('Dashboard');
});
