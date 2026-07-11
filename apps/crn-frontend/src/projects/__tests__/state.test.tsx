import type { AlgoliaSearchClient } from '@asap-hub/algolia';
import { createTestQueryClient } from '@asap-hub/frontend-utils';
import type {
  ListProjectMilestonesResponse,
  ListProjectResponse,
  ProjectDetail,
  ProjectResponse,
} from '@asap-hub/model';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, renderHook, waitFor } from '@testing-library/react';
import { Component, ReactNode, Suspense } from 'react';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import type { MilestonesListOptions, ProjectListOptions } from '../api';
import {
  projectMilestoneQueryKeys,
  projectQueryKeys,
  useCreateProjectMilestone,
  useExportProjectMilestones,
  useInvalidateProjectById,
  useInvalidateProjectMilestonesIndex,
  usePatchProjectById,
  useProjectArticlesSuggestions,
  useProjectById,
  useProjectMilestones,
  useProjects,
} from '../state';

jest.mock('../../hooks/algolia', () => ({
  useAlgolia: jest.fn(),
}));

jest.mock('../../shared-research/api', () => ({
  getResearchOutputs: jest.fn(),
}));

const { getResearchOutputs: mockGetResearchOutputs } = jest.requireMock(
  '../../shared-research/api',
) as jest.Mocked<typeof import('../../shared-research/api')>;

jest.mock('../api', () => ({
  getProjects: jest.fn(),
  getProject: jest.fn(),
  patchProject: jest.fn(),
  toListProjectResponse: jest.fn(),
  getProjectMilestones: jest.fn(),
  getProjectMilestonesExport: jest.fn(),
  createProjectMilestone: jest.fn(),
  waitForMilestonesSync: jest.fn(),
}));

const { useAlgolia } = jest.requireMock('../../hooks/algolia') as jest.Mocked<
  typeof import('../../hooks/algolia')
>;
const {
  getProjects: mockGetProjects,
  getProject: mockGetProject,
  patchProject: mockPatchProject,
  toListProjectResponse: mockToListProjectResponse,
  getProjectMilestones: mockGetProjectMilestones,
  getProjectMilestonesExport: mockGetProjectMilestonesExport,
  createProjectMilestone: mockCreateProjectMilestone,
  waitForMilestonesSync: mockWaitForMilestonesSync,
} = jest.requireMock('../api') as jest.Mocked<typeof import('../api')>;

const mockAlgoliaClient = { search: jest.fn() };
const mockAuthorization = 'Bearer access_token';

const defaultOptions: ProjectListOptions = {
  projectType: 'Discovery Project',
  searchQuery: '',
  currentPage: 0,
  pageSize: 10,
  filters: new Set<string>(),
};

const milestonesOptions: MilestonesListOptions = {
  projectId: 'proj-1',
  grantType: 'supplement',
  searchQuery: '',
  filters: new Set<string>(),
  currentPage: 0,
  pageSize: 10,
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

const milestonesResponse: ListProjectMilestonesResponse = {
  total: 1,
  items: [
    {
      id: 'm1',
      description: 'Milestone 1',
      status: 'In Progress',
      articleCount: 0,
    },
  ],
};

const createWrapper =
  (queryClient: QueryClient) =>
  ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>{children}</WhenReady>
        </Auth0Provider>
      </Suspense>
    </QueryClientProvider>
  );

const renderStateHook = <T,>(hook: () => T, queryClient?: QueryClient) => {
  const client = queryClient ?? createTestQueryClient();
  const utils = renderHook(hook, { wrapper: createWrapper(client) });
  return { ...utils, queryClient: client };
};

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? 'errored' : this.props.children;
  }
}

const renderWithBoundary = (ProbeContent: () => JSX.Element) =>
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <ErrorBoundary>
        <Suspense fallback="loading">
          <Auth0Provider user={{}}>
            <WhenReady>
              <ProbeContent />
            </WhenReady>
          </Auth0Provider>
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider>,
  );

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

    const { result } = renderStateHook(() => useProjects(defaultOptions));

    await waitFor(() => {
      expect(result.current).toEqual(listResponse);
    });

    expect(mockGetProjects).toHaveBeenCalledWith(
      mockAlgoliaClient,
      defaultOptions,
    );
    expect(mockToListProjectResponse).toHaveBeenCalledWith(algoliaResponse);
  });

  it('returns a seeded list without fetching', async () => {
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(
      projectQueryKeys.list(defaultOptions),
      listResponse,
    );

    const { result } = renderStateHook(
      () => useProjects(defaultOptions),
      queryClient,
    );

    await waitFor(() => {
      expect(result.current).toEqual(listResponse);
    });
    expect(mockGetProjects).not.toHaveBeenCalled();
  });

  it('caches an empty list when the fetch rejects with a non-Error', async () => {
    mockGetProjects.mockRejectedValueOnce('not-an-error');

    const { result } = renderStateHook(() => useProjects(defaultOptions));

    await waitFor(() => {
      expect(result.current).toEqual({ total: 0, items: [] });
    });
  });

  it('re-throws Error rejections to the error boundary', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    mockGetProjects.mockRejectedValue(new Error('boom'));

    const Probe = () => {
      useProjects(defaultOptions);
      return <>rendered</>;
    };
    const { getByText } = renderWithBoundary(Probe);

    await waitFor(() => expect(getByText('errored')).toBeInTheDocument());
    consoleErrorSpy.mockRestore();
  });
});

