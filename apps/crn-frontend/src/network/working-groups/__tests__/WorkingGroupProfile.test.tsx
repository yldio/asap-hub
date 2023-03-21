import {
  createListEventResponse,
  createListResearchOutputResponse,
  createUserResponse,
  createWorkingGroupResponse,
} from '@asap-hub/fixtures';
import { network } from '@asap-hub/routing';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { createMemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import { ComponentProps, Suspense } from 'react';
import { Router, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import {
  getDraftResearchOutputs,
  getResearchOutputs,
} from '../../../shared-research/api';
import { getWorkingGroup } from '../api';
import { refreshWorkingGroupState } from '../state';
import WorkingGroupProfile from '../WorkingGroupProfile';
import { getEvents } from '../../../events/api';
import { createResearchOutputListAlgoliaResponse } from '../../../__fixtures__/algolia';

jest.mock('../api');
jest.mock('../../../events/api');
jest.mock('../../../shared-research/api');

const mockGetResearchOutputs = getResearchOutputs as jest.MockedFunction<
  typeof getResearchOutputs
>;
const mockGetDraftResearchOutputs =
  getDraftResearchOutputs as jest.MockedFunction<
    typeof getDraftResearchOutputs
  >;

mockGetResearchOutputs.mockResolvedValue({
  ...createResearchOutputListAlgoliaResponse(0),
});
const mockGetWorkingGroup = getWorkingGroup as jest.MockedFunction<
  typeof getWorkingGroup
>;
const mockGetWorkingGroupEventsFromAlgolia = getEvents as jest.MockedFunction<
  typeof getEvents
>;

const response = createListEventResponse(7);
mockGetWorkingGroupEventsFromAlgolia.mockResolvedValue(response);

beforeEach(jest.clearAllMocks);

const workingGroupResponse = createWorkingGroupResponse({});
const workingGroupId = workingGroupResponse.id;
const renderWorkingGroupProfile = async (
  user: ComponentProps<typeof Auth0Provider>['user'] = {},
  history = createMemoryHistory({
    initialEntries: [
      network({}).workingGroups({}).workingGroup({ workingGroupId }).$,
    ],
  }),
) => {
  mockGetWorkingGroup.mockImplementation(async (id) =>
    id === workingGroupResponse.id ? workingGroupResponse : undefined,
  );

  render(
    <RecoilRoot
      initializeState={({ set }) =>
        set(refreshWorkingGroupState(workingGroupResponse.id), Math.random())
      }
    >
      <Suspense fallback="loading">
        <Auth0Provider user={user}>
          <WhenReady>
            <Router history={history}>
              <Route
                path={
                  network.template +
                  network({}).workingGroups.template +
                  network({}).workingGroups({}).workingGroup.template
                }
              >
                <WorkingGroupProfile currentTime={new Date()} />
              </Route>
            </Router>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};

it('renders the about working-group information by default', async () => {
  await renderWorkingGroupProfile(createWorkingGroupResponse({}));

  expect(await screen.findByText(/Working Group Description/i)).toBeVisible();
  expect(await screen.findByRole('link', { name: /about/i })).toHaveClass(
    'active-link',
  );
});

it('renders the not-found page when the working-group is not found', async () => {
  mockGetWorkingGroup.mockResolvedValueOnce(undefined);
  await renderWorkingGroupProfile();

  expect(
    await screen.findByText(/can’t seem to find that page/i),
  ).toBeVisible();
});

describe('the share outputs page', () => {
  it('is rendered when user clicks share an output and chooses an option', async () => {
    const history = createMemoryHistory({
      initialEntries: [
        network({}).workingGroups({}).workingGroup({ workingGroupId }).$,
      ],
    });

    await renderWorkingGroupProfile(
      {
        ...createUserResponse({}, 1),
        workingGroups: [
          {
            id: workingGroupId,
            role: 'Project Manager',
            active: true,
            name: 'test',
          },
        ],
      },
      history,
    );
    expect(screen.queryByText(/about/i)).toBeInTheDocument();
    userEvent.click(await screen.findByText(/share an output/i));
    expect(screen.getByText(/article/i, { selector: 'span' })).toBeVisible();
    userEvent.click(screen.getByText(/article/i, { selector: 'span' }));
    expect(history.location.pathname).toEqual(
      '/network/working-groups/working-group-id-0/create-output/article',
    );
    expect(screen.queryByText(/about/i)).not.toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});

describe('the outputs tab', () => {
  it('can be switched to', async () => {
    await renderWorkingGroupProfile();
    userEvent.click(
      await screen.findByText(/outputs/i, { selector: 'nav a *' }),
    );
    expect(
      await screen.findByText(
        /this working group hasn’t shared any research yet/i,
      ),
    ).toBeVisible();
  });
});

describe('the calendar tab', () => {
  it('can be switched to', async () => {
    await renderWorkingGroupProfile();
    userEvent.click(
      await screen.findByText(/calendar/i, { selector: 'nav a *' }),
    );
    expect(
      await screen.findByText(/subscribe to this working group's calendar/i),
    ).toBeVisible();
  });

  it('cannot be switched to if the working group is inactive', async () => {
    mockGetWorkingGroup.mockResolvedValueOnce({
      ...createWorkingGroupResponse(),
      complete: true,
    });
    await renderWorkingGroupProfile();

    expect(screen.queryByText('Calendar')).not.toBeInTheDocument();
  });
});

describe('the upcoming events tab', () => {
  it('can be switched to', async () => {
    await renderWorkingGroupProfile();
    userEvent.click(
      await screen.findByText(/upcoming/i, { selector: 'nav a *' }),
    );
    expect(await screen.findByText(/results/i)).toBeVisible();
  });
  it('cannot be switched to if the group is inactive', async () => {
    await renderWorkingGroupProfile({
      ...createWorkingGroupResponse(),
      workingGroups: [
        {
          active: false,
          id: '123',
          name: 'test',
          role: 'Chair',
        },
      ],
    });
    expect(screen.queryByText('Upcoming Events')).not.toBeInTheDocument();
  });
});

describe('the past events tab', () => {
  it('can be switched to', async () => {
    await renderWorkingGroupProfile();
    userEvent.click(await screen.findByText(/past/i, { selector: 'nav a *' }));
    expect(await screen.findByText(/results/i)).toBeVisible();
  });
});

describe('the event tabs', () => {
  it('renders number of upcoming events from algolia', async () => {
    mockGetWorkingGroupEventsFromAlgolia.mockResolvedValue(response);
    await renderWorkingGroupProfile();

    expect(await screen.findByText(/Upcoming Events \(7\)/i)).toBeVisible();
  });

  it('renders number of past events from algolia', async () => {
    mockGetWorkingGroupEventsFromAlgolia.mockResolvedValue(response);
    await renderWorkingGroupProfile();

    expect(await screen.findByText(/Past Events \(7\)/i)).toBeVisible();
  });
});

describe('The draft output tab', () => {
  it('renders the draft outputs tab for a working group member', async () => {
    mockGetDraftResearchOutputs.mockResolvedValue(
      createListResearchOutputResponse(10),
    );
    await renderWorkingGroupProfile({
      ...createUserResponse(),
      workingGroups: [
        {
          active: true,
          id: workingGroupId,
          name: 'test',
          role: 'Member',
        },
      ],
    });
    expect(screen.getByText('Draft Outputs (10)')).toBeVisible();
  });
  it('renders the draft outputs tab for a working group member when there are zero results', async () => {
    mockGetDraftResearchOutputs.mockResolvedValue(
      createListResearchOutputResponse(0),
    );
    await renderWorkingGroupProfile({
      ...createUserResponse(),
      workingGroups: [
        {
          active: true,
          id: workingGroupId,
          name: 'test',
          role: 'Member',
        },
      ],
    });
    expect(screen.getByText('Draft Outputs (0)')).toBeVisible();
  });
  it('does not renders the draft outputs tab when user is not a member of the working group', async () => {
    mockGetDraftResearchOutputs.mockResolvedValue(
      createListResearchOutputResponse(10),
    );
    await renderWorkingGroupProfile({
      ...createUserResponse(),
      workingGroups: [],
    });
    expect(screen.queryByText('Draft Outputs')).toBeNull();
  });
});
