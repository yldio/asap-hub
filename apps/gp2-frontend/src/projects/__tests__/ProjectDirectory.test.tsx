import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { PAGE_SIZE } from '../../hooks';
import { useSearch } from '../../hooks/search';
import {
  createProjectAlgoliaRecord,
  createProjectListAlgoliaResponse,
} from '../../__fixtures__/algolia';
import { getProjects } from '../api';
import ProjectDirectory from '../ProjectDirectory';
import { projectsState } from '../state';

jest.mock('../api');
jest.mock('../../hooks/search');

const mockUseSearch = useSearch as jest.MockedFunction<typeof useSearch>;
const mockGetProjects = getProjects as jest.MockedFunction<typeof getProjects>;

const mockToggleFilter = jest.fn();

const renderProjectsList = async (searchQuery = '') => {
  render(
    <RecoilRoot
      initializeState={({ reset }) => {
        reset(
          projectsState({
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
            <MemoryRouter initialEntries={[gp2Routing.projects({}).$]}>
              <Route path={gp2Routing.projects.template}>
                <ProjectDirectory />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};
beforeEach(() => {
  jest.resetAllMocks();
  mockUseSearch.mockImplementation(() => ({
    changeLocation: jest.fn(),
    filters: {},
    updateFilters: jest.fn(),
    toggleFilter: mockToggleFilter,
    searchQuery: '',
    debouncedSearchQuery: '',
    setSearchQuery: jest.fn(),
  }));
});

it('renders the Title', async () => {
  mockGetProjects.mockResolvedValueOnce(createProjectListAlgoliaResponse(1));
  await renderProjectsList();
  expect(
    screen.getByRole('heading', { name: 'Project Title' }),
  ).toBeInTheDocument();
});

it('renders a list of working groups', async () => {
  const firstProject = gp2Fixtures.createProjectResponse({
    id: '42',
    title: 'Project 42',
  });
  const secondProject = gp2Fixtures.createProjectResponse({
    id: '11',
    title: 'Project 11',
  });
  mockGetProjects.mockResolvedValue(
    createProjectListAlgoliaResponse(2, {
      hits: [
        createProjectAlgoliaRecord(
          gp2Fixtures.createProjectResponse(firstProject),
        ),
        createProjectAlgoliaRecord(
          gp2Fixtures.createProjectResponse(secondProject),
        ),
      ],
    }),
  );
  await renderProjectsList();
  expect(
    screen.getByRole('heading', { name: 'Project 42' }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('heading', { name: 'Project 11' }),
  ).toBeInTheDocument();
});

it('handles filter switching', async () => {
  mockGetProjects.mockResolvedValueOnce(createProjectListAlgoliaResponse(1));

  await renderProjectsList();
  userEvent.click(
    screen.getByRole('checkbox', {
      name: 'Opportunities Available',
    }),
  );
  expect(mockToggleFilter).toHaveBeenLastCalledWith(
    'Opportunities Available',
    'type',
  );
  userEvent.click(
    screen.getByRole('checkbox', {
      name: 'Active',
    }),
  );
  expect(mockToggleFilter).toHaveBeenLastCalledWith('Active', 'status');
});
