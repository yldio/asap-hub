import { createListEventResponse } from '@asap-hub/fixtures';
import { render, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter, Route } from 'react-router-dom';

import { refreshCalendarsState } from '../calendar/state';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getEventsFromAlgolia } from '../api';
import { eventsState } from '../state';
import { CARD_VIEW_PAGE_SIZE } from '../../hooks';
import EventList from '../EventList';

jest.useFakeTimers();

jest.mock('../api');

const renderEventsListPage = async (
  searchQuery = '',
  currentTime = new Date(),
  past?: boolean,
) => {
  const result = render(
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
  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return result;
};

describe('Algolia', () => {
  const mockGetEvents = getEventsFromAlgolia as jest.MockedFunction<
    typeof getEventsFromAlgolia
  >;
  afterEach(() => {
    mockGetEvents.mockClear().mockResolvedValue(createListEventResponse(1));
  });

  it('can search for events', async () => {
    await renderEventsListPage('searchterm');
    expect(mockGetEvents).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        searchQuery: 'searchterm',
      }),
    );
  });

  it('sets after to an hour before date provided for upcoming events', async () => {
    await renderEventsListPage('', new Date('2020-01-01T12:00:00Z'));
    expect(mockGetEvents).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        after: new Date('2020-01-01T11:00:00Z').toISOString(),
      }),
    );
  });

  it('sets before to an hour before date provided for past events', async () => {
    await renderEventsListPage('', new Date('2020-01-01T12:00:00Z'), true);
    expect(mockGetEvents).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        before: new Date('2020-01-01T11:00:00Z').toISOString(),
        sort: {
          sortBy: 'endDate',
          sortOrder: 'desc',
        },
      }),
    );
  });
});