describe('useProjectById', () => {
  it('requests project details with the authorization token', async () => {
    mockGetProject.mockResolvedValueOnce(detailProject);

    const { result } = renderStateHook(() => useProjectById('project-1'));

    await waitFor(() => {
      expect(result.current).toEqual(detailProject);
    });

    expect(mockGetProject).toHaveBeenCalledWith('project-1', mockAuthorization);
  });

  it('returns undefined when the project does not exist', async () => {
    mockGetProject.mockResolvedValueOnce(undefined);

    const { result, queryClient } = renderStateHook(() =>
      useProjectById('missing'),
    );

    await waitFor(() => {
      expect(mockGetProject).toHaveBeenCalled();
    });
    expect(result.current).toBeUndefined();
    // the 404 is cached as null so the queryFn is not re-run
    expect(
      queryClient.getQueryData(projectQueryKeys.detail('missing')),
    ).toBeNull();
  });

  it('fetches complete detail data from the API even when list data is cached', async () => {
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(
      projectQueryKeys.list(defaultOptions),
      listResponse,
    );
    mockGetProject.mockResolvedValueOnce(detailProject);

    const { result } = renderStateHook(
      () => useProjectById('project-1'),
      queryClient,
    );

    await waitFor(() => {
      expect(result.current).toEqual(detailProject);
    });

    // detail data comes from the API, not the incomplete list cache
    expect(mockGetProject).toHaveBeenCalledWith('project-1', mockAuthorization);
    expect(result.current).not.toEqual(listResponse.items[0]);
    // and the list cache is untouched
    expect(
      queryClient.getQueryData(projectQueryKeys.list(defaultOptions)),
    ).toEqual(listResponse);
  });
});

describe('usePatchProjectById', () => {
  it('calls patchProject and writes the response into the detail cache', async () => {
    const patch = { tools: [{ name: 'Slack', url: 'https://slack.com' }] };
    const updatedProject = { ...detailProject, tools: patch.tools };
    mockPatchProject.mockResolvedValueOnce(updatedProject);

    const { result, queryClient } = renderStateHook(() =>
      usePatchProjectById('project-1'),
    );

    await waitFor(() => expect(result.current).toBeTruthy());
    await act(async () => {
      await result.current(patch);
    });

    expect(mockPatchProject).toHaveBeenCalledWith(
      'project-1',
      patch,
      mockAuthorization,
    );
    expect(
      queryClient.getQueryData(projectQueryKeys.detail('project-1')),
    ).toEqual(updatedProject);
  });

  it('uses patch tools when the API returns stale data (read-after-write delay)', async () => {
    const patch = { tools: [{ name: 'Slack', url: 'https://slack.com' }] };
    // API returns project without tools (e.g. stale read after PATCH)
    mockPatchProject.mockResolvedValueOnce({
      ...detailProject,
      tools: undefined,
    } as unknown as ProjectDetail);

    const { result, queryClient } = renderStateHook(() =>
      usePatchProjectById('project-1'),
    );

    await waitFor(() => expect(result.current).toBeTruthy());
    await act(async () => {
      await result.current(patch);
    });

    expect(
      queryClient.getQueryData<ProjectDetail>(
        projectQueryKeys.detail('project-1'),
      )?.tools,
    ).toEqual(patch.tools);
  });
});

describe('useInvalidateProjectById', () => {
  it('invalidates the cached project detail', async () => {
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(
      projectQueryKeys.detail('project-1'),
      detailProject,
    );

    const { result } = renderStateHook(
      () => useInvalidateProjectById('project-1'),
      queryClient,
    );

    await waitFor(() => expect(result.current).toBeTruthy());
    act(() => {
      result.current();
    });

    expect(
      queryClient.getQueryState(projectQueryKeys.detail('project-1'))
        ?.isInvalidated,
    ).toBe(true);
  });
});

