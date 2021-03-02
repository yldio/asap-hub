import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/frontend/src/auth/test-utils';
import {
  createListEventResponse,
  createEventResponse,
} from '@asap-hub/fixtures';
import { MemoryRouter, Route } from 'react-router-dom';

import { refreshCalendarsState } from '../calendar/state';
import { getEvents } from '../api';
import { eventsState } from '../state';
import { DEFAULT_PAGE_SIZE } from '../../hooks';
import Upcoming from '../Upcoming';

jest.mock('../api');

const mockGetEvents = getEvents as jest.MockedFunction<typeof getEvents>;

const renderEventsUpcomingPage = async (currentTime = new Date()) => {
  const result = render(
    <RecoilRoot
      initializeState={({ set, reset }) => {
        set(refreshCalendarsState, Math.random());
        reset(
          eventsState({
            currentPage: 0,
            pageSize: DEFAULT_PAGE_SIZE,
            after: new Date().toISOString(),
          }),
        );
      }}
    >
      <React.Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[{ pathname: '/' }]}>
              <Route path="/">
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
  mockGetEvents.mockResolvedValue({
    ...createListEventResponse(2),
    items: createListEventResponse(2).items.map((item, index) => ({
      ...item,
      title: `Event title ${index}`,
    })),
  });

  const { getAllByRole } = await renderEventsUpcomingPage();
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
  mockGetEvents.mockResolvedValue({
    ...createListEventResponse(1),
    items: [{ ...createEventResponse(), id: '42', title: 'My Event' }],
  });
  const { getByText } = await renderEventsUpcomingPage();
  expect(getByText('My Event').closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/42$/),
  );
});

it('sets after to an hour before date provided', async () => {
  await renderEventsUpcomingPage(new Date('2020-01-01T12:00:00Z'));
  expect(mockGetEvents).toHaveBeenLastCalledWith(
    {
      after: new Date('2020-01-01T11:00:00Z').toISOString(),
      currentPage: 0,
      pageSize: 10,
    },
    expect.anything(),
  );
});
