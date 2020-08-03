import React from 'react';
import {
  render,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import nock from 'nock';
import { authTestUtils } from '@asap-hub/react-components';

import News from '../News';
import { API_BASE_URL } from '../../config';

const news: unknown = {
  slug: 'single-news-slug',
};

// fetch user by code request
beforeEach(() => {
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/content/news/single-news-slug')
    .reply(200, [news]);
});
afterEach(async () => {
  nock.cleanAll();
});

const renderNews = async () => {
  const result = render(
    <authTestUtils.Auth0Provider>
      <authTestUtils.WhenReady>
        <authTestUtils.LoggedIn user={undefined}>
          <MemoryRouter initialEntries={['/single-news-slug/']}>
            <Route exact path="/:slug/" component={News} />
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

it('renders a single news', async () => {
  const { container, getByText } = await renderNews();

  const loadingIndicator = getByText(/loading/i);
  expect(loadingIndicator).toBeVisible();

  await waitForElementToBeRemoved(loadingIndicator);
  expect(container.textContent).toContain(JSON.stringify([news], null, 2));
});
