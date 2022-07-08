import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import {
  createListEventResponse,
  createTeamResponse,
} from '@asap-hub/fixtures';
import { network } from '@asap-hub/routing';
import { disable } from '@asap-hub/flags';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { getEventsFromAlgolia } from '../../../events/api';
import { getResearchOutputs } from '../../../shared-research/api';
import { createResearchOutputListAlgoliaResponse } from '../../../__fixtures__/algolia';
import { getTeam } from '../api';
import { refreshTeamState } from '../state';
import TeamProfile from '../TeamProfile';

jest.mock('../api');
jest.mock('../groups/api');
jest.mock('../../../shared-research/api');
jest.mock('../../../events/api');
const mockGetEventsFromAlgolia = getEventsFromAlgolia as jest.MockedFunction<
  typeof getEventsFromAlgolia
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
it('renders number of upcoming events', async () => {
  const response = createListEventResponse(7);
  mockGetEventsFromAlgolia.mockResolvedValue(response);
  await renderPage(createTeamResponse());

  expect(await screen.findByText(/Upcoming Events \(7\)/i)).toBeVisible();
});

it('renders number of past events', async () => {
  const response = createListEventResponse(7, { isEventInThePast: true });
  mockGetEventsFromAlgolia.mockResolvedValue(response);
  await renderPage(createTeamResponse());

  expect(await screen.findByText(/Past Events \(7\)/i)).toBeVisible();
});

it('navigates to the upcoming events tab', async () => {
  const currentTime = new Date('2021-12-28T14:00:00.000Z');
  const response = createListEventResponse(1);
  mockGetEventsFromAlgolia.mockResolvedValue(response);

  const teamResponse = createTeamResponse();
  await renderPage(teamResponse, { currentTime });

  const tab = screen.getByRole('link', { name: /upcoming/i });
  userEvent.click(tab);
  expect(await screen.findByRole('searchbox')).toHaveAttribute(
    'placeholder',
    'Search by topic, presenting team, …',
  );
  expect(await screen.findByText(/Event 0/i)).toBeVisible();
  expect(mockGetEventsFromAlgolia).toBeCalledTimes(2);
  expect(mockGetEventsFromAlgolia).toHaveBeenCalledWith(expect.anything(), {
    after: '2021-12-28T13:00:00.000Z',
    currentPage: 0,
    filters: new Set(),
    pageSize: 10,
    searchQuery: '',
    constraint: {
      teamId: 't0',
    },
  });
});

it('navigates to the past events tab', async () => {
  const currentTime = new Date('2021-12-28T14:00:00.000Z');
  const response = createListEventResponse(1, { isEventInThePast: true });
  mockGetEventsFromAlgolia.mockResolvedValue(response);

  const teamResponse = createTeamResponse();
  await renderPage(teamResponse, { currentTime });

  const tab = screen.getByRole('link', { name: /past/i });
  userEvent.click(tab);
  expect(await screen.findByRole('searchbox')).toHaveAttribute(
    'placeholder',
    'Search by topic, presenting team, …',
  );
  expect(await screen.findByText(/Event 0/i)).toBeVisible();
  expect(mockGetEventsFromAlgolia).toBeCalledTimes(2);
  expect(mockGetEventsFromAlgolia).toHaveBeenCalledWith(expect.anything(), {
    after: '2021-12-28T13:00:00.000Z',
    currentPage: 0,
    filters: new Set(),
    pageSize: 10,
    searchQuery: '',
    constraint: {
      teamId: 't0',
    },
  });
});

const renderPage = async (
  teamResponse = createTeamResponse(),
  { teamId = teamResponse.id, currentTime = new Date() } = {},
  initialEntries?: string,
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
                <TeamProfile currentTime={currentTime} />
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

it('hides the past and upcoming events tabs if the feature flag is disabled ((Regression))', async () => {
  disable('EVENTS_SEARCH');
  await renderPage(createTeamResponse());

  expect(mockGetEventsFromAlgolia).not.toBeCalled();
  expect(screen.queryByText(/Upcoming Events/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Past Events/i)).not.toBeInTheDocument();
});
