import { createListEventResponse } from '@asap-hub/fixtures';
import { act, render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { CARD_VIEW_PAGE_SIZE } from '../../hooks';
import { getEvents } from '../api';
import { refreshCalendarsState } from '../calendar/state';
import EventList from '../EventList';
import { eventsState } from '../state';

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

jest.mock('../api');

const mockGetEvents = getEvents as jest.MockedFunction<typeof getEvents>;
afterEach(() => {
  mockGetEvents.mockClear().mockResolvedValue(createListEventResponse(1));
});

const renderEventsListPage = async ({
  searchQuery = '',
  currentTime = new Date(),
  past,
}: {
  searchQuery?: string;
  currentTime?: Date;
  past?: boolean;
}) => {
  await act(async () => {
    render(
      <RecoilRoot
        initializeState={({ set, reset }) => {
          set(refreshCalendarsState, Math.random());
          reset(
            eventsState({
              searchQuery,
              currentPage: 0,
              filters: new Set(),
              pageSize: CARD_VIEW_PAGE_SIZE,
              after: new Date().toISOString(),
            }),
          );
        }}
      >
        <Suspense fallback="loading">
          <Auth0Provider user={{}}>
            <WhenReady>
              <MemoryRouter initialEntries={[{ pathname: '/' }]}>
                <Route path="/">
                  <EventList
                    searchQuery={searchQuery}
                    currentTime={currentTime}
                    past={past}
                  />
                </Route>
              </MemoryRouter>
            </WhenReady>
          </Auth0Provider>
        </Suspense>
      </RecoilRoot>,
    );
  });
  await act(async () => {
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );
  });
};

it('renders a list of event cards', async () => {
  mockGetEvents.mockResolvedValue({
    ...createListEventResponse(2),
    items: createListEventResponse(2).items.map((item, index) => ({
      ...item,
      title: `Event title ${index}`,
    })),
  });

  await renderEventsListPage({});

  expect(
    screen
      .getAllByRole('heading', { level: 3 })
      .map((heading) => heading.textContent),
  ).toEqual(['Event title 0', 'Event title 1']);
});

it('can search for events', async () => {
  const searchQuery = 'searchterm';
  await renderEventsListPage({ searchQuery });
  expect(mockGetEvents).toHaveBeenCalledWith(
    expect.objectContaining({
      searchQuery,
    }),
    expect.anything(),
  );
});

it('sets after to an hour before date provided for upcoming events', async () => {
  const currentTime = new Date('2020-01-01T12:00:00Z');
  await renderEventsListPage({ currentTime });
  expect(mockGetEvents).toHaveBeenCalledWith(
    expect.objectContaining({
      after: new Date('2020-01-01T11:00:00Z').toISOString(),
    }),
    expect.anything(),
  );
});

it('sets before to an hour before date provided for past events', async () => {
  const currentTime = new Date('2020-01-01T12:00:00Z');
  const past = true;
  await renderEventsListPage({ currentTime, past });
  expect(mockGetEvents).toHaveBeenCalledWith(
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
