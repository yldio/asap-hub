import { Suspense } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { MutableSnapshot } from 'recoil';
import { RecoilRoot, useRecoilState } from 'recoil';
import type { AlgoliaSearchClient } from '@asap-hub/algolia';
import type {
  ListProjectResponse,
  ProjectDetail,
  ProjectResponse,
} from '@asap-hub/model';

import type { ProjectListOptions } from '../api';
import { projectsState, useProjectById, useProjects } from '../state';
import { auth0State } from '../../auth/state';

jest.mock('../../hooks/algolia', () => ({
  useAlgolia: jest.fn(),
}));

jest.mock('../api', () => ({
  getProjects: jest.fn(),
  getProject: jest.fn(),
  toListProjectResponse: jest.fn(),
}));

const { useAlgolia } = jest.requireMock('../../hooks/algolia') as jest.Mocked<
  typeof import('../../hooks/algolia')
>;
const {
  getProjects: mockGetProjects,
  getProject: mockGetProject,
  toListProjectResponse: mockToListProjectResponse,
} = jest.requireMock('../api') as jest.Mocked<typeof import('../api')>;

const mockAlgoliaClient = { search: jest.fn() };

const defaultOptions: ProjectListOptions = {
  projectType: 'Discovery Project',
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
      projectType: 'Discovery Project',
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

      const { result } = renderHook(() => useProjects(defaultOptions), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current).toEqual(listResponse);
      });

      expect(mockGetProjects).toHaveBeenCalledWith(
        mockAlgoliaClient,
        defaultOptions,
      );
      expect(mockToListProjectResponse).toHaveBeenCalledWith(algoliaResponse);
    });

    it('throws when Algolia search fails', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});

      const error = new Error('Algolia failure');

      // Pre-populate state with an error to test the throw behavior
      const initializeState = ({ set }: MutableSnapshot) => {
        set(projectsState(defaultOptions), error);
      };

      expect(() =>
        renderHook(() => useProjects(defaultOptions), {
          wrapper: createWrapper(initializeState),
        }),
      ).toThrow(error);
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

  describe('projectsState setter behaviour', () => {
    it('clears cached projects when set to undefined', () => {
      const { result } = renderHook(
        () => useRecoilState(projectsState(defaultOptions)),
        { wrapper: createWrapper() },
      );

      act(() => {
        const [, setProjects] = result.current;
        setProjects(listResponse);
      });

      expect(result.current[0]).toEqual(listResponse);

      act(() => {
        const [, setProjects] = result.current;
        setProjects(undefined);
      });

      expect(result.current[0]).toBeUndefined();
    });

    it('stores errors when provided', () => {
      const { result } = renderHook(
        () => useRecoilState(projectsState(defaultOptions)),
        { wrapper: createWrapper() },
      );

      const error = new Error('boom');

      act(() => {
        const [, setProjects] = result.current;
        setProjects(error);
      });

      expect(result.current[0]).toBe(error);
    });
  });

  describe('useProjectById', () => {
    it('requests project details with authorization token', async () => {
      const project: ProjectDetail = {
        id: 'project-99',
        title: 'Project 99',
        status: 'Active',
        projectType: 'Discovery Project',
        tags: [],
        startDate: '2024-01-01',
        endDate: '2024-06-01',
        duration: '5 mos',
        researchTheme: '',
        teamName: '',
        fundedTeam: {
          id: 'team-1',
          displayName: 'Test Team',
          teamType: 'Discovery Team',
          researchTheme: '',
        },
      };
      const getTokenSilently = jest.fn().mockResolvedValue('token-123');
      mockGetProject.mockResolvedValueOnce(project);

      const initializeState = ({ set }: MutableSnapshot) => {
        set(auth0State, { getTokenSilently } as never);
      };

      const { result } = renderHook(() => useProjectById('project-99'), {
        wrapper: createWrapper(initializeState),
      });

      await waitFor(() => {
        expect(result.current).toEqual(project);
      });

      expect(getTokenSilently).toHaveBeenCalled();
      expect(mockGetProject).toHaveBeenCalledWith(
        'project-99',
        'Bearer token-123',
      );
    });

    it('fetches complete detail data from API even when incomplete list data exists', async () => {
      // Incomplete list data (missing fields like originalGrant, milestones)
      const incompleteListProject = {
        id: 'project-1',
        projectType: 'Discovery Project',
        title: 'Discovery Project',
        status: 'Active',
        tags: [],
        startDate: '2024-01-01',
        endDate: '2024-06-01',
        duration: '5 mos',
        researchTheme: '',
        teamName: '',
      } as ProjectResponse;

      // Complete detail data (includes all fields)
      const completeDetailProject: ProjectDetail = {
        id: 'project-1',
        projectType: 'Discovery Project',
        title: 'Discovery Project',
        status: 'Active',
        tags: [],
        startDate: '2024-01-01',
        endDate: '2024-06-01',
        duration: '5 mos',
        originalGrant: 'Grant-123',
        milestones: [
          {
            id: 'milestone-1',
            title: 'Milestone 1',
            description: '',
            status: 'Not Started',
          },
        ],
        researchTheme: 'Theme 1',
        teamName: 'Team 1',
        fundedTeam: {
          id: 'team-1',
          displayName: 'Team 1',
          teamType: 'Discovery Team',
          researchTheme: 'Theme 1',
        },
      };

      const getTokenSilently = jest.fn().mockResolvedValue('token-123');
      mockGetProject.mockResolvedValueOnce(completeDetailProject);

      const initializeState = ({ set }: MutableSnapshot) => {
        set(auth0State, { getTokenSilently } as never);
        // Pre-populate list cache with incomplete data
        set(projectsState(defaultOptions), {
          total: 1,
          items: [incompleteListProject],
          algoliaIndexName: 'projects-index',
          algoliaQueryId: 'query-id',
        });
      };

      const { result } = renderHook(() => useProjectById('project-1'), {
        wrapper: createWrapper(initializeState),
      });

      await waitFor(() => {
        expect(result.current).toEqual(completeDetailProject);
      });

      // Should fetch from API, not use incomplete list data
      expect(mockGetProject).toHaveBeenCalledWith(
        'project-1',
        'Bearer token-123',
      );
      // Should return complete data, not incomplete list data
      expect(result.current).not.toEqual(incompleteListProject);
    });

    it('maintains separate caches for list and detail data', async () => {
      const listProject = {
        id: 'project-1',
        title: 'List Project',
        status: 'Active',
        projectType: 'Discovery Project',
        tags: [],
        startDate: '2024-01-01',
        endDate: '2024-06-01',
        duration: '5 mos',
        researchTheme: '',
        teamName: '',
      } as ProjectResponse;

      const detailProject: ProjectDetail = {
        id: 'project-1',
        title: 'Detail Project',
        status: 'Active',
        projectType: 'Discovery Project',
        tags: [],
        startDate: '2024-01-01',
        endDate: '2024-06-01',
        duration: '5 mos',
        originalGrant: 'Grant-123',
        researchTheme: 'Theme 1',
        teamName: 'Team 1',
        fundedTeam: {
          id: 'team-1',
          displayName: 'Team 1',
          teamType: 'Discovery Team',
          researchTheme: 'Theme 1',
        },
      };

      const getTokenSilently = jest.fn().mockResolvedValue('token-123');
      mockGetProject.mockResolvedValueOnce(detailProject);

      const initializeState = ({ set }: MutableSnapshot) => {
        set(auth0State, { getTokenSilently } as never);
        // Set list cache
        set(projectsState(defaultOptions), {
          total: 1,
          items: [listProject],
          algoliaIndexName: 'projects-index',
          algoliaQueryId: 'query-id',
        });
      };

      // Fetch list data
      const { result: listResult } = renderHook(
        () => useProjects(defaultOptions),
        { wrapper: createWrapper(initializeState) },
      );

      // Fetch detail data
      const { result: detailResult } = renderHook(
        () => useProjectById('project-1'),
        { wrapper: createWrapper(initializeState) },
      );

      await waitFor(() => {
        expect(detailResult.current).toEqual(detailProject);
      });

      // List cache should have list data
      expect(listResult.current?.items[0]).toEqual(listProject);
      // Detail cache should have detail data (fetched from API)
      // They should be different (separate caches)
      expect(listResult.current?.items[0]).not.toEqual(detailResult.current);
    });

    it('preserves detail cache when list cache is cleared', async () => {
      const detailProject: ProjectDetail = {
        id: 'project-1',
        title: 'Detail Project',
        status: 'Active',
        projectType: 'Discovery Project',
        tags: [],
        startDate: '2024-01-01',
        endDate: '2024-06-01',
        duration: '5 mos',
        originalGrant: 'Grant-123',
        researchTheme: 'Theme 1',
        teamName: 'Team 1',
        fundedTeam: {
          id: 'team-1',
          displayName: 'Team 1',
          teamType: 'Discovery Team',
          researchTheme: 'Theme 1',
        },
      };

      const getTokenSilently = jest.fn().mockResolvedValue('token-123');
      mockGetProject.mockResolvedValueOnce(detailProject);

      const listProject = {
        id: 'project-1',
        title: 'List Project',
        status: 'Active',
        projectType: 'Discovery Project',
        tags: [],
        startDate: '2024-01-01',
        endDate: '2024-06-01',
        duration: '5 mos',
        researchTheme: '',
        teamName: '',
      } as ProjectResponse;

      const initializeState = ({ set }: MutableSnapshot) => {
        set(auth0State, { getTokenSilently } as never);
        // Set list cache
        set(projectsState(defaultOptions), {
          total: 1,
          items: [listProject],
          algoliaIndexName: 'projects-index',
          algoliaQueryId: 'query-id',
        });
      };

      // Fetch detail data first
      const { result: detailResult } = renderHook(
        () => useProjectById('project-1'),
        { wrapper: createWrapper(initializeState) },
      );

      await waitFor(() => {
        expect(detailResult.current).toEqual(detailProject);
      });

      // Clear list cache
      const { result: listResult } = renderHook(
        () => useRecoilState(projectsState(defaultOptions)),
        { wrapper: createWrapper(initializeState) },
      );

      act(() => {
        const [, setProjects] = listResult.current;
        setProjects(undefined);
      });

      expect(listResult.current[0]).toBeUndefined();

      // Detail cache should still be intact - verify by checking the detail hook again
      // The detail hook should still return the cached value without a new API call
      expect(detailResult.current).toEqual(detailProject);
      // getProject should only be called once (the initial fetch, not after clearing list)
      expect(mockGetProject).toHaveBeenCalledTimes(1);
    });
  });
});
