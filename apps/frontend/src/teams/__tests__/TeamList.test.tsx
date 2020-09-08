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

import Teams from '../TeamList';
import { API_BASE_URL } from '../../config';

const teams: ReadonlyArray<TeamResponse> = [
  {
    id: '42',
    displayName: 'Unknown Team',
    applicationNumber: 'Unknown Number',
    projectTitle: 'Unknown Project Title',
    projectSummary: 'Unknown Project Summary',
    lastModifiedDate: new Date().toISOString(),
    members: [],
    skills: [],
  },
];

// fetch user by code request
beforeEach(() => {
  nock.cleanAll();
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/teams')
    .reply(200, teams);
});

const renderTeamList = async () => {
  const result = render(
    <authTestUtils.Auth0Provider>
      <authTestUtils.WhenReady>
        <authTestUtils.LoggedIn user={undefined}>
          <MemoryRouter initialEntries={['/teams/teams']}>
            <Route path="/teams" component={Teams} />
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
  const { getByText } = await renderTeamList();

  const loadingIndicator = getByText(/loading/i);
  expect(loadingIndicator).toBeVisible();

  await waitForElementToBeRemoved(loadingIndicator);
});

it('renders a list of teams information', async () => {
  const { container } = await renderTeamList();
  expect(container.textContent).toContain('Unknown Team');
  expect(container.textContent).toContain('Unknown Project Summary');
});
