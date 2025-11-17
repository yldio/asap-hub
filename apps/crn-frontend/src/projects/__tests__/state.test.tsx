import { Suspense } from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import type { MutableSnapshot } from 'recoil';
import { RecoilRoot, useRecoilState } from 'recoil';
import type { AlgoliaSearchClient } from '@asap-hub/algolia';
import type { ListProjectResponse, ProjectResponse } from '@asap-hub/model';

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

    it('throws when Algolia search fails', async () => {
      const rejection = new Error('Algolia failure');
      mockGetProjects.mockRejectedValueOnce(rejection);

      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const { result, waitForNextUpdate } = renderHook(
        () => useProjects(defaultOptions),
        { wrapper: createWrapper() },
      );

      await waitForNextUpdate();

      expect(result.error).toBe(rejection);

      consoleErrorSpy.mockRestore();
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
      const project = {
        id: 'project-99',
        title: 'Project 99',
        status: 'Active',
        projectType: 'Discovery',
        tags: [],
        startDate: '2024-01-01',
        endDate: '2024-06-01',
        duration: '5 mos',
        researchTheme: '',
        teamName: '',
      } as ProjectResponse;
      const getTokenSilently = jest.fn().mockResolvedValue('token-123');
      mockGetProject.mockResolvedValueOnce(project);

      const initializeState = ({ set }: MutableSnapshot) => {
        set(auth0State, { getTokenSilently } as never);
      };

      const { result, waitForNextUpdate } = renderHook(
        () => useProjectById('project-99'),
        { wrapper: createWrapper(initializeState) },
      );

      await waitForNextUpdate();

      expect(getTokenSilently).toHaveBeenCalled();
      expect(mockGetProject).toHaveBeenCalledWith(
        'project-99',
        'Bearer token-123',
      );
      expect(result.current).toEqual(project);
    });
  });
});
