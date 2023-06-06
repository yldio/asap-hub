import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { createCsvFileStream } from '@asap-hub/frontend-utils';
import { gp2 as gp2Model } from '@asap-hub/model';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { useSearch } from '../../hooks/search';
import { getProjects } from '../../projects/api';
import { getWorkingGroups } from '../../working-groups/api';
import { getUsers } from '../api';
import { MAX_RESULTS } from '../export';
import UserDirectory from '../UserDirectory';

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
jest.mock('../../projects/api');
jest.mock('../../working-groups/api');
jest.mock('../../hooks/search');
const mockGetUsers = getUsers as jest.MockedFunction<typeof getUsers>;
const mockGetProjects = getProjects as jest.MockedFunction<typeof getProjects>;
const mockGetWorkingGroups = getWorkingGroups as jest.MockedFunction<
  typeof getWorkingGroups
>;
const mockCreateCsvFileStream = createCsvFileStream as jest.MockedFunction<
  typeof createCsvFileStream
>;
const mockUseSearch = useSearch as jest.MockedFunction<typeof useSearch>;

const renderUserDirectory = async ({
  listUserResponse = gp2Fixtures.createUsersResponse(),
  listProjectResponse = gp2Fixtures.createProjectsResponse(),
  listWorkingGroupResponse = gp2Fixtures.createWorkingGroupsResponse(),
  displayFilters = false,
  isAdministrator = false,
  filters = {},
}: {
  listUserResponse?: gp2Model.ListUserResponse;
  listProjectResponse?: gp2Model.ListProjectResponse;
  listWorkingGroupResponse?: gp2Model.ListWorkingGroupResponse;
  displayFilters?: boolean;
  isAdministrator?: boolean;
  filters?: Partial<ReturnType<typeof useSearch>['filters']>;
} = {}) => {
  mockGetUsers.mockResolvedValue(listUserResponse);
  mockGetProjects.mockResolvedValue(listProjectResponse);
  mockGetWorkingGroups.mockResolvedValue(listWorkingGroupResponse);

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
        <Auth0Provider
          user={{ role: isAdministrator ? 'Administrator' : undefined }}
        >
          <WhenReady>
            <MemoryRouter initialEntries={['/users/']}>
              <Route path="/users">
                <UserDirectory displayFilters={displayFilters} />
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
afterEach(jest.clearAllMocks);

it('renders the filters modal', async () => {
  await renderUserDirectory({ displayFilters: true });
  expect(screen.getByRole('heading', { name: 'Filters' })).toBeVisible();
});

it.each`
  name               | value
  ${'regions'}       | ${'Asia'}
  ${'keywords'}      | ${'Aging'}
  ${'projects'}      | ${'42'}
  ${'workingGroups'} | ${'42'}
`(
  'calls the updateFilters with the right arguments for $name',
  async ({ name, value }) => {
    const { mockUpdateFilter } = await renderUserDirectory({
      displayFilters: true,
      filters: { [name]: [value] },
    });
    userEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(mockUpdateFilter).toHaveBeenCalledWith('/users', {
      regions: [],
      keywords: [],
      projects: [],
      workingGroups: [],
      [name]: [value],
    });
  },
);
it('triggers export with the same parameters but overrides onlyOnboarded with false', async () => {
  await renderUserDirectory({ isAdministrator: true });
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
  userEvent.click(screen.getByRole('button', { name: 'Export Export' }));
  expect(mockCreateCsvFileStream).toHaveBeenLastCalledWith(
    expect.stringMatching('user_export.csv'),
    expect.anything(),
  );
  await waitFor(() =>
    expect(mockGetUsers).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: {
          regions: [],
          keywords: [],
          projects: [],
          workingGroups: [],
          onlyOnboarded: false,
        },
        search: '',
        skip: 0,
        take: MAX_RESULTS,
      }),
      expect.anything(),
    ),
  );
});
