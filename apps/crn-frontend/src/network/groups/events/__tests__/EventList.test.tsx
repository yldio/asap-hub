import { ComponentType, FC, Suspense } from 'react';
import { render, waitFor } from '@testing-library/react';
import {
  createListEventResponse,
  createGroupResponse,
  createEventResponse,
} from '@asap-hub/fixtures';
import { RecoilRoot } from 'recoil';
import { MemoryRouter, Route } from 'react-router-dom';
import { network } from '@asap-hub/routing';
import { mockConsoleError } from '@asap-hub/dom-test-utils';

import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { ErrorBoundary } from '@asap-hub/frontend-utils';

import EventList from '../EventList';
import { getGroupEvents } from '../api';
import { groupEventsState } from '../state';
import { getEventListOptions } from '../../../../events/options';

jest.mock('../api');
const mockGetGroupEvents = getGroupEvents as jest.MockedFunction<
  typeof getGroupEvents
>;

mockConsoleError();

const groupId = '42';
beforeEach(() => {
  mockGetGroupEvents.mockClear().mockResolvedValue(createListEventResponse(1));
});

const renderGroupEventList = async (
  { searchQuery = '', currentTime = new Date(), past = false } = {},
  wrapper?: ComponentType,
) => {
  const result = render(
    <RecoilRoot
      initializeState={({ reset }) => {
        reset(
          groupEventsState({
            ...getEventListOptions(currentTime, false),
            groupId,
          }),
        );
        reset(
          groupEventsState({
            ...getEventListOptions(currentTime, true),
            groupId,
          }),
        );
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[
                network({})
                  .groups({})
                  .group({ groupId })
                  [past ? 'past' : 'upcoming']({}).$,
              ]}
            >
              <Route
                path={
                  network.template +
                  network({}).groups.template +
                  network({}).groups({}).group.template +
                  network({}).groups({}).group({ groupId })[
                    past ? 'past' : 'upcoming'
                  ].template
                }
              >
                <EventList
                  past={past}
                  currentTime={currentTime}
                  searchQuery={searchQuery}
                />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
    { wrapper },
  );
  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return result;
};

it('renders a list of event cards', async () => {
  mockGetGroupEvents.mockResolvedValue({
    ...createListEventResponse(2),
    items: createListEventResponse(2).items.map((item, index) => ({
      ...item,
      title: `Event title ${index}`,
    })),
  });
  const { getAllByRole } = await renderGroupEventList();
  expect(
    getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent),
  ).toEqual(['Event title 0', 'Event title 1']);
});

it('generates the event link', async () => {
  mockGetGroupEvents.mockResolvedValue({
    ...createListEventResponse(1),
    items: [{ ...createEventResponse(), id: '42', title: 'My Event' }],
  });
  const { getByText } = await renderGroupEventList();
  expect(getByText('My Event').closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/42$/),
  );
});

it('generates group links', async () => {
  mockGetGroupEvents.mockResolvedValue({
    ...createListEventResponse(1),
    items: [
      {
        ...createEventResponse(),
        group: { ...createGroupResponse(), id: 'g0', name: 'My Group' },
      },
    ],
  });
  const { getByText } = await renderGroupEventList();
  expect(getByText('My Group').closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/g0/),
  );
});

it('can search for events', async () => {
  await renderGroupEventList({ searchQuery: 'searchterm' });
  expect(mockGetGroupEvents).toHaveBeenCalledWith(
    groupId,
    expect.objectContaining({
      searchQuery: 'searchterm',
    }),
    expect.anything(),
  );
});

it('sets after to an hour before now for upcoming events', async () => {
  await renderGroupEventList({
    searchQuery: '',
    currentTime: new Date('2020-01-01T12:00:00Z'),
  });
  expect(mockGetGroupEvents).toHaveBeenCalledWith(
    groupId,
    expect.objectContaining({
      after: new Date('2020-01-01T11:00:00Z').toISOString(),
    }),
    expect.anything(),
  );
});

it('sets before to an hour before now and sort parameters for past events', async () => {
  await renderGroupEventList({
    searchQuery: '',
    currentTime: new Date('2020-01-01T12:00:00Z'),
    past: true,
  });
  expect(mockGetGroupEvents).toHaveBeenCalledWith(
    groupId,
    expect.objectContaining({
      before: new Date('2020-01-01T11:00:00.000Z').toISOString(),
      sort: { sortBy: 'endDate', sortOrder: 'desc' },
    }),
    expect.anything(),
  );
});

it('throws if the group does not exist', async () => {
  mockGetGroupEvents.mockResolvedValue(undefined);
  const errorWrapper: FC = ({ children }) => (
    <ErrorBoundary>{children}</ErrorBoundary>
  );
  const { getByText } = await renderGroupEventList({}, errorWrapper);
  expect(getByText(/failed.+group.+exist/i)).toBeVisible();
});
