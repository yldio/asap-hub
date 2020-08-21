import React from 'react';
import {
  render,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import nock from 'nock';
import { UserResponse } from '@asap-hub/model';
import { authTestUtils } from '@asap-hub/react-components';

import Profile from '../Profile';
import { API_BASE_URL } from '../../config';

const user: UserResponse = {
  id: '42',
  lastModifiedDate: new Date(2020, 6, 12, 14, 32).toISOString(),
  displayName: 'John Doe',
  email: 'john.doe@example.com',
  institution: 'Unknown Institution',
  jobTitle: 'Unknown Title',
  teams: [],
  biography: 'Biography Text',
  skills: [],
};
// fetch user by code request
beforeEach(() => {
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/users/42')
    .reply(200, user);
});
afterEach(async () => {
  nock.cleanAll();
});

const renderProfile = async () => {
  const result = render(
    <authTestUtils.Auth0Provider>
      <authTestUtils.WhenReady>
        <authTestUtils.LoggedIn user={undefined}>
          <MemoryRouter initialEntries={['/42/']}>
            <Route path="/:id" component={Profile} />
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
  const { getByText } = await renderProfile();

  const loadingIndicator = getByText(/loading/i);
  expect(loadingIndicator).toBeVisible();

  await waitForElementToBeRemoved(loadingIndicator);
});

it('renders a member information', async () => {
  const { findByText } = await renderProfile();
  expect((await findByText(user.displayName)).tagName).toBe('H1');
});

it('renders the about member content', async () => {
  const { findByText } = await renderProfile();
  expect(await findByText(user.biography!)).toBeVisible();
});
