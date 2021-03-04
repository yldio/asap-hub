import React from 'react';
import { render, waitFor } from '@testing-library/react';
import {
  createListEventResponse,
  createGroupResponse,
  createEventResponse,
} from '@asap-hub/fixtures';
import { RecoilRoot } from 'recoil';
import { MemoryRouter, Route } from 'react-router-dom';
import { Auth0Provider, WhenReady } from '../../../auth/test-utils';

import EventList from '../EventList';
import { getGroupEvents } from '../api';
import { groupEventsState } from '../state';
import { DEFAULT_PAGE_SIZE } from '../../../hooks';

jest.mock('../api');

const mockGetGroupEvents = getGroupEvents as jest.MockedFunction<
  typeof getGroupEvents
>;
const id = '42';
const renderGroupEventList = async (
  groupEventsResponse = createListEventResponse(1),
  currentTime = new Date(),
  past?: boolean,
) => {
  mockGetGroupEvents.mockResolvedValue(groupEventsResponse);

  const result = render(
    <RecoilRoot
      initializeState={({ set, reset }) => {
        reset(
          groupEventsState({
            currentPage: 0,
            pageSize: DEFAULT_PAGE_SIZE,
            after: new Date().toISOString(),
            id,
          }),
        );
      }}
    >
      <React.Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[`/${id}`]}>
              <Route path="/:id">
                <EventList past={past} currentTime={currentTime} />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </React.Suspense>
    </RecoilRoot>,
  );
  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return result;
};

it('renders a list of event cards', async () => {
  const { getAllByRole } = await renderGroupEventList({
    ...createListEventResponse(2),
    items: createListEventResponse(2).items.map((item, index) => ({
      ...item,
      title: `Event title ${index}`,
    })),
  });
  expect(
    getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent),
  ).toEqual(['Event title 0', 'Event title 1']);
});

it('generates the event link', async () => {
  const { getByText } = await renderGroupEventList({
    ...createListEventResponse(1),
    items: [{ ...createEventResponse(), id: '42', title: 'My Event' }],
  });
  expect(getByText('My Event').closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/42$/),
  );
});

it('generates group links', async () => {
  const { getByText } = await renderGroupEventList({
    ...createListEventResponse(1),
    items: [
      {
        ...createEventResponse(),
        groups: [{ ...createGroupResponse(), id: 'g0', name: 'My Group' }],
      },
    ],
  });
  expect(getByText('My Group').closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/g0/),
  );
});

it('sets after to an hour before now for upcoming events', async () => {
  await renderGroupEventList(undefined, new Date('2020-01-01T12:00:00Z'));
  expect(mockGetGroupEvents).toHaveBeenLastCalledWith(
    id,
    expect.objectContaining({
      after: new Date('2020-01-01T11:00:00Z').toISOString(),
    }),
    expect.anything(),
  );
});

it('sets before to an hour before now and sort parameters for past events', async () => {
  await renderGroupEventList(undefined, new Date('2020-01-01T12:00:00Z'), true);
  expect(mockGetGroupEvents).toHaveBeenLastCalledWith(
    id,
    expect.objectContaining({
      before: new Date('2020-01-01T11:00:00.000Z').toISOString(),
      sort: { sortBy: 'endDate', sortOrder: 'desc' },
    }),
    expect.anything(),
  );
});
