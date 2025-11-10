import { Suspense } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import type { MutableSnapshot } from 'recoil';
import { RecoilRoot } from 'recoil';
import type { AlgoliaSearchClient } from '@asap-hub/algolia';
import type { ListProjectResponse, ProjectResponse } from '@asap-hub/model';

import type { ProjectListOptions } from '../api';
import { projectsState, useProjectFacets, useProjects } from '../state';

jest.mock('../../hooks/algolia', () => ({
  useAlgolia: jest.fn(),
}));

jest.mock('../api', () => ({
  getProjects: jest.fn(),
  getProjectFacets: jest.fn(),
  getProject: jest.fn(),
  toListProjectResponse: jest.fn(),
}));

const { useAlgolia } = jest.requireMock('../../hooks/algolia') as jest.Mocked<
  typeof import('../../hooks/algolia')
>;
const {
  getProjects: mockGetProjects,
  getProjectFacets: mockGetProjectFacets,
  toListProjectResponse: mockToListProjectResponse,
} = jest.requireMock('../api') as jest.Mocked<typeof import('../api')>;

const mockAlgoliaClient = { search: jest.fn() };

const defaultOptions: ProjectListOptions = {
  projectType: 'Discovery',
  searchQuery: '',
  currentPage: 0,
  pageSize: 10,
  filters: new Set<string>(),
};

const listResponse: ListProjectResponse = {
  total: 1,
  items: [
    {
      id: 'project-1',
      projectType: 'Discovery',
      title: 'Discovery Project',
      status: 'Active',
      tags: [],
      startDate: '2024-01-01',
      endDate: '2024-06-01',
      duration: '5 mos',
    },
  ] as unknown as ProjectResponse[],
  algoliaIndexName: 'projects-index',
  algoliaQueryId: 'query-id',
};

const facetsResponse = {
  researchTheme: { Neuro: 3 },
};

const createWrapper =
  (initializeState?: (snapshot: MutableSnapshot) => void) =>
  ({ children }: { children: React.ReactNode }) => (
    <RecoilRoot initializeState={initializeState}>
      <Suspense fallback="loading">{children}</Suspense>
    </RecoilRoot>
  );

describe('projects state hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAlgolia as jest.Mock).mockReturnValue({
      client: mockAlgoliaClient as unknown as AlgoliaSearchClient<'crn'>,
    });
  });

  describe('useProjects', () => {
    it('fetches projects from Algolia and returns the list response', async () => {
      const algoliaResponse = {} as never;
      mockGetProjects.mockResolvedValueOnce(algoliaResponse);
      mockToListProjectResponse.mockReturnValueOnce(listResponse);

      const { result, waitForNextUpdate } = renderHook(
        () => useProjects(defaultOptions),
        { wrapper: createWrapper() },
      );

      await waitForNextUpdate();

      expect(mockGetProjects).toHaveBeenCalledWith(
        mockAlgoliaClient,
        defaultOptions,
      );
      expect(mockToListProjectResponse).toHaveBeenCalledWith(algoliaResponse);
      expect(result.current).toEqual(listResponse);
    });
  });

  describe('projectsState selector', () => {
    it('aggregates list responses into project atoms', () => {
      const initializeState = ({ set }: MutableSnapshot) => {
        set(projectsState(defaultOptions), listResponse);
      };

      const { result } = renderHook(() => useProjects(defaultOptions), {
        wrapper: createWrapper(initializeState),
      });

      expect(result.current).toEqual(listResponse);
    });
  });

  describe('useProjectFacets', () => {
    it('fetches and caches Algolia facets', async () => {
      mockGetProjectFacets.mockResolvedValueOnce(facetsResponse);

      const facetOptions = {
        projectType: 'Discovery' as const,
        facets: ['researchTheme'] as const,
      };

      const { result, waitForNextUpdate } = renderHook(
        () => useProjectFacets(facetOptions),
        { wrapper: createWrapper() },
      );

      await waitForNextUpdate();

      expect(mockGetProjectFacets).toHaveBeenCalledWith(
        mockAlgoliaClient,
        facetOptions,
      );
      expect(result.current).toEqual(facetsResponse);
    });
  });
});
