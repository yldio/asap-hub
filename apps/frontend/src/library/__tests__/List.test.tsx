import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import nock from 'nock';
import { ResearchOutputResponse } from '@asap-hub/model';
import { authTestUtils } from '@asap-hub/react-components';

import List from '../List';
import { API_BASE_URL } from '../../config';

const researchOutputs: ReadonlyArray<ResearchOutputResponse> = [
  {
    id: '55724942-3408-4ad6-9a73-14b92226ffb6',
    created: '2020-09-07T17:36:54Z',
    publishDate: '2020-09-07T17:36:54Z',
    title: 'Output 1',
    text: 'description',
    type: 'proposal',
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
    type: 'proposal',
    url: 'test',
    team: {
      id: 'e12729e0-a244-471f-a554-7b58eae83a8d',
      displayName: 'Jakobsson, J',
    },
  },
];

// fetch user by code request
beforeEach(() => {
  nock.cleanAll();
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/research-outputs')
    .reply(200, researchOutputs);
});

const renderLibraryList = async () => {
  const result = render(
    <authTestUtils.Auth0Provider>
      <authTestUtils.WhenReady>
        <authTestUtils.LoggedIn user={undefined}>
          <MemoryRouter initialEntries={['/library']}>
            <Route path="/library" component={List} />
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

it('renders a list of research outputs', async () => {
  const { container } = await renderLibraryList();
  expect(container.textContent).toContain('Output 1');
  expect(container.textContent).toContain('Output 2');
});

it('correctly generates links', async () => {
  const { queryAllByRole } = await renderLibraryList();
  const links = queryAllByRole('link') as HTMLAnchorElement[];
  expect(links.map((link) => link.href)).toMatchInlineSnapshot(`
    Array [
      "http://localhost/library/55724942-3408-4ad6-9a73-14b92226ffb6",
      "http://localhost/network/teams/e12729e0-a244-471f-a554-7b58eae83a8d",
      "http://localhost/library/55724942-3408-4ad6-9a73-14b92226ffb77",
      "http://localhost/network/teams/e12729e0-a244-471f-a554-7b58eae83a8d",
    ]
  `);
});
