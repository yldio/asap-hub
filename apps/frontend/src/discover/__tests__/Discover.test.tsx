import React from 'react';
import nock from 'nock';
import { render, waitFor } from '@testing-library/react';
import { authTestUtils } from '@asap-hub/react-components';
import { MemoryRouter, Route } from 'react-router-dom';
import Discover from '../Discover';

import { API_BASE_URL } from '../../config';

const renderHome = async () => {
  const result = render(
    <authTestUtils.Auth0Provider>
      <authTestUtils.WhenReady>
        <authTestUtils.LoggedIn user={{}}>
          <MemoryRouter initialEntries={['/']}>
            <Route exact path="/" component={Discover} />
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

test('renders discover header', async () => {
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/discover')
    .once()
    .reply(200, {
      members: [],
      pages: [],
      aboutUs: '',
    });

  const { getByText } = await renderHome();
  expect(getByText(/discover/i, { selector: 'h1' })).toBeVisible();
});

test('renders dicover with guidance, about and members', async () => {
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/discover')
    .once()
    .reply(200, {
      aboutUs: '<h1>About us</h1>',
      pages: [
        {
          title: 'Page 1 Title',
          text: 'Page 1 text ',
        },
        {
          title: 'Page 2 Title',
          text: 'Page 2 text ',
        },
      ],
      members: [],
    });

  const { queryAllByText, getByText } = await renderHome();
  expect(getByText(/about/i, { selector: 'h1' })).toBeVisible();
  expect(queryAllByText(/title/i, { selector: 'h2' }).length).toBe(2);
});
