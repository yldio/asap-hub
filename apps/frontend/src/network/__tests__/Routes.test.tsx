import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { authTestUtils } from '@asap-hub/react-components';
import nock from 'nock';
import userEvent from '@testing-library/user-event';

import Routes from '../Routes';
import { API_BASE_URL } from '../../config';
import TeamsResponse from '../../fixtures/teams';
import UsersResponse from '../../fixtures/users';

const renderNetworkPage = async (pathname: string, query = '') => {
  const result = render(
    <authTestUtils.Auth0Provider>
      <authTestUtils.WhenReady>
        <authTestUtils.LoggedIn user={undefined}>
          <MemoryRouter initialEntries={[{ pathname, search: query }]}>
            <Route path={'/network'}>
              <Routes />
            </Route>
          </MemoryRouter>
        </authTestUtils.LoggedIn>
      </authTestUtils.WhenReady>
    </authTestUtils.Auth0Provider>,
  );
  await waitFor(() =>
    expect(result.queryByText(/auth0/i)).not.toBeInTheDocument(),
  );

  await waitFor(() =>
    expect(result.queryByText(/Loading/i)).not.toBeInTheDocument(),
  );
  return result;
};

beforeEach(() => {
  nock.cleanAll();
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/teams')
    .reply(200, TeamsResponse);

  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/users')
    .reply(200, UsersResponse);
});

describe('Test toggle to team', () => {
  it('Changes the placeholder', async () => {
    const { getByText, queryByText, getByRole } = await renderNetworkPage(
      '/network/teams',
    );
    const toggle = getByText('People');
    const searchBox = getByRole('textbox') as HTMLInputElement;

    expect(searchBox.placeholder).toMatchInlineSnapshot(`"Search for a team…"`);

    fireEvent.click(toggle);
    await waitFor(() =>
      expect(queryByText(/Loading/i)).not.toBeInTheDocument(),
    );

    expect(searchBox.placeholder).toMatchInlineSnapshot(
      `"Search for someone…"`,
    );
  });

  it('Preserves the query text', async () => {
    const { getByText, queryByText, getByRole } = await renderNetworkPage(
      '/network/teams',
      '?query=321test',
    );
    const toggle = getByText('People');
    const searchBox = getByRole('textbox') as HTMLInputElement;

    expect(searchBox.value).toEqual('321test');

    fireEvent.click(toggle);
    await waitFor(() =>
      expect(queryByText(/Loading/i)).not.toBeInTheDocument(),
    );

    expect(searchBox.value).toEqual('321test');
  });
});

describe('Test toggle to user', () => {
  it('Changes the placeholder', async () => {
    const { getByText, queryByText, getByRole } = await renderNetworkPage(
      '/network/users',
    );
    const toggle = getByText('People');
    const searchBox = getByRole('textbox') as HTMLInputElement;

    expect(searchBox.placeholder).toMatchInlineSnapshot(
      `"Search for someone…"`,
    );

    fireEvent.click(toggle);
    await waitFor(() =>
      expect(queryByText(/Loading/i)).not.toBeInTheDocument(),
    );

    expect(searchBox.placeholder).toMatchInlineSnapshot(`"Search for a team…"`);
  });
  it('Preserves the query text', async () => {
    const { getByText, queryByText, getByRole } = await renderNetworkPage(
      '/network/users',
      'query=test123',
    );
    const toggle = getByText('People');
    const searchBox = getByRole('textbox') as HTMLInputElement;

    expect(searchBox.value).toEqual('test123');

    fireEvent.click(toggle);
    await waitFor(() =>
      expect(queryByText(/Loading/i)).not.toBeInTheDocument(),
    );

    expect(searchBox.value).toEqual('test123');
  });
});

it('Updates the URL with the query para ', async () => {
  const { getByText, queryByText, getByRole } = await renderNetworkPage(
    '/network/users',
  );
  const toggle = getByText('People');
  const searchBox = getByRole('textbox') as HTMLInputElement;

  await userEvent.type(searchBox, 'test123');
  expect(searchBox.value).toEqual('test123');

  fireEvent.click(toggle);
  await waitFor(() => expect(queryByText(/Loading/i)).not.toBeInTheDocument());

  expect(searchBox.value).toEqual('test123');
});
