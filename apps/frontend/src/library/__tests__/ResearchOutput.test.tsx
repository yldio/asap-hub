import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import nock from 'nock';
import { authTestUtils } from '@asap-hub/react-components';
import { ResearchOutputResponse } from '@asap-hub/model';

import ResearchOutput from '../ResearchOutput';
import { API_BASE_URL } from '../../config';

const researchOutput: ResearchOutputResponse = {
  id: 'f9712278-b3f2-4895-8e4b-d5ebdb7f49b7',
  created: '2020-09-24T16:18:23Z',
  url: '',
  doi: '',
  type: 'proposal',
  title: 'Proposal title.',
  text: 'Actual proposal?',
  publishDate: '2020-02-02T12:00:00.000Z',
  team: {
    id: '0d074988-60c3-41e4-9f3a-e40cc65e5f4a',
    displayName: 'Sulzer, D',
  },
};
// fetch user by code request
beforeEach(() => {
  nock.cleanAll();
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/research-outputs/42')
    .reply(200, researchOutput);
});

const renderComponent = async () => {
  const result = render(
    <authTestUtils.Auth0Provider>
      <authTestUtils.WhenReady>
        <authTestUtils.LoggedIn user={undefined}>
          <MemoryRouter initialEntries={['/42/']}>
            <Route path="/:id" component={ResearchOutput} />
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

it('renders the proposal', async () => {
  const { getByRole } = await renderComponent();
  expect(getByRole('heading').textContent).toEqual('Proposal title.');
});
