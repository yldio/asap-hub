import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { PAGE_SIZE } from '../../hooks';
import { createEventListAlgoliaResponse } from '../../__fixtures__/algolia';
import { getEvents } from '../api';
import EventsList, { EventListProps } from '../EventsList';
import { eventsState } from '../state';

jest.mock('../api');
jest.mock('../calendar/api');

const renderList = async (props: EventListProps, searchQuery = '') => {
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
  const mockGetEvents = getEvents as jest.MockedFunction<typeof getEvents>;
  it('renders events', async () => {
    mockGetEvents.mockResolvedValue(createEventListAlgoliaResponse(1));
    await renderList({ currentTime: new Date() });
    expect(screen.getByRole('link', { name: 'Event 0' })).toBeInTheDocument();
  });

  it('renders past events', async () => {
    mockGetEvents.mockResolvedValue(createEventListAlgoliaResponse(1));
    await renderList({ currentTime: new Date(), past: true });
    expect(screen.getByRole('link', { name: 'Event 0' })).toBeInTheDocument();
  });
});
