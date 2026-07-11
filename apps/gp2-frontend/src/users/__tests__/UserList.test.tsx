import { ClientSearchResponse } from '@asap-hub/algolia';
import { createTestQueryClient } from '@asap-hub/frontend-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { ComponentProps, Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { useSearch } from '../../hooks/search';
import { createUserListAlgoliaResponse } from '../../__fixtures__/algolia';
import { getAlgoliaUsers } from '../api';
import UserList from '../UserList';

jest.mock('@asap-hub/frontend-utils', () => {
  const original = jest.requireActual('@asap-hub/frontend-utils');
  return {
    ...original,
    createCsvFileStream: jest
      .fn()
      .mockImplementation(() => ({ write: jest.fn(), end: jest.fn() })),
  };
});
jest.mock('../api');
jest.mock('../../hooks/search');
const mockGetAlgoliaUsers = getAlgoliaUsers as jest.MockedFunction<
  typeof getAlgoliaUsers
>;
const mockUseSearch = useSearch as jest.MockedFunction<typeof useSearch>;

const renderUserList = async ({
  searchQuery = '',
  filters = {},
  listUserResponse = createUserListAlgoliaResponse(1),
}: Partial<ComponentProps<typeof UserList>> & {
  listUserResponse?: ClientSearchResponse<'gp2', 'user'>;
} = {}) => {
  mockGetAlgoliaUsers.mockResolvedValue(listUserResponse);
  const mockUpdateFilter = jest.fn();
  const mockToggleFilter = jest.fn();
  mockUseSearch.mockImplementation(() => ({
    changeLocation: jest.fn(),
    filters: {
      regions: [],
      tags: [],
      projects: [],
      workingGroups: [],
      membershipStatus: [],
      ...filters,
    },
    updateFilters: mockUpdateFilter,
    toggleFilter: mockToggleFilter,
    searchQuery: '',
    debouncedSearchQuery: '',
    setSearchQuery: jest.fn(),
    tags: [],
    setTags: jest.fn(),
  }));

  render(
    // fresh query client per render replaces the recoil list-cache reset
    <QueryClientProvider client={createTestQueryClient()}>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/users/']}>
              <Routes>
                <Route
                  path="/users"
                  element={
                    <UserList searchQuery={searchQuery} filters={filters} />
                  }
                />
              </Routes>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </QueryClientProvider>,
  );
  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return { mockUpdateFilter };
};
beforeEach(jest.resetAllMocks);
it('fetches the user information', async () => {
  await renderUserList({
    filters: {
      regions: [],
      tags: [],
      projects: [],
      workingGroups: [],
      membershipStatus: ['Alumni Member'],
    },
  });

  await waitFor(() =>
    expect(mockGetAlgoliaUsers).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        regions: [],
        tags: [],
        projects: [],
        workingGroups: [],
        membershipStatus: ['Alumni Member'],
        searchQuery: '',
        currentPage: 0,
        pageSize: 10,
      }),
    ),
  );
});

it('renders a list of fetched groups', async () => {
  const listUserResponse = createUserListAlgoliaResponse(2);

  await renderUserList({ listUserResponse });
  expect(
    screen.getByRole('heading', { name: /tony stark 0/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('heading', { name: /tony stark 1/i }),
  ).toBeInTheDocument();
});
