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
  createdDate: new Date(2020, 6, 12, 14, 32).toISOString(),
  displayName: 'John Doe',
  email: 'john.doe@example.com',
  institution: 'Unknown Institution',
  jobTitle: 'Unknown Title',
  teams: [],
  biography: 'Biography Text',
  skills: [],
};

const team = {
  id: '100',
  displayName: 'Team Unknown',
  role: 'Unknown role',
};

const renderProfile = async (profileId = '42', waitForLoad = true) => {
  const result = render(
    <authTestUtils.Auth0Provider>
      <authTestUtils.WhenReady>
        <authTestUtils.LoggedIn user={undefined}>
          <MemoryRouter initialEntries={[`/${profileId}/`]}>
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
describe('without team', () => {
  // fetch user by code request
  beforeEach(() => {
    nock.cleanAll();
    nock(API_BASE_URL, {
      reqheaders: { authorization: 'Bearer token' },
    })
      .get('/users/42')
      .reply(200, user);
  });

  it('renders a loading indicator', async () => {
    const { getByText } = await renderProfile('42', false);

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
});

describe('with team', () => {
  it('Calculates links', async () => {
    nock.cleanAll();
    nock(API_BASE_URL, {
      reqheaders: { authorization: 'Bearer token' },
    })
      .get('/users/43')
      .reply(200, {
        ...user,
        id: '43',
        teams: [team],
      });
    const { queryAllByRole, getByText } = await renderProfile('43');
    const loadingIndicator = getByText(/loading/i);
    await waitForElementToBeRemoved(loadingIndicator);
    const links = (await queryAllByRole('link')) as HTMLAnchorElement[];
    expect(links.map(({ href }) => href)).toMatchInlineSnapshot(`
      Array [
        "http://localhost/network/teams/100",
        "http://localhost/43/research",
        "http://localhost/43/about",
        "http://localhost/43/outputs",
      ]
    `);
  });
});
