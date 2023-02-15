import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import {
  createListEventResponse,
  createTeamResponse,
  createUserResponse,
} from '@asap-hub/fixtures';
import { network } from '@asap-hub/routing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Suspense } from 'react';
import { Route, Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { getEvents } from '../../../events/api';
import { getResearchOutputs } from '../../../shared-research/api';
import { createResearchOutputListAlgoliaResponse } from '../../../__fixtures__/algolia';
import { getTeam } from '../api';
import { refreshTeamState } from '../state';
import TeamProfile from '../TeamProfile';

jest.mock('../api');
jest.mock('../groups/api');
jest.mock('../../../shared-research/api');
jest.mock('../../../events/api');
const mockGetEventsFromAlgolia = getEvents as jest.MockedFunction<
  typeof getEvents
>;

afterEach(() => jest.clearAllMocks());

it('renders the header info', async () => {
  const { getByText } = await renderPage({
    ...createTeamResponse(),
    displayName: 'Bla',
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
  await renderPage();

  userEvent.click(screen.getByText(/outputs/i, { selector: 'nav *' }));
  expect(await screen.findByText(/Output 1/i)).toBeVisible();
});

it('navigates to the workspace tab', async () => {
  await renderPage({
    ...createTeamResponse(),
    tools: [],
  });

  userEvent.click(screen.getByText(/workspace/i, { selector: 'nav *' }));
  expect(await screen.findByText(/tools/i)).toBeVisible();
});
it('does not allow navigating to the workspace tab when team tools are not available', async () => {
  await renderPage({
    ...createTeamResponse(),
    tools: undefined,
  });

  expect(
    screen.queryByText(/workspace/i, { selector: 'nav *' }),
  ).not.toBeInTheDocument();
});

it('share outputs page is rendered when user clicks share an output and chooses an option', async () => {
  const teamResponse = createTeamResponse();
  const userResponse = createUserResponse({}, 1);
  const history = createMemoryHistory({
    initialEntries: [network({}).teams({}).team({ teamId: teamResponse.id }).$],
  });

  const { findByText, getByText, queryByText } = await renderPage(
    teamResponse,
    { teamId: teamResponse.id, currentTime: new Date() },
    {
      ...userResponse,
      teams: [
        {
          ...userResponse.teams[0],
          role: 'ASAP Staff',
        },
      ],
    },
    history,
  );
  expect(queryByText(/about/i)).toBeInTheDocument();
  userEvent.click(await findByText(/share an output/i));
  expect(getByText(/article/i, { selector: 'span' })).toBeVisible();
  userEvent.click(getByText(/article/i, { selector: 'span' }));
  expect(history.location.pathname).toEqual(
    `/network/teams/${teamResponse.id}/create-output/article`,
  );
  expect(queryByText(/about/i)).not.toBeInTheDocument();
});

it('renders the 404 page for a missing team', async () => {
  await renderPage({ ...createTeamResponse(), id: '42' }, { teamId: '1337' });
  expect(screen.getByText(/sorry.+page/i)).toBeVisible();
});

it('deep links to the teams list', async () => {
  const { container, getByLabelText } = await renderPage({
    ...createTeamResponse({ teamMembers: 10 }),
    id: '42',
  });

  const anchor = getByLabelText(/\+\d/i).closest('a');
  expect(anchor).toBeVisible();
  const { hash } = new URL(anchor!.href, globalThis.location.href);

  expect(container.querySelector(hash)).toHaveTextContent(/team members/i);
});
it('renders number of upcoming events for active teams', async () => {
  const response = createListEventResponse(7);
  mockGetEventsFromAlgolia.mockResolvedValue(response);
  await renderPage(createTeamResponse());

  expect(await screen.findByText(/Upcoming Events \(7\)/i)).toBeVisible();
});

it('does not allow navigating to the upcoming events tab when team is inactive', async () => {
  await renderPage({
    ...createTeamResponse(),
    inactiveSince: '2022-09-30T09:00:00Z',
  });

  expect(
    screen.queryByText(/Upcoming Events/i, { selector: 'nav *' }),
  ).not.toBeInTheDocument();
});

it('renders number of past events', async () => {
  const response = createListEventResponse(7, { isEventInThePast: true });
  mockGetEventsFromAlgolia.mockResolvedValue(response);
  await renderPage(createTeamResponse());

  expect(await screen.findByText(/Past Events \(7\)/i)).toBeVisible();
});

it.each`
  name
  ${'upcoming events'}
  ${'past events'}
`('navigates to the $name events tab', async ({ name }) => {
  const currentTime = new Date('2021-12-28T14:00:00.000Z');
  const response = createListEventResponse(1);
  mockGetEventsFromAlgolia.mockResolvedValue(response);

  const teamResponse = createTeamResponse();
  await renderPage(teamResponse, { currentTime });

  const nameRegex = new RegExp(name, 'i');

  const tab = screen.getByRole('link', { name: nameRegex });
  userEvent.click(tab);
  expect(await screen.findByRole('searchbox')).toHaveAttribute(
    'placeholder',
    'Search by topic, presenting team, …',
  );
  expect(await screen.findByText(/Event 0/i)).toBeVisible();
  expect(mockGetEventsFromAlgolia).toBeCalledTimes(2);

  expect(mockGetEventsFromAlgolia).toHaveBeenCalledWith(expect.anything(), {
    before: '2021-12-28T13:00:00.000Z',
    currentPage: 0,
    filters: new Set(),
    pageSize: 10,
    searchQuery: '',
    constraint: {
      teamId: 't0',
    },
    sort: {
      sortBy: 'endDate',
      sortOrder: 'desc',
    },
  });
});

const renderPage = async (
  teamResponse = createTeamResponse(),
  { teamId = teamResponse.id, currentTime = new Date() } = {},
  user = {},
  history = createMemoryHistory({
    initialEntries: [network({}).teams({}).team({ teamId }).$],
  }),
) => {
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
        <Auth0Provider user={user}>
          <WhenReady>
            <Router history={history}>
              <Route
                path={
                  network.template +
                  network({}).teams.template +
                  network({}).teams({}).team.template
                }
              >
                <TeamProfile currentTime={currentTime} />
              </Route>
            </Router>
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
