import { createTestQueryClient } from '@asap-hub/frontend-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter } from 'react-router';
import {
  AlgoliaSearchClient,
  EMPTY_ALGOLIA_FACET_HITS,
  EMPTY_ALGOLIA_RESPONSE,
} from '@asap-hub/algolia';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { useSearch } from '../../hooks';
import { useAlgolia } from '../../hooks/algolia';
import { createEventListAlgoliaResponse } from '../../__fixtures__/algolia';
import { getTagSearchResults } from '../api';
import TagSearch from '../TagSearch';

jest.mock('../api');
jest.mock('../../hooks/search');
jest.mock('../../hooks/algolia', () => ({
  useAlgolia: jest.fn(),
}));
const mockToggleFilter = jest.fn();
const mockSetTags = jest.fn();

const renderPage = async () => {
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/tags?tag=test']}>
              <TagSearch />
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
  jest.clearAllMocks();
  const mockUseAlgolia = useAlgolia as jest.MockedFunction<typeof useAlgolia>;
  const mockAlgoliaClient = {
    searchForTagValues: mockSearchForTagValues,
    search: mockSearch,
  };
  mockUseAlgolia.mockReturnValue({
    client: mockAlgoliaClient as unknown as AlgoliaSearchClient<'gp2'>,
  });
  mockAlgoliaClient.search.mockResolvedValue(EMPTY_ALGOLIA_RESPONSE);
  mockAlgoliaClient.searchForTagValues.mockResolvedValue(
    EMPTY_ALGOLIA_FACET_HITS,
  );
  mockUseSearch.mockImplementation(() => ({
    changeLocation: jest.fn(),
    filters: {},
    updateFilters: jest.fn(),
    toggleFilter: mockToggleFilter,
    searchQuery: '',
    debouncedSearchQuery: '',
    setSearchQuery: jest.fn(),
    tags: [],
    setTags: mockSetTags,
  }));
});

const mockSearchForTagValues = jest.fn() as jest.MockedFunction<
  AlgoliaSearchClient<'gp2'>['searchForTagValues']
>;
const mockSearch = jest.fn() as jest.MockedFunction<
  AlgoliaSearchClient<'crn'>['search']
>;
const mockUseSearch = useSearch as jest.MockedFunction<typeof useSearch>;
const mockGetTags = getTagSearchResults as jest.MockedFunction<
  typeof getTagSearchResults
>;

describe('TagSearch', () => {
  it('handles filter switching', async () => {
    mockGetTags.mockResolvedValue(createEventListAlgoliaResponse(1));

    await renderPage();
    await userEvent.click(screen.getByLabelText('Outputs'));
    expect(mockToggleFilter).toHaveBeenLastCalledWith('output', 'entityType');
  });

  it('Will set selected tag for search', async () => {
    mockSearchForTagValues.mockResolvedValue({
      ...EMPTY_ALGOLIA_FACET_HITS,
      facetHits: [{ value: 'LGW', count: 1, highlighted: 'LGW' }],
    });

    await renderPage();
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(
      await screen.findByRole('option', { name: 'LGW' }, { timeout: 5000 }),
    );
    expect(mockSetTags).toHaveBeenCalledWith(['LGW']);
  });
});
