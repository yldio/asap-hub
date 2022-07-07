import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
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
import { getGroupEvents } from '../events/api';

jest.mock('../api');
jest.mock('../events/api');
jest.mock('../../../events/api');

const mockGetGroup = getGroup as jest.MockedFunction<typeof getGroup>;
const mockGetGroupEvents = getGroupEvents as jest.MockedFunction<
  typeof getGroupEvents
>;

const renderGroupProfile = async (
  groupResponse = createGroupResponse(),
  { groupId = groupResponse.id } = {},
  getEvents = async () => createListEventResponse(5),
) => {
  mockGetGroup.mockImplementation(async (id) =>
    id === groupResponse.id ? groupResponse : undefined,
  );
  mockGetGroupEvents.mockImplementation(getEvents);

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

it('deep links to the teams section', async () => {
  const { findByText, container } = await renderGroupProfile(
    createGroupResponse({ teamsCount: 1 }),
  );

  const anchor = (await findByText(/1 team/i)).closest('a');
  expect(anchor).toBeVisible();
  const { hash } = new URL(anchor!.href, globalThis.location.href);

  expect(container.querySelector(hash)).toHaveTextContent(/teams/i);
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
});

describe('the upcoming events tab', () => {
  it('can be switched to', async () => {
    const { findByText } = await renderGroupProfile();
    userEvent.click(await findByText(/upcoming/i, { selector: 'nav a *' }));
    expect(await findByText(/results/i)).toBeVisible();
  });

  it('can search for events', async () => {
    const { findByRole, findByText } = await renderGroupProfile({
      ...createGroupResponse(),
      id: '42',
    });
    userEvent.click(await findByText(/upcoming/i, { selector: 'nav a *' }));
    userEvent.type(await findByRole('searchbox'), 'searchterm');
    await waitFor(() =>
      expect(mockGetGroupEvents).toHaveBeenLastCalledWith(
        '42',
        expect.objectContaining({ searchQuery: 'searchterm' }),
        expect.anything(),
      ),
    );
  });
});

describe('the past events tab', () => {
  it('can be switched to', async () => {
    const { findByText } = await renderGroupProfile();
    userEvent.click(await findByText(/past/i, { selector: 'nav a *' }));
    expect(await findByText(/results/i)).toBeVisible();
  });

  it('preserves the search query from another tab', async () => {
    const { findByRole, findByText } = await renderGroupProfile();

    userEvent.click(await findByText(/upcoming/i, { selector: 'nav a *' }));
    userEvent.type(await findByRole('searchbox'), 'searchterm');

    userEvent.click(await findByText(/past/i, { selector: 'nav a *' }));
    expect(await findByText(/results/i)).toBeVisible();

    expect(await findByRole('searchbox')).toHaveValue('searchterm');
  });

  it('displays proper information for empty events response', async () => {
    const { findByText } = await renderGroupProfile(
      {
        ...createGroupResponse(),
        id: '42',
      },
      undefined,
      async () => createListEventResponse(0),
    );
    userEvent.click(await findByText(/past/i, { selector: 'nav a *' }));
    expect(
      await findByText(/This group doesn't have any past events!/i),
    ).toBeVisible();
  });
});
