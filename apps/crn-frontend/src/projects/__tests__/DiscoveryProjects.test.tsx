import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ComponentProps, Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { createCsvFileStream } from '@asap-hub/frontend-utils';
import { EMPTY_ALGOLIA_RESPONSE } from '@asap-hub/algolia';
import { DiscoveryProject } from '@asap-hub/model';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import DiscoveryProjects from '../DiscoveryProjects';
import { useProjects } from '../state';
import { useResearchThemes } from '../../shared-state/shared-research';
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
const mockUseResearchThemes = useResearchThemes as jest.MockedFunction<
  typeof useResearchThemes
>;

const mockDiscoveryProject = {
  id: 'proj-1',
  title: 'Discovery Project',
  status: 'Active',
  projectType: 'Discovery Project',
  researchTheme: 'Theme',
  startDate: '2024-01-01',
  endDate: '2024-06-01',
  duration: '5 mos',
  tags: [],
  teamName: 'Discovery Team',
  teamId: 'team-1',
} as DiscoveryProject;

const props: ComponentProps<typeof DiscoveryProjects> = {
  searchQuery: '',
  debouncedSearchQuery: '',
  onChangeSearchQuery: jest.fn(),
  filters: new Set(),
  onChangeFilter: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  mockUseProjects.mockReturnValue({
    total: 1,
    items: [mockDiscoveryProject],
    algoliaIndexName: 'index',
    algoliaQueryId: 'query',
  });
  mockUseResearchThemes.mockReturnValue([
    { id: 'theme-1', name: 'Neuro' },
    { id: 'theme-2', name: 'Neurodegeneration' },
    { id: 'theme-3', name: 'Cell Biology' },
  ]);
});

const themeFilter = 'Neuro';
const statusFilter = 'Active';

const renderDiscoveryProjects = async (
  searchQuery: string = '',
  filters?: Set<string>,
) => {
  const result = render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter>
              <DiscoveryProjects
                {...props}
                debouncedSearchQuery={searchQuery}
                filters={filters}
              />
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return result;
};

it('renders the Discovery Projects page', async () => {
  const { container } = await renderDiscoveryProjects();
  expect(
    screen.getByText(
      /Discovery Projects are collaborative research projects whose primary objective/i,
    ),
  ).toBeVisible();
  expect(container.querySelector('section')).toBeInTheDocument();
  expect(screen.getByText('Discovery Team')).toBeVisible();
});

it('passes Algolia facet filters when the discovery theme filter is active', async () => {
  await renderDiscoveryProjects('', new Set([themeFilter]));

  expect(mockUseProjects).toHaveBeenLastCalledWith(
    expect.objectContaining({
      facetFilters: { researchTheme: ['Neuro'] },
    }),
  );
});

it('triggers export with the expected parameters', async () => {
  mockGetProjects.mockResolvedValue({
    ...EMPTY_ALGOLIA_RESPONSE,
    nbHits: 1,
    hits: [
      {
        ...mockDiscoveryProject,
        __meta: {
          type: 'project',
        },
        objectID: 'discovery-project-id',
      },
    ],
  });
  const searchQuery = 'searched project name';
  const { getByText } = await renderDiscoveryProjects(
    searchQuery,
    new Set([themeFilter, statusFilter]),
  );
  await userEvent.click(getByText(/csv/i));
  expect(mockCreateCsvFileStream).toHaveBeenCalledWith(
    expect.stringMatching(/DiscoveryProjects_\d+\.csv/),
    expect.anything(),
  );
  expect(mockGetProjects).toHaveBeenCalledWith(
    expect.anything(),
    expect.objectContaining({
      searchQuery,
      facetFilters: {
        researchTheme: [themeFilter],
      },
      statusFilters: [statusFilter],
      currentPage: 0,
      pageSize: 10,
      projectType: 'Discovery Project',
    }),
  );
});
