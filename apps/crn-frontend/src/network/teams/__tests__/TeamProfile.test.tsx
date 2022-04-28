import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { createTeamResponse } from '@asap-hub/fixtures';
import { TeamResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { getResearchOutputs } from '../../../shared-research/api';
import { createResearchOutputListAlgoliaResponse } from '../../../__fixtures__/algolia';
import { getTeam } from '../api';
import { refreshTeamState } from '../state';
import TeamProfile from '../TeamProfile';

jest.mock('../api');
jest.mock('../groups/api');
jest.mock('../../../shared-research/api');

afterEach(() => jest.clearAllMocks());

it('renders the header info', async () => {
  const { getByText } = await renderPage({
    teamResponse: {
      ...createTeamResponse(),
      displayName: 'Bla',
    },
  });
  expect(getByText(/Team.+Bla/i)).toBeVisible();
});

it('renders the about info', async () => {
  const { getByText } = await renderPage();
  expect(getByText(/project overview/i)).toBeVisible();
});

it('navigates to the outputs tab', async () => {
  const mockGetResearchOutputs = getResearchOutputs as jest.MockedFunction<
    typeof getResearchOutputs
  >;
  mockGetResearchOutputs.mockResolvedValue({
    ...createResearchOutputListAlgoliaResponse(1),
  });
  const { getByText, findByText } = await renderPage();

  userEvent.click(getByText(/outputs/i, { selector: 'nav *' }));
  expect(await findByText(/Output 1/i)).toBeVisible();
});

it('navigates to the workspace tab', async () => {
  const { getByText, findByText } = await renderPage({
    teamResponse: {
      ...createTeamResponse(),
      tools: [],
    },
  });

  userEvent.click(getByText(/workspace/i, { selector: 'nav *' }));
  expect(await findByText(/tools/i)).toBeVisible();
});
it('does not allow navigating to the workspace tab when team tools are not available', async () => {
  const { queryByText } = await renderPage({
    teamResponse: {
      ...createTeamResponse(),
      tools: undefined,
    },
  });

  expect(
    queryByText(/workspace/i, { selector: 'nav *' }),
  ).not.toBeInTheDocument();
});

it('renders the 404 page for a missing team', async () => {
  const { getByText } = await renderPage({
    teamResponse: { ...createTeamResponse(), id: '42' },
    teamId: '1337',
  });
  expect(getByText(/sorry.+page/i)).toBeVisible();
});

it('deep links to the teams list', async () => {
  const { container, getByLabelText } = await renderPage({
    teamResponse: {
      ...createTeamResponse({ teamMembers: 10 }),
      id: '42',
    },
  });

  const anchor = getByLabelText(/\+\d/i).closest('a');
  expect(anchor).toBeVisible();
  const { hash } = new URL(anchor!.href, globalThis.location.href);

  expect(container.querySelector(hash)).toHaveTextContent(/team members/i);
});

const renderPage = async ({
  teamResponse = createTeamResponse(),
  teamId = teamResponse.id,
  initialEntries,
}: {
  teamResponse?: TeamResponse;
  teamId?: string;
  initialEntries?: string;
} = {}) => {
  const mockGetTeam = getTeam as jest.MockedFunction<typeof getTeam>;
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
              initialEntries={[
                initialEntries ?? network({}).teams({}).team({ teamId }).$,
              ]}
            >
              <Route
                path={
                  network.template +
                  network({}).teams.template +
                  network({}).teams({}).team.template
                }
              >
                <TeamProfile />
              </Route>
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
