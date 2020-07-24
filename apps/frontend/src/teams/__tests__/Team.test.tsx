import React from 'react';
import {
  render,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import nock from 'nock';
import { TeamResponse } from '@asap-hub/model';
import { authTestUtils } from '@asap-hub/react-components';

import Team from '../Team';
import { API_BASE_URL } from '../../config';

const team: TeamResponse = {
  id: '42',
  displayName: 'Team Unknown',
  applicationNumber: 'Unknow Number',
  projectTitle: 'Unkown Project Title',
  projectSummary: 'Unkown Project Summary',
  members: [],
  tags: [],
};

// fetch user by code request
beforeEach(() => {
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/teams/42')
    .reply(200, team);
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
            <Route exact path="/:id/" component={Team} />
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

it('renders a team information', async () => {
  const { container } = await renderProfile();
  expect(container.textContent).toContain(JSON.stringify(team, null, 2));
});
