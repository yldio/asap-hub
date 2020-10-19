import React from 'react';
import {
  render,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import nock from 'nock';
import { createListUserResponse } from '@asap-hub/fixtures';
import { authTestUtils } from '@asap-hub/react-components';

import Profiles from '../ProfileList';
import { API_BASE_URL } from '../../config';

// fetch user by code request
beforeEach(() => {
  nock.cleanAll();
});

const renderProfileList = async (waitForLoading = true) => {
  const result = render(
    <authTestUtils.Auth0Provider>
      <authTestUtils.WhenReady>
        <authTestUtils.LoggedIn user={undefined}>
          <MemoryRouter initialEntries={['/users']}>
            <Route path="/users" component={Profiles} />
          </MemoryRouter>
        </authTestUtils.LoggedIn>
      </authTestUtils.WhenReady>
    </authTestUtils.Auth0Provider>,
  );
  await waitFor(() =>
    expect(result.queryByText(/auth0/i)).not.toBeInTheDocument(),
  );
  if (waitForLoading)
    await waitFor(() =>
      expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
    );
  return result;
};

it('renders a loading indicator', async () => {
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/users')
    .reply(200, createListUserResponse(2));

  const { getByText } = await renderProfileList(false);
  const loadingIndicator = getByText(/loading/i);
  expect(loadingIndicator).toBeVisible();

  await waitForElementToBeRemoved(loadingIndicator);
});

it('renders a list of people', async () => {
  const listUserResponse = createListUserResponse(2);
  const names = ['Person A', 'Person B'];
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/users')
    .reply(200, {
      ...listUserResponse,
      items: listUserResponse.items.map((item, itemIndex) => ({
        ...item,
        displayName: names[itemIndex],
      })),
    });

  const { container } = await renderProfileList();
  expect(container.textContent).toContain('Person A');
  expect(container.textContent).toContain('Person B');
});
