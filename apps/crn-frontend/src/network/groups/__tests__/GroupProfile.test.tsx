import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  createGroupResponse,
  createListEventResponse,
} from '@asap-hub/fixtures';
import { network } from '@asap-hub/routing';

import GroupProfile from '../GroupProfile';
import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { refreshGroupState } from '../state';
import { getGroup } from '../api';
import { getEvents } from '../../../events/api';

jest.mock('../api');
jest.mock('../../../events/api');

const mockGetGroup = getGroup as jest.MockedFunction<typeof getGroup>;
const mockGetGroupEventsFromAlgolia = getEvents as jest.MockedFunction<
  typeof getEvents
>;

beforeEach(jest.clearAllMocks);

const renderGroupProfile = async (
  groupResponse = createGroupResponse(),
  { groupId = groupResponse.id } = {},
) => {
  mockGetGroup.mockImplementation(async (id) =>
    id === groupResponse.id ? groupResponse : undefined,
  );

  const result = render(
    <RecoilRoot
      initializeState={({ set }) =>
        set(refreshGroupState(groupResponse.id), Math.random())
      }
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[network({}).groups({}).group({ groupId }).$]}
            >
              <Route
                path={
                  network.template +
                  network({}).groups.template +
                  network({}).groups({}).group.template
                }
              >
                <GroupProfile currentTime={new Date()} />
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

it('renders the about group information by default', async () => {
  const { findAllByText } = await renderGroupProfile(createGroupResponse());
  expect(await findAllByText(/description/i)).not.toHaveLength(0);
});

// [CRN-1106] Remove skip when adding new Group Members component
// eslint-disable-next-line jest/no-disabled-tests
it.skip('deep links to the teams section', async () => {
  const { findByText, container } = await renderGroupProfile(
    createGroupResponse({ teamsCount: 1 }),
  );

  const anchor = (await findByText(/1 team/i)).closest('a');
  expect(anchor).toBeVisible();
  const { hash } = new URL(anchor!.href, globalThis.location.href);

  expect(container.querySelector(hash)).toHaveTextContent(/teams/i);
});

it('does not count inactive teams in the count', async () => {
  const response = createGroupResponse({ teamsCount: 1 });
  await renderGroupProfile({
    ...response,
    teams: [
      { ...response.teams[0], id: '1', inactiveSince: undefined },
      { ...response.teams[0], id: '2', inactiveSince: undefined },
      { ...response.teams[0], id: '3', inactiveSince: undefined },
    ],
  });
  expect(await screen.findByText(/3 team/i)).toBeVisible();

  await renderGroupProfile({
    ...response,
    teams: [
      { ...response.teams[0], id: '1', inactiveSince: undefined },
      { ...response.teams[0], id: '2', inactiveSince: undefined },
      {
        ...response.teams[0],
        id: '3',
        inactiveSince: new Date().toISOString(),
      },
    ],
  });

  expect(await screen.findByText(/2 team/i)).toBeVisible();
});

it('generates a different deep link every time to avoid conflicts', async () => {
  const result1 = await renderGroupProfile(
    createGroupResponse({ teamsCount: 1 }),
  );
  const { href: href1 } = (await result1.findByText(/1 team/i)).closest('a')!;
  result1.unmount();

  const result2 = await renderGroupProfile(
    createGroupResponse({ teamsCount: 1 }),
  );
  const { href: href2 } = (await result2.findByText(/1 team/i)).closest('a')!;

  expect(href2).not.toEqual(href1);
});

describe('the calendar tab', () => {
  it('can be switched to', async () => {
    const { findByText, findAllByText } = await renderGroupProfile(
      createGroupResponse(),
    );
    userEvent.click(await findByText(/calendar/i, { selector: 'nav a *' }));
    expect(await findAllByText(/subscribe/i)).not.toHaveLength(0);
  });
  it('cannot be switched to if the group is inactive', async () => {
    const { queryByText } = await renderGroupProfile({
      ...createGroupResponse(),
      active: false,
    });
    expect(await queryByText('Calendar')).not.toBeInTheDocument();
  });
});

describe('the upcoming events tab', () => {
  it('can be switched to', async () => {
    const { findByText } = await renderGroupProfile();
    userEvent.click(await findByText(/upcoming/i, { selector: 'nav a *' }));
    expect(await findByText(/results/i)).toBeVisible();
  });
  it('cannot be switched to if the group is inactive', async () => {
    const { queryByText } = await renderGroupProfile({
      ...createGroupResponse(),
      active: false,
    });
    expect(await queryByText('Upcoming Events')).not.toBeInTheDocument();
  });
});

describe('the past events tab', () => {
  it('can be switched to', async () => {
    const { findByText } = await renderGroupProfile();
    userEvent.click(await findByText(/past/i, { selector: 'nav a *' }));
    expect(await findByText(/results/i)).toBeVisible();
  });
});

describe('the event tabs', () => {
  it('renders number of upcoming events from algolia', async () => {
    const response = createListEventResponse(7);
    mockGetGroupEventsFromAlgolia.mockResolvedValue(response);
    await renderGroupProfile();

    expect(await screen.findByText(/Upcoming Events \(7\)/i)).toBeVisible();
  });

  it('renders number of past events from algolia', async () => {
    const response = createListEventResponse(7, { isEventInThePast: true });
    mockGetGroupEventsFromAlgolia.mockResolvedValue(response);
    await renderGroupProfile();

    expect(await screen.findByText(/Past Events \(7\)/i)).toBeVisible();
  });
});
