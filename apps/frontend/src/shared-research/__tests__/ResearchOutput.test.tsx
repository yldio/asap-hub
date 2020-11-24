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
  type: 'Proposal',
  title: 'Proposal title.',
  text: 'Actual proposal?',
  publishDate: '2020-02-02T12:00:00.000Z',
};

const renderComponent = async (id: string) => {
  const result = render(
    <authTestUtils.Auth0Provider>
      <authTestUtils.WhenReady>
        <authTestUtils.LoggedIn user={undefined}>
          <MemoryRouter initialEntries={[`/${id}/`]}>
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
afterEach(() => {
  nock.cleanAll();
});
it('renders the research output', async () => {
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/research-outputs/42')
    .reply(200, {
      ...researchOutput,
      title: 'Proposal title!',
    });
  const { getByRole } = await renderComponent('42');
  expect(getByRole('heading').textContent).toEqual('Proposal title!');
});

it('renders the research output with a team', async () => {
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/research-outputs/42')
    .reply(200, {
      ...researchOutput,
      team: {
        id: '0d074988-60c3-41e4-9f3a-e40cc65e5f4a',
        displayName: 'Sulzer, D',
      },
    });
  const { getByText } = await renderComponent('42');
  const element = getByText('Team Sulzer, D');
  expect(element).toBeVisible();
  expect(element).toHaveAttribute(
    'href',
    '/network/teams/0d074988-60c3-41e4-9f3a-e40cc65e5f4a',
  );
});

it('renders the 404 page for a missing research output', async () => {
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/research-outputs/42')
    .reply(404);
  const { getByText } = await renderComponent('42');
  expect(getByText(/sorry.+page/i)).toBeVisible();
});
