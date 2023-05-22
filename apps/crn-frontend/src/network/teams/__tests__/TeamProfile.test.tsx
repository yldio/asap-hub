import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import {
  createListEventResponse,
  createListResearchOutputResponse,
  createResearchOutputResponse,
  createTeamResponse,
  createUserResponse,
} from '@asap-hub/fixtures';
import { ResearchOutputTeamResponse, TeamResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { ComponentProps, Suspense } from 'react';
import { Route, Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { getEvents } from '../../../events/api';
import {
  getDraftResearchOutputs,
  getResearchOutput,
  getResearchOutputs,
} from '../../../shared-research/api';
import { refreshResearchOutputState } from '../../../shared-research/state';
import { createResearchOutputListAlgoliaResponse } from '../../../__fixtures__/algolia';
import { createResearchOutput, getTeam } from '../api';
import { refreshTeamState } from '../state';
import TeamProfile from '../TeamProfile';

jest.mock('../api');
jest.mock('../groups/api');
jest.mock('../../../shared-research/api');
jest.mock('../../../events/api');
const mockGetEventsFromAlgolia = getEvents as jest.MockedFunction<
  typeof getEvents
>;
const mockCreateResearchOutput = createResearchOutput as jest.MockedFunction<
  typeof createResearchOutput
>;
const mockGetDraftResearchOutputs =
  getDraftResearchOutputs as jest.MockedFunction<
    typeof getDraftResearchOutputs
  >;

const mockGetResearchOutput = getResearchOutput as jest.MockedFunction<
  typeof getResearchOutput
>;

afterEach(jest.clearAllMocks);
const renderPage = async (
  teamResponse: TeamResponse = createTeamResponse(),
  { teamId = teamResponse.id, currentTime = new Date() } = {},
  user: ComponentProps<typeof Auth0Provider>['user'] = {},
  history = createMemoryHistory({
    initialEntries: [network({}).teams({}).team({ teamId }).$],
  }),
) => {
  const mockGetTeam = getTeam as jest.MockedFunction<typeof getTeam>;
  mockGetTeam.mockImplementation(async (id) =>
    id === teamResponse.id ? teamResponse : undefined,
  );

  const { container } = render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(refreshTeamState(teamResponse.id), Math.random());
        set(refreshResearchOutputState('123'), Math.random());
      }}
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
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  return { container };
};

it('renders the header info', async () => {
  await renderPage({
    ...createTeamResponse(),
    displayName: 'Bla',
  });
  expect(screen.getByText(/Team.+Bla/i)).toBeVisible();
});

