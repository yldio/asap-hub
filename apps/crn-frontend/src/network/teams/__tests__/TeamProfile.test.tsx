import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import {
  createListEventResponse,
  createListResearchOutputResponse,
  createResearchOutputResponse,
  createTeamManuscriptResponse,
  createTeamResponse,
  createUserResponse,
} from '@asap-hub/fixtures';
import { ResearchOutputTeamResponse, TeamResponse } from '@asap-hub/model';
import { network, sharedResearch } from '@asap-hub/routing';
import {
  act,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import userEvent, { specialChars } from '@testing-library/user-event';
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
import { EligibilityReasonProvider } from '../EligibilityReasonProvider';
import { ManuscriptToastProvider } from '../ManuscriptToastProvider';
import {
  manuscriptsState,
  refreshTeamState,
  useManuscriptById,
} from '../state';
import TeamProfile from '../TeamProfile';

jest.mock(
  'react-lottie',
  () =>
    function MockLottie() {
      return <div>Loading...</div>;
    },
);

const manuscriptResponse = {
  id: 'manuscript-1',
  title: 'The Manuscript',
  versions: [{ id: 'manuscript-version-1' }],
};

const algoliaManuscriptsResponse = {
  total: 1,
  items: [
    {
      id: 'manuscript-1',
      lastUpdated: '2020-09-23T20:45:22.000Z',
      team: {
        id: 'team-id-1',
        displayName: 'Team 1',
      },
      status: 'Compliant',
    },
  ],
};

jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  getTeam: jest.fn(),
  createResearchOutput: jest.fn(),
  uploadManuscriptFile: jest.fn().mockResolvedValue({
    filename: 'manuscript.pdf',
    url: 'https://example.com/manuscript.pdf',
    id: 'file-id',
  }),
  createManuscript: jest
    .fn()
    .mockResolvedValue({ title: 'A manuscript', id: '1' }),
  getManuscript: jest.fn().mockResolvedValue(manuscriptResponse),
  getManuscripts: jest.fn().mockResolvedValue(algoliaManuscriptsResponse),
}));

jest.mock('../interest-groups/api');
jest.mock('../../../shared-research/api');
jest.mock('../../../events/api');

