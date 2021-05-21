import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import { createTeamResponse } from '@asap-hub/fixtures';
import { network } from '@asap-hub/routing';

import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/frontend/src/auth/test-utils';
import TeamProfile from '../TeamProfile';
import { getTeam } from '../api';
import { refreshTeamState } from '../state';

jest.mock('../api');
jest.mock('../groups/api');

const mockGetTeam = getTeam as jest.MockedFunction<typeof getTeam>;
const renderTeamProfile = async (
  teamResponse = createTeamResponse(),
  { teamId = teamResponse.id } = {},
) => {
  mockGetTeam.mockImplementation(async (id) =>
    id === teamResponse.id ? teamResponse : undefined,
  );

  const result = render(
    <RecoilRoot
      initializeState={({ set }) =>
        set(refreshTeamState(teamResponse.id), Math.random())
      }
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[network({}).teams({}).team({ teamId }).$]}
            >
              <Route
                path={
                  network.template +
                  network({}).teams.template +
                  network({}).teams({}).team.template
                }
                component={TeamProfile}
              />
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
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
    { teamId: '1337' },
  );
  expect(getByText(/sorry.+page/i)).toBeVisible();
});

it('deep links to the teams list', async () => {
  const { container, getByLabelText } = await renderTeamProfile({
    ...createTeamResponse({ teamMembers: 10 }),
    id: '42',
  });

  const anchor = getByLabelText(/\+\d/i).closest('a');
  expect(anchor).toBeVisible();
  const { hash } = new URL(anchor!.href, globalThis.location.href);

  expect(container.querySelector(hash)).toHaveTextContent(/team members/i);
});
