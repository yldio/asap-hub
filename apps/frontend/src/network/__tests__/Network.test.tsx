import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import nock from 'nock';
import { ClientRequest } from 'http';
import { authTestUtils } from '@asap-hub/react-components';

import Network from '../Network';
import { API_BASE_URL } from '../../config';
import teamsResponse from '../../fixtures/teams';
import usersResponse from '../../fixtures/users';

const renderNetworkPage = async (pathname: string, query = '') => {
  const result = render(
    <authTestUtils.Auth0Provider>
      <authTestUtils.WhenReady>
        <authTestUtils.LoggedIn user={undefined}>
          <MemoryRouter initialEntries={[{ pathname, search: query }]}>
            <Route path={'/network'}>
              <Network />
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

describe('the network page', () => {
  let teamsReq!: ClientRequest;
  let usersReq!: ClientRequest;
  beforeEach(() => {
    nock.cleanAll();
    nock(API_BASE_URL, {
      reqheaders: { authorization: 'Bearer token' },
    })
      .get('/teams')
      .query(true)
      .reply(200, function handleRequest(url, body, cb) {
        teamsReq = this.req;
        cb(null, teamsResponse);
      })
      .get('/users')
      .query(true)
      .reply(200, function handleRequest(url, body, cb) {
        usersReq = this.req;
        cb(null, usersResponse);
      })
      .persist();
  });

  describe('when toggling from teams to users', () => {
    it('changes the placeholder', async () => {
      const { getByText, queryByText, getByRole } = await renderNetworkPage(
        '/network/teams',
      );

      expect(
        (getByRole('searchbox') as HTMLInputElement).placeholder,
      ).toMatchInlineSnapshot(`"Enter name, keyword, method, …"`);

      const peopleLink = getByText(/people/i, { selector: 'nav a *' });
      userEvent.click(peopleLink);
      await waitFor(() =>
        expect(queryByText(/Loading/i)).not.toBeInTheDocument(),
      );

      expect(
        (getByRole('searchbox') as HTMLInputElement).placeholder,
      ).toMatchInlineSnapshot(`"Enter name, keyword, institution, …"`);
    });

    it('preserves only the query text', async () => {
      const { getByText, getByRole } = await renderNetworkPage(
        '/network/teams',
        '?searchQuery=test123&filter=123',
      );
      const searchBox = getByRole('searchbox') as HTMLInputElement;

      expect(searchBox.value).toEqual('test123');

      const toggle = getByText(/people/i, { selector: 'nav a *' });
      fireEvent.click(toggle);
      expect(searchBox.value).toEqual('test123');
      await waitFor(() => {
        const { searchParams } = new URL(usersReq!.path, 'http://api');
        expect(searchParams.get('search')).toBe('test123');
      });
    });
  });

  describe('when toggling from users to teams', () => {
    it('changes the placeholder', async () => {
      const { getByText, queryByText, getByRole } = await renderNetworkPage(
        '/network/users',
      );

      expect(
        (getByRole('searchbox') as HTMLInputElement).placeholder,
      ).toMatchInlineSnapshot(`"Enter name, keyword, institution, …"`);

      const toggle = getByText(/teams/i, { selector: 'nav a *' });
      fireEvent.click(toggle);
      await waitFor(() =>
        expect(queryByText(/Loading/i)).not.toBeInTheDocument(),
      );

      expect(
        (getByRole('searchbox') as HTMLInputElement).placeholder,
      ).toMatchInlineSnapshot(`"Enter name, keyword, method, …"`);
    });
    it('preserves only query text', async () => {
      const { getByText, getByRole } = await renderNetworkPage(
        '/network/users',
        'searchQuery=test123&filter=123',
      );
      const searchBox = getByRole('searchbox') as HTMLInputElement;

      expect(searchBox.value).toEqual('test123');

      const toggle = getByText(/teams/i, { selector: 'nav a *' });
      fireEvent.click(toggle);
      expect(searchBox.value).toEqual('test123');
      await waitFor(() => {
        const { searchParams } = new URL(teamsReq!.path, 'http://api');
        expect(searchParams.get('search')).toBe('test123');
      });
    });
  });

  it('allows typing in search queries', async () => {
    const { getByRole } = await renderNetworkPage('/network/users');
    const searchBox = getByRole('searchbox') as HTMLInputElement;

    await userEvent.type(searchBox, 'test123');
    expect(searchBox.value).toEqual('test123');
  });

  it('allows selection of filters', async () => {
    const { getByText, getByLabelText } = await renderNetworkPage(
      '/network/users',
    );

    userEvent.click(getByText('Filters'));
    const checkbox = getByLabelText('Lead PI');
    expect(checkbox).not.toBeChecked();

    userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    await waitFor(() => {
      const { searchParams } = new URL(usersReq!.path, 'http://api');
      expect(searchParams.get('filter')).toBe('Lead PI (Core Leadership)');
    });
  });

  it('reads filters from url', async () => {
    const { getByText, getByLabelText } = await renderNetworkPage(
      '/network/users',
      '?filter=Lead+PI+(Core Leadership)',
    );

    userEvent.click(getByText('Filters'));
    const checkbox = getByLabelText('Lead PI');
    expect(checkbox).toBeChecked();
    await waitFor(() => {
      const { searchParams } = new URL(usersReq!.path, 'http://api');
      expect(searchParams.get('filter')).toBe('Lead PI (Core Leadership)');
    });
  });
});