describe('useProjectMilestones', () => {
  it('fetches milestones with the options and authorization token', async () => {
    mockGetProjectMilestones.mockResolvedValueOnce(milestonesResponse);

    const { result } = renderStateHook(() =>
      useProjectMilestones(milestonesOptions),
    );

    await waitFor(() => {
      expect(result.current).toEqual(milestonesResponse);
    });

    expect(mockGetProjectMilestones).toHaveBeenCalledWith(
      milestonesOptions,
      mockAuthorization,
    );
  });

  it('deduplicates concurrent fetches for the same options', async () => {
    mockGetProjectMilestones.mockResolvedValue(milestonesResponse);

    // two consumers of the same options in one tree — one fetch
    // (replaces the module-level pendingMilestonePromises map)
    const { result } = renderStateHook(() => ({
      first: useProjectMilestones(milestonesOptions),
      second: useProjectMilestones({
        ...milestonesOptions,
        filters: new Set<string>(),
      }),
    }));

    await waitFor(() => {
      expect(result.current.first).toEqual(milestonesResponse);
      expect(result.current.second).toEqual(milestonesResponse);
    });

    expect(mockGetProjectMilestones).toHaveBeenCalledTimes(1);
  });

  it('caches an empty list when the fetch rejects with a non-Error', async () => {
    mockGetProjectMilestones.mockRejectedValueOnce('not-an-error');

    const { result } = renderStateHook(() =>
      useProjectMilestones(milestonesOptions),
    );

    await waitFor(() => {
      expect(result.current).toEqual({ total: 0, items: [] });
    });
  });

  it('re-throws Error rejections to the error boundary', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    mockGetProjectMilestones.mockRejectedValue(new Error('boom'));

    const Probe = () => {
      useProjectMilestones(milestonesOptions);
      return <>rendered</>;
    };
    const { getByText } = renderWithBoundary(Probe);

    await waitFor(() => expect(getByText('errored')).toBeInTheDocument());
    consoleErrorSpy.mockRestore();
  });
});

describe('useInvalidateProjectMilestonesIndex', () => {
  it('invalidates every cached milestone list', async () => {
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(
      projectMilestoneQueryKeys.list(milestonesOptions),
      milestonesResponse,
    );

    const { result } = renderStateHook(
      () => useInvalidateProjectMilestonesIndex(),
      queryClient,
    );

    await waitFor(() => expect(result.current).toBeTruthy());
    act(() => {
      result.current();
    });

    expect(
      queryClient.getQueryState(
        projectMilestoneQueryKeys.list(milestonesOptions),
      )?.isInvalidated,
    ).toBe(true);
  });
});

describe('useCreateProjectMilestone', () => {
  it('creates the milestone, waits for sync, and invalidates milestone lists', async () => {
    mockCreateProjectMilestone.mockResolvedValueOnce({ id: 'milestone-1' });
    mockWaitForMilestonesSync.mockResolvedValueOnce(true);

    const queryClient = createTestQueryClient();
    queryClient.setQueryData(
      projectMilestoneQueryKeys.list(milestonesOptions),
      milestonesResponse,
    );

    const { result } = renderStateHook(
      () => useCreateProjectMilestone('proj-1'),
      queryClient,
    );

    const data = {
      description: 'Some description',
      status: 'Pending' as const,
      grantType: 'supplement' as const,
      aimIds: ['aim-1'],
    };

    await waitFor(() => expect(result.current).toBeTruthy());
    let createdId: string | undefined;
    await act(async () => {
      createdId = await result.current(data);
    });

    expect(createdId).toBe('milestone-1');
    expect(mockCreateProjectMilestone).toHaveBeenCalledWith(
      'proj-1',
      data,
      mockAuthorization,
    );
    expect(mockWaitForMilestonesSync).toHaveBeenCalledWith(
      'proj-1',
      mockAuthorization,
    );
    expect(
      queryClient.getQueryState(
        projectMilestoneQueryKeys.list(milestonesOptions),
      )?.isInvalidated,
    ).toBe(true);
  });
});

describe('useExportProjectMilestones', () => {
  it('calls getProjectMilestonesExport with the projectId, options and auth token', async () => {
    const payload = { aims: [], milestones: [] };
    mockGetProjectMilestonesExport.mockResolvedValueOnce(payload);

    const { result } = renderStateHook(() =>
      useExportProjectMilestones('project-1'),
    );

    const exportOptions = {
      grantType: 'supplement' as const,
      filter: ['Complete'],
    };
    await waitFor(() => expect(result.current).toBeTruthy());
    await act(async () => {
      await result.current(exportOptions);
    });

    expect(mockGetProjectMilestonesExport).toHaveBeenCalledWith(
      'project-1',
      exportOptions,
      mockAuthorization,
    );
  });
});

describe('useProjectArticlesSuggestions', () => {
  it('searches research outputs and maps hits to suggestion options', async () => {
    mockGetResearchOutputs.mockResolvedValueOnce({
      hits: [
        {
          id: 'ro-1',
          title: 'Article One',
          documentType: 'Article',
          type: 'Preprint',
        },
      ],
    } as never);

    const { result } = renderStateHook(() =>
      useProjectArticlesSuggestions('team-1'),
    );
    await waitFor(() => expect(typeof result.current).toBe('function'));

    const suggestions = await result.current('query');

    expect(mockGetResearchOutputs).toHaveBeenCalledWith(mockAlgoliaClient, {
      searchQuery: 'query',
      currentPage: null,
      pageSize: 5,
      documentType: ['Article'],
      teamId: 'team-1',
    });
    expect(suggestions).toEqual([
      {
        label: 'Article One',
        value: 'ro-1',
        documentType: 'Article',
        type: 'Preprint',
      },
    ]);
  });
});
