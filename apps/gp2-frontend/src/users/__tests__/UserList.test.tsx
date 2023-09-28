import { ClientSearchResponse } from '@asap-hub/algolia';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { ComponentProps, Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
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
      keywords: [],
      projects: [],
      workingGroups: [],
      ...filters,
    },
    updateFilters: mockUpdateFilter,
    toggleFilter: mockToggleFilter,
    searchQuery: '',
    debouncedSearchQuery: '',
    setSearchQuery: jest.fn(),
  }));

  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/users/']}>
              <Route path="/users">
                <UserList searchQuery={searchQuery} filters={filters} />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  return { mockUpdateFilter };
};
afterEach(jest.resetAllMocks);
it('fetches the user information', async () => {
  await renderUserList({
    filters: { regions: [], keywords: [], projects: [], workingGroups: [] },
  });

  await waitFor(() =>
    expect(mockGetAlgoliaUsers).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        regions: [],
        keywords: [],
        projects: [],
        workingGroups: [],
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
