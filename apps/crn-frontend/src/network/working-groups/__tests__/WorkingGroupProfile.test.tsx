import {
  createListEventResponse,
  createUserResponse,
  createWorkingGroupResponse,
} from '@asap-hub/fixtures';
import { disable } from '@asap-hub/flags';
import { network } from '@asap-hub/routing';
import { render, waitFor, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { Router, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { getWorkingGroup } from '../api';
import { refreshWorkingGroupState } from '../state';
import WorkingGroupProfile from '../WorkingGroupProfile';
import { getEvents } from '../../../events/api';

jest.mock('../api');
jest.mock('../../../events/api');

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
  user = {},
  history = createMemoryHistory({
    initialEntries: [
      network({}).workingGroups({}).workingGroup({ workingGroupId }).$,
    ],
  }),
) => {
  mockGetWorkingGroup.mockImplementation(async (id) =>
    id === workingGroupResponse.id ? workingGroupResponse : undefined,
  );

  const result = render(
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
  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return result;
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
    const { findByText, getByText, queryByText } =
      await renderWorkingGroupProfile(
        {
          ...createUserResponse({}, 1),
          role: 'Project Manager',
          id: workingGroupResponse.leaders[0].user.id,
        },
        history,
      );
    expect(queryByText(/about/i)).toBeInTheDocument();
    userEvent.click(await findByText(/share an output/i));
    expect(getByText(/article/i, { selector: 'span' })).toBeVisible();
    userEvent.click(getByText(/article/i, { selector: 'span' }));
    expect(history.location.pathname).toEqual(
      '/network/working-groups/working-group-id-0/create-output/article',
    );
    expect(queryByText(/about/i)).not.toBeInTheDocument();
  });
});

describe('the outputs tab', () => {
  it('can be switched to', async () => {
    const { findByText } = await renderWorkingGroupProfile();
    userEvent.click(await findByText(/outputs/i, { selector: 'nav a *' }));
    expect(
      await findByText(/this working group hasn’t shared any research yet/i),
    ).toBeVisible();
  });
});

describe('the upcoming events tab', () => {
  it('can be switched to', async () => {
    const { findByText } = await renderWorkingGroupProfile();
    userEvent.click(await findByText(/upcoming/i, { selector: 'nav a *' }));
    expect(await findByText(/results/i)).toBeVisible();
  });
  it('cannot be switched to if the group is inactive', async () => {
    const { queryByText } = await renderWorkingGroupProfile({
      ...createWorkingGroupResponse(),
      complete: true,
    });
    expect(await queryByText('Upcoming Events')).not.toBeInTheDocument();
  });
});

describe('the past events tab', () => {
  it('can be switched to', async () => {
    const { findByText } = await renderWorkingGroupProfile();
    userEvent.click(await findByText(/past/i, { selector: 'nav a *' }));
    expect(await findByText(/results/i)).toBeVisible();
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

  it('does not render event tabs when feature flag is disabled', async () => {
    disable('WORKING_GROUP_EVENTS');

    mockGetWorkingGroupEventsFromAlgolia.mockResolvedValue(response);
    await renderWorkingGroupProfile();

    expect(await screen.queryByText(/Past Events/i)).toBeNull();
    expect(await screen.queryByText(/Upcoming Events/i)).toBeNull();
  });
});
