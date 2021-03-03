import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import {
  createListEventResponse,
  createEventResponse,
} from '@asap-hub/fixtures';
import { MemoryRouter, Route } from 'react-router-dom';

import { refreshCalendarsState } from '../calendar/state';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getEvents } from '../api';
import { eventsState } from '../state';
import { DEFAULT_PAGE_SIZE } from '../../hooks';
import EventList from '../EventList';

jest.mock('../api');

const mockGetEvents = getEvents as jest.MockedFunction<typeof getEvents>;

const renderEventsListPage = async (
  currentTime = new Date(),
  past?: boolean,
) => {
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
  mockGetEvents.mockResolvedValue({
    ...createListEventResponse(2),
    items: createListEventResponse(2).items.map((item, index) => ({
      ...item,
      title: `Event title ${index}`,
    })),
  });

  const { getAllByRole } = await renderEventsListPage();
  expect(
    getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent),
  ).toEqual(['Event title 0', 'Event title 1']);
});

it('generates event links', async () => {
  mockGetEvents.mockResolvedValue({
    ...createListEventResponse(2),
    items: createListEventResponse(2).items.map((item, index) => ({
      ...item,
      id: `event-${index}`,
    })),
  });
  const { getAllByRole } = await renderEventsListPage();
  expect(
    getAllByRole('heading', { level: 3 }).map(
      (heading) => heading.closest('a')?.href,
    ),
  ).toEqual([
    expect.stringMatching(/event-0/i),
    expect.stringMatching(/event-1/i),
  ]);
});

it('generates the event link', async () => {
  mockGetEvents.mockResolvedValue({
    ...createListEventResponse(1),
    items: [{ ...createEventResponse(), id: '42', title: 'My Event' }],
  });
  const { getByText } = await renderEventsListPage();
  expect(getByText('My Event').closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/42$/),
  );
});

it('sets after to an hour before date provided for upcoming events', async () => {
  await renderEventsListPage(new Date('2020-01-01T12:00:00Z'));
  expect(mockGetEvents).toHaveBeenLastCalledWith(
    expect.objectContaining({
      after: new Date('2020-01-01T11:00:00Z').toISOString(),
    }),
    expect.anything(),
  );
});

it('sets before to an hour before date provided for past events', async () => {
  await renderEventsListPage(new Date('2020-01-01T12:00:00Z'), true);
  expect(mockGetEvents).toHaveBeenLastCalledWith(
    expect.objectContaining({
      before: new Date('2020-01-01T11:00:00Z').toISOString(),
      sort: {
        sortBy: 'endDate',
        sortOrder: 'desc',
      },
    }),
    expect.anything(),
  );
});
