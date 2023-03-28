import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';
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
import { getUsers } from '../api';
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
const mockGetUsers = getUsers as jest.MockedFunction<typeof getUsers>;
const mockUseSearch = useSearch as jest.MockedFunction<typeof useSearch>;

const renderUserList = async ({
  searchQuery = '',
  filters = {},
  listUserResponse = gp2Fixtures.createUsersResponse(),
}: Partial<ComponentProps<typeof UserList>> & {
  listUserResponse?: gp2Model.ListUserResponse;
} = {}) => {
  mockGetUsers.mockResolvedValue(listUserResponse);
  const mockUpdateFilter = jest.fn();
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
    expect(mockGetUsers).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: { regions: [], keywords: [], projects: [], workingGroups: [] },
        search: '',
        skip: 0,
        take: 10,
      }),
      expect.anything(),
    ),
  );
});

it('renders a list of fetched groups', async () => {
  const listUserResponse = {
    total: 2,
    items: gp2Fixtures.createUsersResponse(2).items.map((user, i) => ({
      ...user,
      id: `${i}`,
      displayName: `Display Name ${i}`,
    })),
  };
  await renderUserList({ listUserResponse });
  expect(
    screen.getByRole('heading', { name: /display name 0/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('heading', { name: /display name 1/i }),
  ).toBeInTheDocument();
});
