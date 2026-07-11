import { createTestQueryClient } from '@asap-hub/frontend-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter } from 'react-router';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { createEventListAlgoliaResponse } from '../../__fixtures__/algolia';
import { getEvents } from '../api';
import EventsList, { EventListProps } from '../EventsList';

jest.mock('../api');
jest.mock('../calendar/api');

const renderList = async (props: EventListProps) => {
  render(
    // fresh query client per render replaces the recoil list-cache reset
    <QueryClientProvider client={createTestQueryClient()}>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/events']}>
              <EventsList {...props} />
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </QueryClientProvider>,
  );
  return waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
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
