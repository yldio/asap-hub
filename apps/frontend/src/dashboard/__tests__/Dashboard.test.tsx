import React from 'react';
import nock from 'nock';
import { User } from '@asap-hub/auth';
import { render, waitFor } from '@testing-library/react';
import { authTestUtils } from '@asap-hub/react-components';

import Dashboard from '../Dashboard';

import { API_BASE_URL } from '../../config';

const renderDashboard = async (user: Partial<User>) => {
  const result = render(
    <authTestUtils.Auth0Provider>
      <authTestUtils.WhenReady>
        <authTestUtils.LoggedIn user={user}>
          <Dashboard />
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

test('renders dashboard header', async () => {
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/dashboard')
    .once()
    .reply(200, {
      newsAndEvents: [],
      pages: [],
    });

  const { getByText } = await renderDashboard({});
  expect(getByText(/welcome/i, { selector: 'h1' })).toBeVisible();
});

test('renders dashboard with news and events', async () => {
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/dashboard')
    .once()
    .reply(200, {
      newsAndEvents: [
        {
          id: '55724942-3408-4ad6-9a73-14b92226ffb6',
          created: '2020-09-07T17:36:54Z',
          title: 'News Title',
          type: 'News',
        },
        {
          id: '55724942-3408-4ad6-9a73-14b92226ffb77',
          created: '2020-09-07T17:36:54Z',
          title: 'Event Title',
          type: 'Event',
        },
      ],
      pages: [],
    });

  const { queryAllByText, getByText } = await renderDashboard({
    firstName: 'John',
  });
  expect(getByText(/john/i, { selector: 'h1' })).toBeVisible();
  expect(queryAllByText(/title/i, { selector: 'h2' }).length).toBe(2);
});
