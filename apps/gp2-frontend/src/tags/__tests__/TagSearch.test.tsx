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
import { getTagSearchResults } from '../api';
import TagSearch from '../TagSearch';
import { tagSearchResultsState } from '../state';

jest.mock('../api');
jest.mock('../../hooks/search');

const renderList = async (tags = []) => {
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
  jest.resetAllMocks();
});
const mockUseSearch = useSearch as jest.MockedFunction<typeof useSearch>;
const mockGetTags = getTagSearchResults as jest.MockedFunction<
  typeof getTagSearchResults
>;

describe('TagSearch', () => {
  it('handles filter switching', async () => {
    mockGetTags.mockResolvedValue(createEventListAlgoliaResponse(1));
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

    await renderList();
    userEvent.click(
      screen.getByRole('checkbox', {
        name: 'Outputs',
      }),
    );
    expect(mockToggleFilter).toHaveBeenLastCalledWith('output', 'entityType');
  });
});
