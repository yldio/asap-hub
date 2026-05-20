import { MemoryRouter } from 'react-router';
import { ComponentProps, Suspense } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { network } from '@asap-hub/routing';
import { RecoilRoot } from 'recoil';

import { EMPTY_ALGOLIA_RESPONSE } from '@asap-hub/algolia';
import { createCsvFileStream } from '@asap-hub/frontend-utils';
import { FetchListFilter, ResourceProject } from '@asap-hub/model';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import ResourceProjects from '../ResourceProjects';
import { useProjects } from '../state';
import {
  useResearchThemes,
  useResourceTypes,
} from '../../shared-state/shared-research';
import { getProjects } from '../api';

jest.mock('../state');
jest.mock('../../shared-state/shared-research');
jest.mock('@asap-hub/frontend-utils', () => {
  const actual = jest.requireActual('@asap-hub/frontend-utils');
  return {
    ...actual,
    createCsvFileStream: jest
      .fn()
      .mockImplementation(() => ({ write: jest.fn(), end: jest.fn() })),
  };
});
jest.mock('../api', () => {
  const actual = jest.requireActual('../api');
  return {
    ...actual,
    getProjects: jest.fn(),
  };
});

const mockCreateCsvFileStream = createCsvFileStream as jest.MockedFunction<
  typeof createCsvFileStream
>;

const mockGetProjects = getProjects as jest.MockedFunction<typeof getProjects>;

const mockUseProjects = useProjects as jest.MockedFunction<typeof useProjects>;
const mockUseResourceTypes = useResourceTypes as jest.MockedFunction<
  typeof useResourceTypes
>;
const mockUseResearchThemes = useResearchThemes as jest.MockedFunction<
  typeof useResearchThemes
>;

const props: ComponentProps<typeof ResourceProjects> = {
  searchQuery: '',
  debouncedSearchQuery: '',
  onChangeSearchQuery: jest.fn(),
  filters: new Set(),
  filtersMap: {},
  onChangeFilter: jest.fn(),
};

const resourceTypeFilter = 'Dataset';
const themeFilter = 'Neuro';
const statusFilter = 'Active';

const mockResourceProject = {
  id: 'resource-2',
  title: 'Resource Individual Project',
  status: 'Active',
  statusRank: 1,
  projectType: 'Resource Project',
  resourceType: 'Data Portal',
  startDate: '2024-01-01',
  endDate: '2024-12-01',
  duration: '11 mos',
  tags: [],
  isTeamBased: false,
  members: [
    {
      id: 'resource-member-1',
      firstName: 'Pat',
      lastName: 'Scientist',
      displayName: 'Pat Scientist',
    },
  ],
} as ResourceProject;

beforeEach(() => {
  jest.clearAllMocks();
  mockUseProjects.mockReturnValue({
    total: 1,
    items: [
      {
        id: 'resource-1',
        title: 'Resource Project',
        status: 'Active',
        statusRank: 1,
        projectType: 'Resource Project',
        resourceType: 'Database',
        startDate: '2024-01-01',
        endDate: '2024-12-01',
        duration: '11 mos',
        tags: [],
        isTeamBased: true,
        teamName: 'Resource Team',
        teamId: 'team-2',
        googleDriveLink: undefined,
      },
    ],
    algoliaIndexName: 'index',
    algoliaQueryId: 'query',
  });
  mockUseResourceTypes.mockReturnValue([
    { id: 'type-1', name: 'Database' },
    { id: 'type-2', name: 'Data Portal' },
    { id: 'type-3', name: 'Dataset' },
  ]);
  mockUseResearchThemes.mockReturnValue([
    { id: 'theme-1', name: 'Neuro', types: ['Resource'] },
    { id: 'theme-2', name: 'Neurodegeneration', types: ['Resource'] },
    { id: 'theme-3', name: 'Cell Biology', types: ['Resource'] },
  ]);
});

const renderResourceProjects = (
  searchQuery: string = '',
  filtersMap: FetchListFilter = {},
) =>
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter>
              <ResourceProjects
                {...props}
                debouncedSearchQuery={searchQuery}
                filtersMap={filtersMap}
              />
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

it('renders the Resource Projects page', async () => {
  renderResourceProjects();

  expect(
    await screen.findByText(
      /Resource Projects are projects whose primary objective is to generate research tools/i,
    ),
  ).toBeVisible();

  expect(screen.getByText('Resource Team')).toBeVisible();
});

it('renders resource project members as links when the project is not team-based', async () => {
  mockUseProjects.mockReturnValue({
    total: 1,
    items: [mockResourceProject],
    algoliaIndexName: 'index',
    algoliaQueryId: 'query',
  });

  renderResourceProjects();

  const memberLink = await screen.findByRole('link', { name: 'Pat Scientist' });
  expect(memberLink).toHaveAttribute(
    'href',
    network({}).users({}).user({ userId: 'resource-member-1' }).$,
  );
});

it('passes Algolia facet filters when the resource type filter is active', async () => {
  renderResourceProjects('', { resourceType: [resourceTypeFilter] });

  await waitFor(() =>
    expect(mockUseProjects).toHaveBeenLastCalledWith(
      expect.objectContaining({
        facetFilters: { resourceType: ['Dataset'] },
      }),
    ),
  );
});

it('passes Algolia facet filters when the research theme filter is active', async () => {
  renderResourceProjects('', { researchTheme: [themeFilter] });

  await waitFor(() =>
    expect(mockUseProjects).toHaveBeenLastCalledWith(
      expect.objectContaining({
        facetFilters: { researchTheme: ['Neuro'] },
      }),
    ),
  );
});

it('combines resource type and research theme facet filters', async () => {
  renderResourceProjects('', {
    resourceType: [resourceTypeFilter],
    researchTheme: [themeFilter],
  });

  await waitFor(() =>
    expect(mockUseProjects).toHaveBeenLastCalledWith(
      expect.objectContaining({
        facetFilters: {
          resourceType: ['Dataset'],
          researchTheme: ['Neuro'],
        },
      }),
    ),
  );
});

it('renders the RESEARCH THEME filter section with available themes', async () => {
  renderResourceProjects();

  const filterButton = await screen.findByRole('button', { name: /filter/i });
  await userEvent.click(filterButton);

  expect(screen.getByText('RESEARCH THEME')).toBeVisible();
  expect(screen.getByText('Neuro')).toBeVisible();
  expect(screen.getByText('Cell Biology')).toBeVisible();
});

it('triggers export with the expected parameters', async () => {
  mockGetProjects.mockResolvedValue({
    ...EMPTY_ALGOLIA_RESPONSE,
    nbHits: 1,
    hits: [
      {
        ...mockResourceProject,
        __meta: {
          type: 'project',
        },
        objectID: 'resource-project-id',
      },
    ],
  });
  const searchQuery = 'searched project name';
  renderResourceProjects(searchQuery, {
    resourceType: [resourceTypeFilter],
    status: [statusFilter],
  });

  const csvButton = await screen.findByRole('button', { name: /csv/i });
  await userEvent.click(csvButton);

  expect(mockCreateCsvFileStream).toHaveBeenCalledWith(
    expect.stringMatching(/ResourceProjects_\d+\.csv/),
    expect.anything(),
  );
  expect(mockGetProjects).toHaveBeenCalledWith(
    expect.anything(),
    expect.objectContaining({
      searchQuery,
      facetFilters: {
        resourceType: [resourceTypeFilter],
      },
      statusFilters: [statusFilter],
      currentPage: 0,
      pageSize: 10,
      projectType: 'Resource Project',
    }),
  );
});
