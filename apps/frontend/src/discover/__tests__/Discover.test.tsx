import React from 'react';
import nock from 'nock';
import { render, waitFor } from '@testing-library/react';
import { authTestUtils } from '@asap-hub/react-components';
import { UserResponse } from '@asap-hub/model';
import { createPageResponse } from '@asap-hub/fixtures';
import { MemoryRouter, Route } from 'react-router-dom';
import Discover from '../Discover';

import { API_BASE_URL } from '../../config';

const renderDiscover = async () => {
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
      aboutUs: '',
      members: [],
      pages: [],
      training: [],
    });

  const { getByText } = await renderDiscover();
  expect(getByText(/discover/i, { selector: 'h1' })).toBeVisible();
});

test('renders discover with guidance, about and members', async () => {
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/discover')
    .once()
    .reply(200, {
      training: [],
      aboutUs: '<h1>About us</h1>',
      pages: [createPageResponse('1'), createPageResponse('2')],
      members: [
        {
          id: 'uuid',
          displayName: 'John Doe',
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
        } as UserResponse,
      ],
    });

  const { queryAllByText, getByText } = await renderDiscover();
  expect(getByText(/about/i, { selector: 'h1' })).toBeVisible();
  expect(queryAllByText(/title/i, { selector: 'h2' }).length).toBe(2);
});

test('renders discover with members', async () => {
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/discover')
    .once()
    .reply(200, {
      training: [],
      aboutUs: '',
      pages: [],
      members: [
        {
          id: 'uuid',
          displayName: 'John Doe',
          email: 'john@example.com',
          firstName: 'John',
          jobTitle: 'CEO',
          lastName: 'Doe',
        } as UserResponse,
      ],
    });

  const { getByText } = await renderDiscover();
  expect(getByText('John Doe')).toBeVisible();
});

test('renders discover with members role', async () => {
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/discover')
    .once()
    .reply(200, {
      training: [],
      aboutUs: '',
      pages: [],
      members: [
        {
          id: 'uuid',
          displayName: 'John Doe',
          email: 'john@example.com',
          firstName: 'John',
          institution: 'ASAP',
          jobTitle: 'CEO',
          lastName: 'Doe',
        } as UserResponse,
      ],
    });

  const { getByText } = await renderDiscover();
  expect(getByText('Staff')).toBeVisible();
});
