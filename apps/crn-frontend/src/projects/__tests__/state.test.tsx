import { Suspense } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { MutableSnapshot } from 'recoil';
import { RecoilRoot, useRecoilState } from 'recoil';
import type { AlgoliaSearchClient } from '@asap-hub/algolia';
import type {
  ListProjectResponse,
  MilestoneCreateRequest,
  ProjectDetail,
  ProjectResponse,
} from '@asap-hub/model';

import type { ProjectListOptions } from '../api';
import {
  projectsState,
  useProjectById,
  useProjects,
  usePatchProjectById,
  useCreateMilestone,
} from '../state';
import { auth0State } from '../../auth/state';

jest.mock('../../hooks/algolia', () => ({
  useAlgolia: jest.fn(),
}));

jest.mock('../api', () => ({
  getProjects: jest.fn(),
  getProject: jest.fn(),
  patchProject: jest.fn(),
  createMilestone: jest.fn(),
  toListProjectResponse: jest.fn(),
}));

const { useAlgolia } = jest.requireMock('../../hooks/algolia') as jest.Mocked<
  typeof import('../../hooks/algolia')
>;
const {
  getProjects: mockGetProjects,
  getProject: mockGetProject,
  patchProject: mockPatchProject,
  createMilestone: mockCreateMilestone,
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
        statusRank: 1,
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
        statusRank: 1,
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
        statusRank: 1,
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
        statusRank: 1,
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
        statusRank: 1,
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
        statusRank: 1,
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
        statusRank: 1,
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

  describe('usePatchProjectById', () => {
    it('calls patchProject with the correct arguments and updates the project state', async () => {
      const initialProject: ProjectDetail = {
        id: 'project-1',
        title: 'Original Project',
        status: 'Active',
        statusRank: 1,
        projectType: 'Discovery Project',
        tags: [],
        startDate: '2024-01-01',
        endDate: '2024-06-01',
        duration: '5 mos',
        researchTheme: '',
        teamName: '',
        fundedTeam: {
          id: 'team-1',
          displayName: 'Team 1',
          teamType: 'Discovery Team',
          researchTheme: '',
        },
      };

      const updatedProject: ProjectDetail = {
        ...initialProject,
        tools: [{ name: 'Slack', url: 'https://slack.com' }],
      };

      const patch = { tools: [{ name: 'Slack', url: 'https://slack.com' }] };
      const getTokenSilently = jest.fn().mockResolvedValue('token-abc');
      mockPatchProject.mockResolvedValueOnce(updatedProject);

      // Pre-populate project state so the hook doesn't suspend
      const initializeState = ({ set }: MutableSnapshot) => {
        set(auth0State, { getTokenSilently } as never);
        set(projectsState(defaultOptions), {
          total: 1,
          items: [initialProject as unknown as ProjectResponse],
        });
      };

      const { result } = renderHook(
        () => ({
          patchFn: usePatchProjectById('project-1'),
          project: useProjectById('project-1'),
        }),
        { wrapper: createWrapper(initializeState) },
      );

      // Wait for the hook to settle (useProjectById fetches via API)
      mockGetProject.mockResolvedValueOnce(initialProject);
      await waitFor(() =>
        expect(result.current.project).toEqual(initialProject),
      );

      await act(async () => {
        await result.current.patchFn(patch);
      });

      expect(mockPatchProject).toHaveBeenCalledWith(
        'project-1',
        patch,
        'Bearer token-abc',
      );

      await waitFor(() => {
        expect(result.current.project).toEqual(updatedProject);
      });
    });

    it('uses patch tools when API returns fewer tools (read-after-write delay)', async () => {
      const initialProject: ProjectDetail = {
        id: 'project-1',
        title: 'Original Project',
        status: 'Active',
        statusRank: 1,
        projectType: 'Discovery Project',
        tags: [],
        startDate: '2024-01-01',
        endDate: '2024-06-01',
        duration: '5 mos',
        researchTheme: '',
        teamName: '',
        fundedTeam: {
          id: 'team-1',
          displayName: 'Team 1',
          teamType: 'Discovery Team',
          researchTheme: '',
        },
      };

      const patch = {
        tools: [{ name: 'Slack', url: 'https://slack.com' }],
      };
      // API returns project without tools (e.g. stale read after PATCH)
      const apiResponse = { ...initialProject, tools: undefined };

      const getTokenSilently = jest.fn().mockResolvedValue('token-abc');
      mockPatchProject.mockResolvedValueOnce(apiResponse);

      const initializeState = ({ set }: MutableSnapshot) => {
        set(auth0State, { getTokenSilently } as never);
        set(projectsState(defaultOptions), {
          total: 1,
          items: [initialProject as unknown as ProjectResponse],
        });
      };

      const { result } = renderHook(
        () => ({
          patchFn: usePatchProjectById('project-1'),
          project: useProjectById('project-1'),
        }),
        { wrapper: createWrapper(initializeState) },
      );

      mockGetProject.mockResolvedValueOnce(initialProject);
      await waitFor(() =>
        expect(result.current.project).toEqual(initialProject),
      );

      await act(async () => {
        await result.current.patchFn(patch);
      });

      await waitFor(() => {
        expect(result.current.project?.tools).toEqual(patch.tools);
      });
    });
  });

  describe('useCreateMilestone', () => {
    const baseProject: ProjectDetail = {
      id: 'project-1',
      title: 'Test Project',
      status: 'Active',
      statusRank: 1,
      projectType: 'Discovery Project',
      tags: [],
      startDate: '2024-01-01',
      endDate: '2024-06-01',
      duration: '5 mos',
      researchTheme: 'Theme 1',
      teamName: 'Team 1',
      fundedTeam: {
        id: 'team-1',
        displayName: 'Team 1',
        teamType: 'Discovery Team',
        researchTheme: 'Theme 1',
      },
      originalGrantAims: [
        {
          id: 'aim-1',
          order: 1,
          description: 'Aim One',
          status: 'In Progress',
          articleCount: 0,
        },
        {
          id: 'aim-2',
          order: 2,
          description: 'Aim Two',
          status: 'Pending',
          articleCount: 0,
        },
      ],
      milestones: [
        { id: 'ms-existing', description: 'Existing', status: 'Complete' },
      ],
    };

    const milestoneRequest: MilestoneCreateRequest = {
      grantType: 'original',
      description: 'New milestone',
      status: 'In Progress',
      aimIds: ['aim-1', 'aim-2'],
    };

    it('calls createMilestone API with correct arguments', async () => {
      const getTokenSilently = jest.fn().mockResolvedValue('token-abc');
      mockGetProject.mockResolvedValueOnce(baseProject);
      mockCreateMilestone.mockResolvedValueOnce({ id: 'ms-new' });

      const initializeState = ({ set }: MutableSnapshot) => {
        set(auth0State, { getTokenSilently } as never);
      };

      const { result } = renderHook(
        () => ({
          createFn: useCreateMilestone('project-1'),
          project: useProjectById('project-1'),
        }),
        { wrapper: createWrapper(initializeState) },
      );

      await waitFor(() => expect(result.current.project).toEqual(baseProject));

      await act(async () => {
        await result.current.createFn(milestoneRequest);
      });

      expect(mockCreateMilestone).toHaveBeenCalledWith(
        'project-1',
        milestoneRequest,
        'Bearer token-abc',
      );
    });

    it('optimistically adds the new milestone to the project state', async () => {
      const getTokenSilently = jest.fn().mockResolvedValue('token-abc');
      mockGetProject.mockResolvedValueOnce(baseProject);
      mockCreateMilestone.mockResolvedValueOnce({ id: 'ms-new' });

      const initializeState = ({ set }: MutableSnapshot) => {
        set(auth0State, { getTokenSilently } as never);
      };

      const { result } = renderHook(
        () => ({
          createFn: useCreateMilestone('project-1'),
          project: useProjectById('project-1'),
        }),
        { wrapper: createWrapper(initializeState) },
      );

      await waitFor(() => expect(result.current.project).toEqual(baseProject));

      await act(async () => {
        await result.current.createFn(milestoneRequest);
      });

      await waitFor(() => {
        const milestones = result.current.project?.milestones;
        expect(milestones).toHaveLength(2);
        expect(milestones![1]).toEqual({
          id: 'ms-new',
          description: 'New milestone',
          status: 'In Progress',
          aims: '1,2',
        });
      });
    });

    it('resolves aim IDs to sorted order numbers from project aims', async () => {
      const projectWithSupplementAims: ProjectDetail = {
        ...baseProject,
        supplementGrant: {
          grantTitle: 'Supplement',
          aims: [
            {
              id: 'supp-aim-3',
              order: 3,
              description: 'Supp Aim 3',
              status: 'Pending',
              articleCount: 0,
            },
            {
              id: 'supp-aim-5',
              order: 5,
              description: 'Supp Aim 5',
              status: 'Pending',
              articleCount: 0,
            },
          ],
        },
      };

      const requestWithMixedAims: MilestoneCreateRequest = {
        grantType: 'supplement',
        description: 'Mixed aims milestone',
        status: 'Pending',
        aimIds: ['supp-aim-5', 'aim-1', 'supp-aim-3'],
      };

      const getTokenSilently = jest.fn().mockResolvedValue('token-abc');
      mockGetProject.mockResolvedValueOnce(projectWithSupplementAims);
      mockCreateMilestone.mockResolvedValueOnce({ id: 'ms-mixed' });

      const initializeState = ({ set }: MutableSnapshot) => {
        set(auth0State, { getTokenSilently } as never);
      };

      const { result } = renderHook(
        () => ({
          createFn: useCreateMilestone('project-1'),
          project: useProjectById('project-1'),
        }),
        { wrapper: createWrapper(initializeState) },
      );

      await waitFor(() =>
        expect(result.current.project).toEqual(projectWithSupplementAims),
      );

      await act(async () => {
        await result.current.createFn(requestWithMixedAims);
      });

      await waitFor(() => {
        const milestones = result.current.project?.milestones;
        const newMilestone = milestones?.find((m) => m.id === 'ms-mixed');
        // aim-1 -> order 1, supp-aim-3 -> order 3, supp-aim-5 -> order 5, sorted
        expect(newMilestone?.aims).toBe('1,3,5');
      });
    });
  });
});