jest.mock('../state', () => ({
  ...jest.requireActual('../state'),
  useManuscriptById: jest.fn(),
}));

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
beforeEach(() => {
  jest.spyOn(window, 'scrollTo').mockImplementation(() => {});

  (useManuscriptById as jest.Mock).mockImplementation(() => [
    createTeamManuscriptResponse(),
    jest.fn(),
  ]);
});
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
      initializeState={({ set, reset }) => {
        set(refreshTeamState(teamResponse.id), Math.random());
        set(refreshResearchOutputState('123'), Math.random());
        reset(
          manuscriptsState({
            currentPage: 0,
            pageSize: 10,
            // requestedAPCCoverage: 'all',
            completedStatus: 'show',
            searchQuery: '',
            selectedStatuses: [],
          }),
        );
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
                <ManuscriptToastProvider>
                  <EligibilityReasonProvider>
                    <TeamProfile currentTime={currentTime} />
                  </EligibilityReasonProvider>
                </ManuscriptToastProvider>
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

it('does not show workspace tab if user is not part of the team and is not hub Staff', async () => {
  await renderPage(
    {
      ...createTeamResponse(),
    },
    {},
    {
      role: 'Grantee',
      teams: [
        {
          id: 'another-team',
          role: 'Project Manager',
        },
      ],
    },
  );

  expect(
    screen.queryByText(/Team Workspace/i, { selector: 'nav *' }),
  ).not.toBeInTheDocument();
});

it('shows workspace tab if user is not part of the team and is hub Staff', async () => {
  await renderPage(
    {
      ...createTeamResponse(),
    },
    {},
    {
      role: 'Staff',
      teams: [
        {
          id: 'another-team',
          role: 'Project Manager',
        },
      ],
    },
  );

  expect(
    screen.getByText(/Team Workspace/i, { selector: 'nav *' }),
  ).toBeVisible();
});

it('navigates to the workspace tab', async () => {
  await renderPage(
    {
      ...createTeamResponse(),
      tools: [],
    },
    {},
    {
      teams: [
        {
          id: 't0',
          role: 'Project Manager',
        },
      ],
    },
  );

  userEvent.click(screen.getByText(/workspace/i, { selector: 'nav *' }));
  expect(await screen.findByText(/tools/i)).toBeVisible();
});

it('displays manuscript success toast message and user can dismiss toast', async () => {
  jest.spyOn(console, 'error').mockImplementation();

  await renderPage(
    {
      ...createTeamResponse(),
      tools: [],
    },
    {},
    {
      teams: [
        {
          id: 't0',
          role: 'Project Manager',
        },
      ],
    },
  );

  userEvent.click(screen.getByText(/workspace/i, { selector: 'nav *' }));

  expect(await screen.findByText(/tools/i)).toBeVisible();

  userEvent.click(screen.getByText(/Submit Manuscript/i));

  userEvent.click(screen.getByText(/Yes/i));

  userEvent.click(
    screen.getByText(
      'The manuscript resulted from a pivot stemming from the findings of the ASAP-funded proposal.',
    ),
  );
  userEvent.click(screen.getByText(/Continue/i));

  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );

  const submitButton = screen.getByRole('button', { name: /^Submit$/i });

  await waitFor(() => {
    expect(submitButton).toBeVisible();
  });

  userEvent.type(
    screen.getByRole('textbox', { name: /Title of Manuscript/i }),
    'manuscript title',
  );
  const typeTextbox = screen.getByRole('textbox', {
    name: /Type of Manuscript/i,
  });
  userEvent.type(typeTextbox, 'Original');
  userEvent.type(typeTextbox, specialChars.enter);
  typeTextbox.blur();

  const lifecycleTextbox = screen.getByRole('textbox', {
    name: /Where is the manuscript in the life cycle/i,
  });
  userEvent.type(lifecycleTextbox, 'Typeset proof');
  userEvent.type(lifecycleTextbox, specialChars.enter);
  lifecycleTextbox.blur();

  const testFile = new File(['file content'], 'file.txt', {
    type: 'text/plain',
  });
  const manuscriptFileInput = screen.getByLabelText(/Upload Manuscript File/i);
  const keyResourceTableInput = screen.getByLabelText(
    /Upload Key Resource Table/i,
  );

  userEvent.upload(manuscriptFileInput, testFile);
  userEvent.upload(keyResourceTableInput, testFile);

  const descriptionTextbox = screen.getByRole('textbox', {
    name: /Manuscript Description/i,
  });
  userEvent.type(descriptionTextbox, 'Some description');

  userEvent.type(screen.getByLabelText(/First Authors/i), 'Jane Doe');

  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );

  userEvent.click(screen.getByText(/Non CRN/i));

  expect(screen.getByText(/Jane Doe Email/i)).toBeInTheDocument();
  userEvent.type(screen.getByLabelText(/Jane Doe Email/i), 'jane@doe.com');

  const quickChecks = screen.getByRole('region', { name: /quick checks/i });
  within(quickChecks)
    .getAllByText('Yes')
    .forEach((button) => {
      userEvent.click(button);
    });

  await waitFor(() => {
    expect(submitButton).toBeEnabled();
  });
  await act(async () => {
    await userEvent.click(
      await screen.findByRole('button', { name: /Submit/ }),
    );
  });

  await userEvent.click(
    screen.getByRole('button', { name: /Submit Manuscript/ }),
  );

  expect(
    await screen.findByText('Manuscript submitted successfully.'),
  ).toBeInTheDocument();

  userEvent.click(screen.getByLabelText('Close'));

  expect(screen.queryByText('Manuscript submitted successfully.')).toBeNull();
}, 60000);

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
    mockCreateResearchOutput.mockResolvedValue(researchOutput);

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
    userEvent.click(screen.getByText(/save draft/i));
    userEvent.click(screen.getByText(/keep and/i));
    expect(mockCreateResearchOutput).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Copy of Example',
        link: 'http://example.com',
      }),
      expect.anything(),
    );

    await waitFor(() => {
      expect(history.location.pathname).toEqual(
        sharedResearch({}).researchOutput({
          researchOutputId: researchOutput.id,
        }).$,
      );
      expect(screen.queryByText(/loading/i)).toBe(null);
    });
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

