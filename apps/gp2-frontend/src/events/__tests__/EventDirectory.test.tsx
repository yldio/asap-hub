import { createTestQueryClient } from '@asap-hub/frontend-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter } from 'react-router';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { useSearch } from '../../hooks';
import { createEventListAlgoliaResponse } from '../../__fixtures__/algolia';
import { getEvents } from '../api';
import EventDirectory from '../EventDirectory';
import { EventListProps } from '../EventsList';

jest.mock('../api');
jest.mock('../../hooks/search');

const renderList = async (props: EventListProps) => {
  render(
    // fresh query client per render replaces the recoil list-cache reset
    <QueryClientProvider client={createTestQueryClient()}>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/events']}>
              <EventDirectory {...props} />
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
const mockUseSearch = useSearch as jest.MockedFunction<typeof useSearch>;
const mockGetEvents = getEvents as jest.MockedFunction<typeof getEvents>;
describe('EventDirectory', () => {
  it('handles filter switching', async () => {
    mockGetEvents.mockResolvedValueOnce(createEventListAlgoliaResponse(1));
    const mockToggleFilter = jest.fn();
    mockUseSearch.mockImplementation(() => ({
      changeLocation: jest.fn(),
      filters: {},
      updateFilters: jest.fn(),
      toggleFilter: mockToggleFilter,
      searchQuery: '',
      debouncedSearchQuery: '',
      setSearchQuery: jest.fn(),
      tags: [],
      setTags: jest.fn(),
    }));

    await renderList({ currentTime: new Date(), searchQuery: '' });
    await userEvent.click(screen.getByLabelText('GP2 Hub'));

    expect(mockToggleFilter).toHaveBeenLastCalledWith('GP2 Hub', 'eventType');
  });
});
