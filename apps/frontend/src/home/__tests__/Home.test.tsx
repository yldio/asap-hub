import React from 'react';
import nock from 'nock';
import { User } from '@asap-hub/auth';
import { render, waitFor } from '@testing-library/react';
import { authTestUtils } from '@asap-hub/react-components';
import { MemoryRouter, Route } from 'react-router-dom';
import Home from '../Home';

import { API_BASE_URL } from '../../config';

const renderHome = async (user?: Partial<User>) => {
  const result = render(
    <authTestUtils.Auth0Provider>
      <authTestUtils.WhenReady>
        <authTestUtils.LoggedIn user={user}>
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

  const { getByText } = await renderHome();
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

  const { queryAllByText, getByText } = await renderHome({ firstName: 'John' });
  expect(getByText(/john/i, { selector: 'h1' })).toBeVisible();
  expect(queryAllByText(/title/i, { selector: 'h2' }).length).toBe(2);
});

test('renders dashboard with correct links', async () => {
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/dashboard')
    .once()
    .reply(200, {
      newsAndEvents: [],
      pages: [],
    });

  const { queryAllByRole } = await renderHome({
    teams: [
      {
        id: 'uuid',
        displayName: 'Team',
      },
    ],
  });

  expect(queryAllByRole('link').map((a) => a.getAttribute('href'))).toEqual([
    '/network/users',
    '/shared-research',
    '/network/teams',
    '/discover',
    '/news-and-events',
    '/uuid',
    '/network/users/testuserid',
    'mailto:grants@parkinsonsroadmap.org?subject=ASAP+Hub%3A+Grant+support',
    'mailto:techsupport@asap.science?subject=ASAP+Hub%3A+Tech+support',
  ]);
});