describe('Create Compliance Report', () => {
  it('allows a user who is an ASAP staff and an Open Science Team Member to view Share Compliance Report button', async () => {
    const teamResponse = createTeamResponse();
    const userResponse = createUserResponse({}, 1);

    teamResponse.manuscripts = [createTeamManuscriptResponse()];
    userResponse.role = 'Staff';
    userResponse.openScienceTeamMember = true;

    const history = createMemoryHistory({
      initialEntries: [
        network({}).teams({}).team({ teamId: teamResponse.id }).workspace({}).$,
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

    userEvent.click(screen.getByTestId('collapsible-button'));
    expect(
      screen.getByRole('button', { name: /Share Compliance Report Icon/ }),
    ).toBeInTheDocument();
  });

  it('allows a user who is an ASAP staff and an Open Science Team Member to create a compliance report', async () => {
    const teamResponse = createTeamResponse();
    const userResponse = createUserResponse({}, 1);
    const teamManuscript = createTeamManuscriptResponse();
    teamResponse.manuscripts = [teamManuscript];
    userResponse.role = 'Staff';
    userResponse.openScienceTeamMember = true;

    const history = createMemoryHistory({
      initialEntries: [
        network({}).teams({}).team({ teamId: teamResponse.id }).workspace({}).$,
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

    userEvent.click(screen.getByTestId('collapsible-button'));

    userEvent.click(
      screen.getByRole('button', { name: /Share Compliance Report Icon/ }),
    );

    expect(
      await screen.findByText(
        /Share the compliance report associated with this manuscript./,
      ),
    ).toBeInTheDocument();

    expect(history.location.pathname).toEqual(
      `/network/teams/${teamResponse.id}/workspace/create-compliance-report/${teamManuscript.id}`,
    );
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
  expect(mockGetEventsFromAlgolia).toHaveBeenCalledTimes(2);

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
  it('does not render the draft outputs tab if the team is inactive', async () => {
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
        inactiveSince: '2023-01-01',
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
    expect(screen.queryByText('Draft Outputs (10)')).not.toBeInTheDocument();
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

describe('The compliance tab', () => {
  it('does not show compliance tab if not on Team ASAP', async () => {
    await renderPage({
      ...createTeamResponse(),
      displayName: 'Test',
    });

    expect(
      screen.queryByText(/Compliance/i, { selector: 'nav *' }),
    ).not.toBeInTheDocument();
  });

  it('does not show compliance tab if on Team ASAP but not Staff', async () => {
    await renderPage(
      {
        ...createTeamResponse(),
        displayName: 'ASAP',
      },
      {},
      { role: 'Grantee' },
    );

    expect(
      screen.queryByText(/Compliance/i, { selector: 'nav *' }),
    ).not.toBeInTheDocument();
  });

  it('shows compliance tab on Team ASAP page if user is Staff', async () => {
    await renderPage(
      {
        ...createTeamResponse(),
        displayName: 'ASAP',
      },
      {},
      {
        role: 'Staff',
      },
    );

    expect(
      screen.getByText(/Compliance/i, { selector: 'nav *' }),
    ).toBeVisible();
  });

  it('renders compliance dashboard on Team ASAP page', async () => {
    const manuscriptTeamName =
      algoliaManuscriptsResponse.items[0]!.team.displayName;
    await renderPage(
      {
        ...createTeamResponse(),
        displayName: 'ASAP',
      },
      {},
      {
        role: 'Staff',
      },
    );

    userEvent.click(screen.getByText(/Compliance/i, { selector: 'nav *' }));
    expect(await screen.findByText(manuscriptTeamName)).toBeVisible();
  });
});