it('renders the about info', async () => {
  await renderPage();
  expect(screen.getByText(/project overview/i)).toBeVisible();
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

it('navigates to the outputs tab and is able to search', async () => {
  const mockGetResearchOutputs = getResearchOutputs as jest.MockedFunction<
    typeof getResearchOutputs
  >;
  mockGetResearchOutputs.mockResolvedValue({
    ...createResearchOutputListAlgoliaResponse(1),
  });
  await renderPage();

  userEvent.click(screen.getByText(/outputs/i, { selector: 'nav *' }));
  expect(await screen.findByText(/Output 1/i)).toBeVisible();
  expect(await screen.findByRole('searchbox')).toHaveAttribute(
    'placeholder',
    'Enter a keyword, method, resource…',
  );
  userEvent.type(screen.getByRole('searchbox'), 'test');
  expect(await screen.findByRole('searchbox')).toHaveAttribute('value', 'test');
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
describe('Share Output', () => {
  it('shows share outputs button and page when the user has permissions user clicks an option', async () => {
    const teamResponse = createTeamResponse();
    const userResponse = createUserResponse({}, 1);
    const history = createMemoryHistory({
      initialEntries: [
        network({}).teams({}).team({ teamId: teamResponse.id }).$,
      ],
    });

    await renderPage(
      teamResponse,
      { teamId: teamResponse.id, currentTime: new Date() },
      {
        ...userResponse,
        teams: [
          {
            ...userResponse.teams[0],
            id: teamResponse.id,
            role: 'ASAP Staff',
          },
        ],
      },
      history,
    );
    expect(screen.getByText(/about/i)).toBeInTheDocument();
    userEvent.click(await screen.findByText(/share an output/i));
    expect(screen.getByText(/article/i, { selector: 'span' })).toBeVisible();
    userEvent.click(screen.getByText(/article/i, { selector: 'span' }));
    expect(history.location.pathname).toEqual(
      `/network/teams/${teamResponse.id}/create-output/article`,
    );
    expect(screen.queryByText(/about/i)).not.toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

  it('does not show the share outputs button when the user does not have', async () => {
    const teamResponse = createTeamResponse();
    const userResponse = createUserResponse({}, 1);
    const history = createMemoryHistory({
      initialEntries: [
        network({}).teams({}).team({ teamId: teamResponse.id }).$,
      ],
    });

    await renderPage(
      teamResponse,
      { teamId: teamResponse.id, currentTime: new Date() },
      {
        ...userResponse,
        teams: [],
      },
      history,
    );
    expect(screen.getByText(/about/i)).toBeInTheDocument();
    expect(screen.queryByText(/share an output/i)).toBeNull();
  });
});

describe('Duplicate Output', () => {
  it('allows a user who is a member of the primary team duplicate the output', async () => {
    const teamResponse = createTeamResponse();
    const userResponse = createUserResponse({}, 1);
    const researchOutput: ResearchOutputTeamResponse = {
      ...createResearchOutputResponse(),
      id: '123',
      workingGroups: undefined,
      teams: [{ displayName: teamResponse.displayName, id: teamResponse.id }],
      title: 'Example',
      link: 'http://example.com',
    };
    mockGetResearchOutput.mockResolvedValue(researchOutput);

    const history = createMemoryHistory({
      initialEntries: [
        network({})
          .teams({})
          .team({ teamId: teamResponse.id })
          .duplicateOutput({ id: researchOutput.id }).$,
      ],
    });
    await renderPage(
      teamResponse,
      { teamId: teamResponse.id, currentTime: new Date() },
      {
        ...userResponse,
        teams: [
          {
            ...userResponse.teams[0],
            id: teamResponse.id,
            role: 'Key Personnel',
          },
        ],
      },
      history,
    );
    expect(screen.getByLabelText(/Title/i)).toHaveValue('Copy of Example');
    expect(screen.getByLabelText(/URL/i)).toHaveValue('');
    expect(history.location.pathname).toEqual(
      `/network/teams/${teamResponse.id}/duplicate/${researchOutput.id}`,
    );
  });
  it('will create a new research output when saved', async () => {
    const teamResponse = createTeamResponse();
    const userResponse = createUserResponse({}, 1);
    const researchOutput: ResearchOutputTeamResponse = {
      ...createResearchOutputResponse(),
      id: '123',
      workingGroups: undefined,
      teams: [{ displayName: teamResponse.displayName, id: teamResponse.id }],
      title: 'Example',
      link: 'http://example.com',
    };
    mockGetResearchOutput.mockResolvedValue(researchOutput);

    const history = createMemoryHistory({
      initialEntries: [
        network({})
          .teams({})
          .team({ teamId: teamResponse.id })
          .duplicateOutput({ id: researchOutput.id }).$,
      ],
    });
    await renderPage(
      teamResponse,
      { teamId: teamResponse.id, currentTime: new Date() },
      {
        ...userResponse,
        teams: [
          {
            ...userResponse.teams[0],
            id: teamResponse.id,
            role: 'Key Personnel',
          },
        ],
      },
      history,
    );
    expect(screen.getByLabelText(/Title/i)).toHaveValue('Copy of Example');
    userEvent.type(screen.getByLabelText(/URL/i), 'http://example.com');
    userEvent.click(screen.getByText(/save/i));
    expect(mockCreateResearchOutput).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Copy of Example',
        link: 'http://example.com',
      }),
      expect.anything(),
    );

    await waitFor(() =>
      expect(history.location.pathname).not.toEqual(
        `/network/teams/${teamResponse.id}/duplicate/${researchOutput.id}`,
      ),
    );
  });

  it('will show a page not found if research output does not exist', async () => {
    const teamResponse = createTeamResponse();
    const userResponse = createUserResponse({}, 1);

    mockGetResearchOutput.mockResolvedValue(undefined);

    const history = createMemoryHistory({
      initialEntries: [
        network({})
          .teams({})
          .team({ teamId: teamResponse.id })
          .duplicateOutput({ id: 'fake' }).$,
      ],
    });
    await renderPage(
      teamResponse,
      { teamId: teamResponse.id, currentTime: new Date() },
      {
        ...userResponse,
        teams: [
          {
            ...userResponse.teams[0],
            id: teamResponse.id,
            role: 'Key Personnel',
          },
        ],
      },
      history,
    );
    expect(screen.getByText(/sorry.+page/i)).toBeVisible();
  });
});

it('renders the 404 page for a missing team', async () => {
  await renderPage({ ...createTeamResponse(), id: '42' }, { teamId: '1337' });
  expect(screen.getByText(/sorry.+page/i)).toBeVisible();
});

it('deep links to the teams list', async () => {
  const { container } = await renderPage({
    ...createTeamResponse({ teamMembers: 10 }),
    id: '42',
  });

  const anchor = screen.getByLabelText(/\+\d/i).closest('a');
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
  });
});

describe('The draft output tab', () => {
  it('does not renders the draft outputs tab for non team members', async () => {
    mockGetDraftResearchOutputs.mockResolvedValue(
      createListResearchOutputResponse(10),
    );
    await renderPage(undefined, undefined, {
      ...createUserResponse(),
      teams: [],
    });
    expect(screen.queryByText('Draft Outputs')).toBeNull();
  });
  it('renders the draft outputs tab for team members', async () => {
    mockGetDraftResearchOutputs.mockResolvedValue({
      ...createListResearchOutputResponse(10),
      items: createListResearchOutputResponse(10).items.map(
        (output, index) => ({ ...output, title: `Draft Output${index}` }),
      ),
    });
    await renderPage(
      {
        ...createTeamResponse(),
        id: 'example123',
      },
      {},
      {
        ...createUserResponse(),
        teams: [
          {
            id: 'example123',
            role: 'Key Personnel',
          },
        ],
      },
    );
    userEvent.click(screen.getByText('Draft Outputs (10)'));
    await waitFor(() => expect(mockGetDraftResearchOutputs).toHaveBeenCalled());
    expect(screen.getByText('Draft Output0')).toBeVisible();
  });

  it('renders zero draft outputs tab for team members', async () => {
    mockGetDraftResearchOutputs.mockResolvedValue(
      createListResearchOutputResponse(0),
    );
    await renderPage(
      {
        ...createTeamResponse(),
        id: 'example123',
      },
      {},
      {
        ...createUserResponse(),
        teams: [
          {
            id: 'example123',
            role: 'Key Personnel',
          },
        ],
      },
    );
    expect(screen.getByText('Draft Outputs (0)')).toBeVisible();
  });
});
