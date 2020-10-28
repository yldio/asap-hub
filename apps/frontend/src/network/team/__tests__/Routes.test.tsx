import React from 'react';
import {
  render,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import nock from 'nock';
import { TeamResponse } from '@asap-hub/model';
import { authTestUtils } from '@asap-hub/react-components';

import { API_BASE_URL } from '@asap-hub/frontend/src/config';
import Team from '../Routes';

const team: TeamResponse = {
  id: '42',
  displayName: 'Unknown',
  applicationNumber: 'Unknown Number',
  projectTitle: 'Unknown Project Title',
  projectSummary: 'Unknown Project Summary',
  lastModifiedDate: new Date().toISOString(),
  members: [],
  skills: [],
};

let interceptor: nock.Interceptor;
beforeEach(() => {
  nock.cleanAll();
  interceptor = nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  }).get('/teams/42');
  interceptor.reply(200, team);
});

const renderTeam = async (waitForLoading = true) => {
  const result = render(
    <authTestUtils.Auth0Provider>
      <authTestUtils.WhenReady>
        <authTestUtils.LoggedIn user={undefined}>
          <MemoryRouter initialEntries={['/42/']}>
            <Route path="/:id" component={Team} />
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
  const { getByText } = await renderTeam(false);

  const loadingIndicator = getByText(/loading/i);
  expect(loadingIndicator).toBeVisible();

  await waitForElementToBeRemoved(loadingIndicator);
});

it('renders the header info', async () => {
  interceptor.reply(200, {
    ...team,
    displayName: 'Bla',
  } as TeamResponse);

  const { getByText } = await renderTeam();
  expect(getByText(/Team.+Bla/i)).toBeVisible();
});

it('renders the about info', async () => {
  const { getByText } = await renderTeam();
  expect(getByText(/project overview/i)).toBeVisible();
});

describe('the proposal', () => {
  it('is not rendered when there is no proposal', async () => {
    interceptor.reply(200, { ...team, proposalURL: undefined } as TeamResponse);

    const { queryByText } = await renderTeam();
    expect(queryByText(/proposal/i)).not.toBeInTheDocument();
  });

  it('is rendered with a library href', async () => {
    interceptor.reply(200, {
      ...team,
      proposalURL: 'someproposal',
    } as TeamResponse);

    const { getByText } = await renderTeam();
    expect(getByText(/proposal/i).closest('a')).toHaveAttribute(
      'href',
      '/shared-research/someproposal',
    );
  });
});

it('navigates to the outputs', async () => {
  const { getByText, findByText } = await renderTeam();

  userEvent.click(getByText(/outputs/i, { selector: 'nav *' }));
  expect(await findByText(/research outputs/i)).toBeVisible();
});

it('renders the not found page for a 404', async () => {
  interceptor.reply(404);

  const { getByText } = await renderTeam();
  expect(getByText(/sorry.+page/i)).toBeVisible();
});
