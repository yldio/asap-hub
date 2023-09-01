import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getAlgoliaEvents } from '../api';
import { createEventListAlgoliaResponse } from '../../__fixtures__/algolia';
import EventsList, { EventListProps } from '../EventsList';
import { eventsState } from '../state';
import { PAGE_SIZE } from '../../hooks';

jest.mock('../api');
jest.mock('../calendar/api');

const renderRoutes = async (props: EventListProps, searchQuery = '') => {
  render(
    <RecoilRoot
      initializeState={({ reset }) => {
        reset(
          eventsState({
            after: new Date().toDateString(),
            searchQuery,
            currentPage: 0,
            filters: new Set(),
            pageSize: PAGE_SIZE,
          }),
        );
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/events']}>
              <EventsList {...props} />
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  return waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};
beforeEach(() => {
  jest.resetAllMocks();
});

describe('EventsList', () => {
  const mockGetEvents = getAlgoliaEvents as jest.MockedFunction<
    typeof getAlgoliaEvents
  >;
  it('renders events', async () => {
    mockGetEvents.mockResolvedValue(createEventListAlgoliaResponse(1));
    await renderRoutes({ currentTime: new Date() });
    expect(screen.getByRole('link', { name: 'Event 0' })).toBeInTheDocument();
  });

  it('renders past events', async () => {
    mockGetEvents.mockResolvedValue(createEventListAlgoliaResponse(1));
    await renderRoutes({ currentTime: new Date(), past: true });
    expect(screen.getByRole('link', { name: 'Event 0' })).toBeInTheDocument();
  });
});
