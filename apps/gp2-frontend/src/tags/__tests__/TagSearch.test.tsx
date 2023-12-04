import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import {
  AlgoliaSearchClient,
  EMPTY_ALGOLIA_FACET_HITS,
  EMPTY_ALGOLIA_RESPONSE,
} from '@asap-hub/algolia';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { PAGE_SIZE, useSearch } from '../../hooks';
import { useAlgolia } from '../../hooks/algolia';
import { createEventListAlgoliaResponse } from '../../__fixtures__/algolia';
import { getTagSearchResults } from '../api';
import TagSearch from '../TagSearch';
import { tagSearchResultsState } from '../state';

jest.mock('../api');
jest.mock('../../hooks/search');
jest.mock('../../hooks/algolia', () => ({
  useAlgolia: jest.fn(),
}));
const mockToggleFilter = jest.fn();
const mockSetTags = jest.fn();

const renderPage = async (tags = []) => {
  render(
    <RecoilRoot
      initializeState={({ reset }) => {
        reset(
          tagSearchResultsState({
            tags: [],
            currentPage: 0,
            entityType: new Set(),
            pageSize: PAGE_SIZE,
          }),
        );
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/tags?tag=test']}>
              <TagSearch />
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  return waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
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
    userEvent.click(screen.getByLabelText('Outputs'));
    expect(mockToggleFilter).toHaveBeenLastCalledWith('output', 'entityType');
  });

  it('Will set selected tag for search', async () => {
    mockSearchForTagValues.mockResolvedValue({
      ...EMPTY_ALGOLIA_FACET_HITS,
      facetHits: [{ value: 'LGW', count: 1, highlighted: 'LGW' }],
    });

    await renderPage();
    userEvent.click(screen.getByRole('textbox'));
    userEvent.click(screen.getByText('LGW'));
    expect(mockSetTags).toHaveBeenCalledWith(['LGW']);
  });
});
