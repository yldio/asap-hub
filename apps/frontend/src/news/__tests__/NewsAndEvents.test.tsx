import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { authTestUtils } from '@asap-hub/react-components';

import NewsAndEventsPage from '../NewsAndEvents';

const renderPage = async () => {
  const result = render(
    <authTestUtils.Auth0Provider>
      <authTestUtils.WhenReady>
        <MemoryRouter initialEntries={['/']}>
          <Route path="/">
            <NewsAndEventsPage />
          </Route>
        </MemoryRouter>
      </authTestUtils.WhenReady>
    </authTestUtils.Auth0Provider>,
  );

  await waitFor(() =>
    expect(result.queryByText(/auth0/i)).not.toBeInTheDocument(),
  );

  return result;
};

it('renders page title', async () => {
  const { getByRole } = await renderPage();
  expect(getByRole('heading').textContent).toEqual('News and Events');
});
