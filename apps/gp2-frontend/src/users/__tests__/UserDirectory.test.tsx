import { ClientSearchResponse } from '@asap-hub/algolia';
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
import { getTags } from '../../shared/api';
import { getWorkingGroups } from '../../working-groups/api';
import {
  createProjectListAlgoliaResponse,
  createUserListAlgoliaResponse,
} from '../../__fixtures__/algolia';
import { getAlgoliaUsers, getUsers } from '../api';
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
jest.mock('../../shared/api');
const mockGetAlgoliaUsers = getAlgoliaUsers as jest.MockedFunction<
  typeof getAlgoliaUsers
>;
const mockGetUsers = getUsers as jest.MockedFunction<typeof getUsers>;
const mockGetProjects = getProjects as jest.MockedFunction<typeof getProjects>;
const mockGetWorkingGroups = getWorkingGroups as jest.MockedFunction<
  typeof getWorkingGroups
>;
const mockCreateCsvFileStream = createCsvFileStream as jest.MockedFunction<
  typeof createCsvFileStream
>;
const mockUseSearch = useSearch as jest.MockedFunction<typeof useSearch>;
const mockGetTags = getTags as jest.MockedFunction<typeof getTags>;

const renderUserDirectory = async ({
  listUserResponse = gp2Fixtures.createUsersResponse(),
  listUserAlgoliaResponse = createUserListAlgoliaResponse(1),
  listProjectResponse = createProjectListAlgoliaResponse(1),
  listWorkingGroupResponse = gp2Fixtures.createWorkingGroupsResponse(),
  listTagResponse = gp2Fixtures.createTagsResponse(),
  displayFilters = false,
  isAdministrator = false,
  filters = {},
  searchQuery = '',
}: {
  listUserAlgoliaResponse?: ClientSearchResponse<'gp2', 'user'>;
  listUserResponse?: gp2Model.ListUserResponse;
  listProjectResponse?: ClientSearchResponse<'gp2', 'project'>;
  listWorkingGroupResponse?: gp2Model.ListWorkingGroupResponse;
  listTagResponse?: gp2Model.ListTagsResponse;
  displayFilters?: boolean;
  isAdministrator?: boolean;
  filters?: Partial<ReturnType<typeof useSearch>['filters']>;
  searchQuery?: string;
} = {}) => {
  mockGetAlgoliaUsers.mockResolvedValue(listUserAlgoliaResponse);
  mockGetProjects.mockResolvedValue(listProjectResponse);
  mockGetWorkingGroups.mockResolvedValue(listWorkingGroupResponse);
  mockGetTags.mockResolvedValue(listTagResponse);
  mockGetUsers.mockResolvedValue(listUserResponse);

  const mockUpdateFilter = jest.fn();
  const mockToggleFilter = jest.fn();
  mockUseSearch.mockImplementation(() => ({
    changeLocation: jest.fn(),
    filters: {
      regions: [],
      tags: [],
      projects: [],
      workingGroups: [],
      ...filters,
    },
    updateFilters: mockUpdateFilter,
    toggleFilter: mockToggleFilter,
    searchQuery,
    debouncedSearchQuery: searchQuery,
    setSearchQuery: jest.fn(),
    tags: [],
    setTags: jest.fn(),
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
jest.setTimeout(30000);

it('renders the filters modal', async () => {
  await renderUserDirectory({ displayFilters: true });
  expect(screen.getByRole('heading', { name: 'Filters' })).toBeVisible();
});

it.each`
  name               | value
  ${'regions'}       | ${'Asia'}
  ${'tags'}          | ${'11'}
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
      tags: [],
      projects: [],
      workingGroups: [],
      [name]: [value],
    });
  },
);
it('triggers export with the same parameters but overrides onlyOnboarded with false', async () => {
  const searchQuery = 'some-user';
  await renderUserDirectory({ isAdministrator: true, searchQuery });
  await waitFor(() =>
    expect(mockGetAlgoliaUsers).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        currentPage: 0,
        pageSize: 10,
        searchQuery,
        tags: [],
        regions: [],
        projects: [],
        workingGroups: [],
      }),
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
          tags: [],
          projects: [],
          workingGroups: [],
          onlyOnboarded: false,
        },
        search: searchQuery,
        skip: 0,
        take: MAX_RESULTS,
      }),
      expect.anything(),
    ),
  );
});
