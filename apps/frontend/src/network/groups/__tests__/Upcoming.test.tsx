import React from 'react';
import { render, waitFor } from '@testing-library/react';
import {
  createListEventResponse,
  createGroupResponse,
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

it('generates a group link', async () => {
  const { getByText } = await renderGroupUpcoming({
    ...createListEventResponse(2),
    items: createListEventResponse(1).items.map((item, index) => ({
      ...item,
      groups: [{ ...createGroupResponse(), name: `group ${index}`, id: '123' }],
    })),
  });
  expect(getByText('group 0').closest('a')?.href).toEqual(
    'http://localhost/network/groups/123',
  );
});

it('calls the api with after parameter', async () => {
  const currentTime = new Date(2021, 3, 2);
  await renderGroupUpcoming(undefined, currentTime);
  expect(mockGetGroupEvents).toHaveBeenLastCalledWith(
    id,
    {
      after: currentTime.toISOString(),
      currentPage: 0,
      pageSize: 10,
    },
    'Bearer id_token',
  );
});
