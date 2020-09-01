import React from 'react';
import {
  render,
  waitForElementToBeRemoved,
  waitFor,
} from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import nock from 'nock';
import { PageResponse } from '@asap-hub/model';
import { authTestUtils } from '@asap-hub/react-components';

import ContentPage from '../Content';
import { API_BASE_URL } from '../../config';

const page: PageResponse = {
  title: 'Title',
  text: '<h1>Header</h1>',
  path: '/path',
};

// fetch user by code request
beforeEach(() => {
  nock.cleanAll();
  nock(API_BASE_URL).get('/pages/privacy-policy').reply(200, page);
});

const renderPage = async () => {
  const result = render(
    <authTestUtils.Auth0Provider>
      <authTestUtils.WhenReady>
        <authTestUtils.LoggedIn user={undefined}>
          <MemoryRouter initialEntries={['/privacy-policy']}>
            <Route path="/privacy-policy" component={ContentPage} />
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

it('renders a loading indicator', async () => {
  const { getByText } = await renderPage();

  const loadingIndicator = getByText(/loading/i);
  expect(loadingIndicator).toBeVisible();

  await waitForElementToBeRemoved(loadingIndicator);
});

it('renders a page information', async () => {
  const { getByText } = await renderPage();
  expect(getByText(/header/i).tagName).toEqual('h1');
});
