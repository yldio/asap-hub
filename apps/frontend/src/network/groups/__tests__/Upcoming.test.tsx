import React from 'react';
import { render, waitFor } from '@testing-library/react';
import {
  createListEventResponse,
  createGroupResponse,
  createEventResponse,
} from '@asap-hub/fixtures';
import { RecoilRoot } from 'recoil';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/frontend/src/auth/test-utils';

import Upcoming from '../Upcoming';
import { getGroupEvents } from '../api';
import { groupEventsState } from '../state';
import { DEFAULT_PAGE_SIZE } from '../../../hooks';

jest.useFakeTimers('modern');
jest.mock('../api');

const mockGetGroupEvents = getGroupEvents as jest.MockedFunction<
  typeof getGroupEvents
>;
const id = '42';
const renderGroupUpcoming = async (
  groupEventsResponse = createListEventResponse(1),
  currentTime = new Date(),
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
            <MemoryRouter initialEntries={[`/${id}/events/`]}>
              <Route path="/:id/events">
                <Upcoming currentTime={currentTime} />
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
  const { getAllByRole } = await renderGroupUpcoming({
    ...createListEventResponse(2),
    items: createListEventResponse(2).items.map((item, index) => ({
      ...item,
      title: `Event title ${index}`,
    })),
  });
  expect(
    getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent),
  ).toEqual(['Event title 0', 'Event title 1']);
  expect(
    getAllByRole('heading', { level: 3 }).map(
      (heading) => heading.closest('a')?.href,
    ),
  ).toMatchInlineSnapshot(`
    Array [
      "http://localhost/events/event-0",
      "http://localhost/events/event-1",
    ]
  `);
});

it('generates the event link', async () => {
  const { getByText } = await renderGroupUpcoming({
    ...createListEventResponse(1),
    items: [{ ...createEventResponse(), id: '42', title: 'My Event' }],
  });
  expect(getByText('My Event').closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/42$/),
  );
});

it('generates group links', async () => {
  const { getByText } = await renderGroupUpcoming({
    ...createListEventResponse(1),
    items: createListEventResponse(1).items.map((item, index) => ({
      ...item,
      groups: [{ ...createGroupResponse(), name: `group ${index}`, id: '123' }],
    })),
  });
  expect(getByText('group 0').closest('a')?.href).toEqual(
    'http://localhost/network/groups/123',
  );
});

it('sets after to an hour before now', async () => {
  await renderGroupUpcoming(undefined, new Date('2020-01-01T12:00:00Z'));
  expect(mockGetGroupEvents).toHaveBeenLastCalledWith(
    id,
    expect.objectContaining({
      after: new Date('2020-01-01T11:00:00Z').toISOString(),
    }),
    expect.anything(),
  );
});
