import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { PAGE_SIZE, useSearch } from '../../hooks';
import { createEventListAlgoliaResponse } from '../../__fixtures__/algolia';
import { getEvents } from '../api';
import EventDirectory from '../EventDirectory';
import { EventListProps } from '../EventsList';
import { eventsState } from '../state';

jest.mock('../api');
jest.mock('../../hooks/search');

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
              <EventDirectory {...props} />
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
    await userEvent.click(screen.queryByLabelText('GP2 Hub'));

    expect(mockToggleFilter).toHaveBeenLastCalledWith('GP2 Hub', 'eventType');
  });
});
