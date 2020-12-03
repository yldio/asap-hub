import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import { createTeamResponse } from '@asap-hub/fixtures';

import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/frontend/src/auth/test-utils';
import TeamProfile from '../TeamProfile';
import { getTeam } from '../api';
import { refreshTeamState } from '../state';

jest.mock('../api');

const mockGetTeam = getTeam as jest.MockedFunction<typeof getTeam>;

const renderTeamProfile = async (
  teamResponse = createTeamResponse(),
  { routeProfileId = teamResponse.id } = {},
) => {
  mockGetTeam.mockImplementation(async (id) => {
    return id === teamResponse.id ? teamResponse : undefined;
  });

  const result = render(
    <RecoilRoot
      initializeState={({ set }) =>
        set(refreshTeamState(teamResponse.id), Math.random())
      }
    >
      <React.Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[`/${routeProfileId}/`]}>
              <Route path="/:id" component={TeamProfile} />
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </React.Suspense>
    </RecoilRoot>,
  );
  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return result;
};

it('renders the header info', async () => {
  const { getByText } = await renderTeamProfile({
    ...createTeamResponse(),
    displayName: 'Bla',
  });
  expect(getByText(/Team.+Bla/i)).toBeVisible();
});

it('renders the about info', async () => {
  const { getByText } = await renderTeamProfile();
  expect(getByText(/project overview/i)).toBeVisible();
});

it('navigates to the outputs tab', async () => {
  const { getByText, findByText } = await renderTeamProfile();

  userEvent.click(getByText(/outputs/i, { selector: 'nav *' }));
  expect(await findByText(/research outputs/i)).toBeVisible();
});
it('navigates to the workspace tab', async () => {
  const { getByText, findByText } = await renderTeamProfile({
    ...createTeamResponse(),
    tools: [],
  });

  userEvent.click(getByText(/workspace/i, { selector: 'nav *' }));
  expect(await findByText(/tools/i)).toBeVisible();
});
it('does not allow navigating to the workspace tab when team tools are not available', async () => {
  const { queryByText } = await renderTeamProfile({
    ...createTeamResponse(),
    tools: undefined,
  });

  expect(
    queryByText(/workspace/i, { selector: 'nav *' }),
  ).not.toBeInTheDocument();
});

it('renders the 404 page for a missing team', async () => {
  const { getByText } = await renderTeamProfile(
    { ...createTeamResponse(), id: '42' },
    { routeProfileId: '1337' },
  );
  expect(getByText(/sorry.+page/i)).toBeVisible();
});
