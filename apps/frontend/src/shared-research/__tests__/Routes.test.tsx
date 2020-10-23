import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import nock from 'nock';
import { ClientRequest } from 'http';
import { authTestUtils } from '@asap-hub/react-components';
import { ListResearchOutputResponse } from '@asap-hub/model';

import Routes from '../Routes';
import { API_BASE_URL } from '../../config';

const researchOutputs: ListResearchOutputResponse = {
  total: 2,
  items: [
    {
      id: '55724942-3408-4ad6-9a73-14b92226ffb6',
      created: '2020-09-07T17:36:54Z',
      publishDate: '2020-09-07T17:36:54Z',
      title: 'Output 1',
      text: 'description',
      type: 'Proposal',
      url: 'test',
      team: {
        id: 'e12729e0-a244-471f-a554-7b58eae83a8d',
        displayName: 'Jakobsson, J',
      },
    },
    {
      id: '55724942-3408-4ad6-9a73-14b92226ffb77',
      created: '2020-09-07T17:36:54Z',
      publishDate: '2020-09-07T17:36:54Z',
      title: 'Output 2',
      text: 'description',
      type: 'Proposal',
      url: 'test',
      team: {
        id: 'e12729e0-a244-471f-a554-7b58eae83a8d',
        displayName: 'Rickson, B',
      },
    },
  ],
};

const renderSharedResearchPage = async (pathname: string, query = '') => {
  const result = render(
    <authTestUtils.Auth0Provider>
      <authTestUtils.WhenReady>
        <authTestUtils.LoggedIn user={undefined}>
          <MemoryRouter initialEntries={[{ pathname, search: query }]}>
            <Route path={'/shared-research'}>
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

describe('the library page', () => {
  let req!: ClientRequest;
  beforeEach(() => {
    nock.cleanAll();
    nock(API_BASE_URL, {
      reqheaders: { authorization: 'Bearer token' },
    })
      .get('/research-outputs')
      .query(true)
      .reply(200, function handleRequest(url, body, cb) {
        req = this.req;
        cb(null, researchOutputs);
      })
      .persist();
  });

  it('allows typing in search queries', async () => {
    const { getByRole } = await renderSharedResearchPage('/shared-research');
    const searchBox = getByRole('searchbox') as HTMLInputElement;

    await userEvent.type(searchBox, 'test123');
    expect(searchBox.value).toEqual('test123');
  });

  it('allows selection of filters', async () => {
    const { getByText, getByLabelText } = await renderSharedResearchPage(
      '/shared-research',
    );

    userEvent.click(getByText('Filters'));
    const checkbox = getByLabelText('Proposal');
    expect(checkbox).not.toBeChecked();

    userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    await waitFor(() => {
      const { searchParams } = new URL(req!.path, 'http://api');
      expect(searchParams.get('filter')).toBe('Proposal');
    });
  });

  it('reads filters from url', async () => {
    const { getByText, getByLabelText } = await renderSharedResearchPage(
      '/shared-research',
      '?filter=Proposal',
    );

    userEvent.click(getByText('Filters'));
    const checkbox = getByLabelText('Proposal');
    expect(checkbox).toBeChecked();

    const { searchParams } = new URL(req!.path, 'http://api');
    expect(searchParams.get('filter')).toBe('Proposal');
  });
});
