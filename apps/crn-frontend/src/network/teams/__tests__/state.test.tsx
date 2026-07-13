import { BackendError, createTestQueryClient } from '@asap-hub/frontend-utils';
import {
  ManuscriptResponse,
  TeamResponse,
  TeamStatus,
  TeamType,
} from '@asap-hub/model';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, renderHook, waitFor } from '@testing-library/react';
import { Component, ReactNode, Suspense } from 'react';

import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { researchOutputQueryKeys } from '../../../shared-research/state';
import {
  createDiscussion,
  createPreprintResearchOutput,
  getAlgoliaTeams,
  GetTeamsListOptions,
  getManuscript,
  getManuscripts,
  getManuscriptsByIds,
  getTeam,
  markDiscussionAsRead,
  updateDiscussion,
  uploadManuscriptFileViaPresignedUrl,
} from '../api';
import {
  discussionQueryKeys,
  manuscriptQueryKeys,
  teamQueryKeys,
  useBatchManuscriptsByIds,
  useCreateDiscussion,
  useManuscriptById,
  useManuscripts,
  useMarkDiscussionAsRead,
  usePostPreprintResearchOutput,
  useReplyToDiscussion,
  useTeamById,
  useTeams,
  useUploadManuscriptFileViaPresignedUrl,
} from '../state';

jest.mock('../api', () => ({
  createDiscussion: jest.fn(),
  createPreprintResearchOutput: jest.fn(),
  getAlgoliaTeams: jest.fn(),
  getManuscript: jest.fn(),
  getManuscripts: jest.fn(),
  getManuscriptsByIds: jest.fn(),
  getTeam: jest.fn().mockResolvedValue(undefined),
  markDiscussionAsRead: jest.fn(),
  updateDiscussion: jest.fn(),
  uploadManuscriptFileViaPresignedUrl: jest.fn(),
}));

jest.mock('../../../hooks/algolia', () => ({
  useAlgolia: jest.fn(() => ({ client: {} })),
}));

const mockAuthorization = 'Bearer access_token';

const createWrapper =
  (queryClient: QueryClient) =>
  ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback="loading">
        <Auth0Provider user={{ id: 'user-id' }}>
          <WhenReady>{children}</WhenReady>
        </Auth0Provider>
      </Suspense>
    </QueryClientProvider>
  );

const renderStateHook = <T,>(hook: () => T) => {
  const queryClient = createTestQueryClient();
  const utils = renderHook(hook, { wrapper: createWrapper(queryClient) });
  return { ...utils, queryClient };
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

const teamId = 'team-id-0';
const teamMock = {
  id: teamId,
  teamType: 'Discovery Team' as TeamType,
  teamStatus: 'Active' as TeamStatus,
  tags: [{ id: 'tag-1', name: 'Research' }],
  members: [],
  lastModifiedDate: '2021-09-01T00:00:00Z',
  labCount: 1,
  displayName: 'Team One',
  projectTitle: 'Project Title',
  labs: [],
  manuscripts: [],
} as unknown as TeamResponse;

const discussionId = 'discussion-id-0';
const manuscriptId = 'manuscript-id-0';

const mockDiscussion = {
  id: discussionId,
  title: 'Updated Discussion',
  status: 'Addendum Required',
};

const mockUpdatedManuscript = {
  id: manuscriptId,
  status: 'Addendum Required',
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('useTeamById', () => {
  it('fetches the team with the authorization token', async () => {
    (getTeam as jest.Mock).mockResolvedValue(teamMock);

    const { result } = renderStateHook(() => useTeamById(teamId));

    await waitFor(() => expect(result.current).toEqual(teamMock));
    expect(getTeam).toHaveBeenCalledWith(teamId, mockAuthorization);
    expect(result.current?.displayName).toBe('Team One');
    expect(result.current?.tags.length).toBe(1);
  });

  it('returns undefined when the team does not exist', async () => {
    (getTeam as jest.Mock).mockResolvedValue(undefined);

    const { result, queryClient } = renderStateHook(() =>
      useTeamById('nonexistent-team'),
    );

    await waitFor(() => expect(getTeam).toHaveBeenCalled());
    // the 404 is cached as null and mapped back to undefined
    await waitFor(() =>
      expect(
        queryClient.getQueryData(teamQueryKeys.detail('nonexistent-team')),
      ).toBeNull(),
    );
    expect(result.current).toBeUndefined();
  });

  it('reads a seeded cache without fetching', async () => {
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(teamQueryKeys.detail(teamId), teamMock);

    const { result } = renderHook(() => useTeamById(teamId), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => expect(result.current).toEqual(teamMock));
    expect(getTeam).not.toHaveBeenCalled();
  });
});

describe('useManuscriptById', () => {
  const manuscriptMock = {
    id: manuscriptId,
    title: 'The Manuscript',
    status: 'Waiting for Report',
    versions: [],
    discussions: [],
  } as unknown as ManuscriptResponse;

  it('fetches the manuscript and returns a working setter', async () => {
    (getManuscript as jest.Mock).mockResolvedValue(manuscriptMock);

    const { result } = renderStateHook(() => useManuscriptById(manuscriptId));

    await waitFor(() => expect(result.current?.[0]).toEqual(manuscriptMock));
    expect(getManuscript).toHaveBeenCalledWith(manuscriptId, mockAuthorization);

    const updated = { ...manuscriptMock, title: 'Renamed' };
    act(() => {
      result.current[1](updated);
    });
    await waitFor(() => expect(result.current[0]).toEqual(updated));
  });

  it('supports functional updates like React state setters', async () => {
    (getManuscript as jest.Mock).mockResolvedValue(manuscriptMock);

    const { result } = renderStateHook(() => useManuscriptById(manuscriptId));

    await waitFor(() => expect(result.current?.[0]).toEqual(manuscriptMock));

    act(() => {
      result.current[1](
        (manuscript) =>
          manuscript && { ...manuscript, status: 'Addendum Required' },
      );
    });
    await waitFor(() =>
      expect(result.current[0]?.status).toBe('Addendum Required'),
    );
  });
});

describe('useReplyToDiscussion', () => {
  const patch = { text: 'Reply message', manuscriptId };

  it('calls updateDiscussion API with the correct parameters', async () => {
    (updateDiscussion as jest.Mock).mockResolvedValue(mockDiscussion);
    (getManuscript as jest.Mock).mockResolvedValue(mockUpdatedManuscript);

    const { result } = renderStateHook(() => useReplyToDiscussion());
    await waitFor(() => expect(result.current).toBeTruthy());

    await act(async () => {
      await result.current(manuscriptId, discussionId, patch);
    });

    expect(updateDiscussion).toHaveBeenCalledWith(
      discussionId,
      {
        ...patch,
        notificationList: undefined,
      },
      mockAuthorization,
    );
  });

  it('writes the discussion and the re-fetched manuscript into the caches', async () => {
    (updateDiscussion as jest.Mock).mockResolvedValue(mockDiscussion);
    (getManuscript as jest.Mock).mockResolvedValue(mockUpdatedManuscript);

    const { result, queryClient } = renderStateHook(() =>
      useReplyToDiscussion(),
    );
    await waitFor(() => expect(result.current).toBeTruthy());

    await act(async () => {
      await result.current(manuscriptId, discussionId, patch);
    });

    expect(
      queryClient.getQueryData(discussionQueryKeys.detail(discussionId)),
    ).toEqual(mockDiscussion);
    expect(
      queryClient.getQueryData(manuscriptQueryKeys.detail(manuscriptId)),
    ).toEqual(mockUpdatedManuscript);
  });

  it('handles 403 error and refetches manuscript', async () => {
    const mockResponse = {
      status: 403,
      statusText: 'Forbidden',
    };

    const errorMessage = `Failed to update discussion with id ${discussionId}. Expected status 200. Received status ${`${mockResponse.status} ${mockResponse.statusText}`.trim()}.`;
    const mock403Error = new BackendError(
      errorMessage,
      {
        error: 'Forbidden',
        message: errorMessage,
        statusCode: 403,
      },
      403,
    );

    (updateDiscussion as jest.Mock).mockRejectedValueOnce(mock403Error);
    (getManuscript as jest.Mock).mockResolvedValueOnce(mockUpdatedManuscript);

    const { result, queryClient } = renderStateHook(() =>
      useReplyToDiscussion(),
    );
    await waitFor(() => expect(result.current).toBeTruthy());

    await act(async () => {
      await expect(
        result.current(manuscriptId, discussionId, {
          text: 'Reply after 403',
          manuscriptId,
        }),
      ).rejects.toThrow(errorMessage);
    });

    expect(getManuscript).toHaveBeenCalledWith(manuscriptId, mockAuthorization);
    expect(
      queryClient.getQueryData(manuscriptQueryKeys.detail(manuscriptId)),
    ).toEqual(mockUpdatedManuscript);
  });

  it('re-throws other API errors without refetching the manuscript', async () => {
    const mockError = new Error('API error');
    (updateDiscussion as jest.Mock).mockRejectedValue(mockError);

    const { result, queryClient } = renderStateHook(() =>
      useReplyToDiscussion(),
    );
    await waitFor(() => expect(result.current).toBeTruthy());

    await act(async () => {
      await expect(
        result.current(manuscriptId, discussionId, patch),
      ).rejects.toThrow('API error');
    });

    expect(getManuscript).not.toHaveBeenCalled();
    expect(
      queryClient.getQueryData(manuscriptQueryKeys.detail(manuscriptId)),
    ).toBeUndefined();
  });
});

describe('useCreateDiscussion', () => {
  it('creates a discussion and writes the re-fetched manuscript into the cache', async () => {
    (createDiscussion as jest.Mock).mockResolvedValue(mockDiscussion);
    (getManuscript as jest.Mock).mockResolvedValue(mockUpdatedManuscript);

    const { result, queryClient } = renderStateHook(() =>
      useCreateDiscussion(),
    );
    await waitFor(() => expect(result.current).toBeTruthy());

    let createdId: string | undefined;
    await act(async () => {
      createdId = await result.current(manuscriptId, 'title', 'content');
    });

    expect(createdId).toBe(discussionId);
    expect(createDiscussion).toHaveBeenCalledWith(
      {
        manuscriptId,
        title: 'title',
        text: 'content',
        files: undefined,
        notificationList: undefined,
      },
      mockAuthorization,
    );
    expect(
      queryClient.getQueryData(manuscriptQueryKeys.detail(manuscriptId)),
    ).toEqual(mockUpdatedManuscript);
  });

  it('handles 403 error and refetches manuscript', async () => {
    const mockResponse = {
      status: 403,
      statusText: 'Forbidden',
    };

    const errorMessage = `Failed to update discussion with id ${discussionId}. Expected status 200. Received status ${`${mockResponse.status} ${mockResponse.statusText}`.trim()}.`;
    const mock403Error = new BackendError(
      errorMessage,
      {
        error: 'Forbidden',
        message: errorMessage,
        statusCode: 403,
      },
      403,
    );

    (createDiscussion as jest.Mock).mockRejectedValueOnce(mock403Error);
    (getManuscript as jest.Mock).mockResolvedValueOnce(mockUpdatedManuscript);

    const { result } = renderStateHook(() => useCreateDiscussion());
    await waitFor(() => expect(result.current).toBeTruthy());

    await act(async () => {
      await expect(
        result.current(manuscriptId, 'title', 'content'),
      ).rejects.toThrow(errorMessage);
    });

    expect(getManuscript).toHaveBeenCalledWith(manuscriptId, mockAuthorization);
  });
});

describe('useMarkDiscussionAsRead', () => {
  const cachedManuscript = {
    id: manuscriptId,
    title: 'The Manuscript',
    discussions: [
      { id: discussionId, read: false },
      { id: 'discussion-id-1', read: false },
    ],
  } as unknown as ManuscriptResponse;

  it('optimistically marks the discussion as read in the cached manuscript', async () => {
    (markDiscussionAsRead as jest.Mock).mockResolvedValue(mockDiscussion);

    const queryClient = createTestQueryClient();
    queryClient.setQueryData(
      manuscriptQueryKeys.detail(manuscriptId),
      cachedManuscript,
    );

    const { result } = renderHook(() => useMarkDiscussionAsRead(), {
      wrapper: createWrapper(queryClient),
    });
    await waitFor(() => expect(result.current).toBeTruthy());

    await act(async () => {
      await result.current(manuscriptId, discussionId);
    });

    expect(markDiscussionAsRead).toHaveBeenCalledWith(
      discussionId,
      mockAuthorization,
    );
    expect(
      queryClient.getQueryData<ManuscriptResponse>(
        manuscriptQueryKeys.detail(manuscriptId),
      )?.discussions,
    ).toEqual([
      { id: discussionId, read: true },
      { id: 'discussion-id-1', read: false },
    ]);
    expect(
      queryClient.getQueryData(discussionQueryKeys.detail(discussionId)),
    ).toEqual(mockDiscussion);
  });

  it('still calls the API when no manuscript is cached', async () => {
    (markDiscussionAsRead as jest.Mock).mockResolvedValue(mockDiscussion);

    const { result, queryClient } = renderStateHook(() =>
      useMarkDiscussionAsRead(),
    );
    await waitFor(() => expect(result.current).toBeTruthy());

    await act(async () => {
      await result.current(manuscriptId, discussionId);
    });

    expect(markDiscussionAsRead).toHaveBeenCalledWith(
      discussionId,
      mockAuthorization,
    );
    expect(
      queryClient.getQueryData(manuscriptQueryKeys.detail(manuscriptId)),
    ).toBeUndefined();
  });
});

describe('useBatchManuscriptsByIds', () => {
  it('seeds the empty-ids result without fetching, so the query is never pending', async () => {
    const { queryClient } = renderStateHook(() => useBatchManuscriptsByIds([]));

    await waitFor(() =>
      expect(queryClient.getQueryData(manuscriptQueryKeys.batch([]))).toBe(0),
    );
    expect(getManuscriptsByIds).not.toHaveBeenCalled();
    expect(
      queryClient.getQueryState(manuscriptQueryKeys.batch([]))?.fetchStatus,
    ).toBe('idle');
  });

  it('skips the API even when the empty-ids query is explicitly refetched', async () => {
    const { queryClient } = renderStateHook(() => useBatchManuscriptsByIds([]));
    await waitFor(() =>
      expect(queryClient.getQueryData(manuscriptQueryKeys.batch([]))).toBe(0),
    );

    await act(() =>
      queryClient.refetchQueries({ queryKey: manuscriptQueryKeys.batch([]) }),
    );

    expect(getManuscriptsByIds).not.toHaveBeenCalled();
    expect(queryClient.getQueryData(manuscriptQueryKeys.batch([]))).toBe(0);
  });

  it('deduplicates, sorts and hydrates the manuscript detail caches', async () => {
    const manuscript1 = { id: 'm-1', title: 'One' };
    const manuscript2 = { id: 'm-2', title: 'Two' };
    (getManuscriptsByIds as jest.Mock).mockResolvedValue([
      manuscript1,
      manuscript2,
    ]);

    const { queryClient } = renderStateHook(() =>
      useBatchManuscriptsByIds(['m-2', 'm-1', '', 'm-1']),
    );

    await waitFor(() => {
      expect(getManuscriptsByIds).toHaveBeenCalledTimes(1);
    });
    expect(getManuscriptsByIds).toHaveBeenCalledWith(
      ['m-1', 'm-2'],
      mockAuthorization,
    );

    await waitFor(() => {
      expect(
        queryClient.getQueryData(manuscriptQueryKeys.detail('m-1')),
      ).toEqual(manuscript1);
    });
    expect(queryClient.getQueryData(manuscriptQueryKeys.detail('m-2'))).toEqual(
      manuscript2,
    );
  });
});

describe('useManuscripts', () => {
  const listOptions = {
    searchQuery: '',
    currentPage: 0,
    pageSize: 10,
    requestedAPCCoverage: 'all',
    completedStatus: 'show',
    selectedStatuses: [],
  } as unknown as Parameters<typeof useManuscripts>[0];

  it('fetches the list and surgically merges refreshed items into every cached list', async () => {
    const listItem = {
      id: manuscriptId,
      title: 'The Manuscript',
      status: 'Waiting for Report',
    };
    (getManuscripts as jest.Mock).mockResolvedValue({
      total: 1,
      items: [listItem],
    });

    const otherOptions = { ...listOptions, currentPage: 1 };
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(manuscriptQueryKeys.list(otherOptions), {
      total: 1,
      items: [listItem],
    });

    const { result } = renderHook(() => useManuscripts(listOptions), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => expect(result.current?.items).toEqual([listItem]));

    act(() => {
      result.current.refresh({
        id: manuscriptId,
        status: 'Addendum Required',
      } as unknown as ManuscriptResponse);
    });

    await waitFor(() =>
      expect(result.current.items[0]?.status).toBe('Addendum Required'),
    );
    // the write-through reaches every cached manuscript list, not just the
    // rendered one
    expect(
      queryClient.getQueryData<{ items: { status: string }[] }>(
        manuscriptQueryKeys.list(otherOptions),
      )?.items[0]?.status,
    ).toBe('Addendum Required');
  });

  it('maps a non-Error rejection to an empty list', async () => {
    (getManuscripts as jest.Mock).mockRejectedValue('nope');

    const { result } = renderStateHook(() => useManuscripts(listOptions));

    await waitFor(() =>
      expect(result.current).toMatchObject({ total: 0, items: [] }),
    );
  });

  it('re-throws Error rejections to the error boundary', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    (getManuscripts as jest.Mock).mockRejectedValue(new Error('boom'));

    const Probe = () => {
      useManuscripts(listOptions);
      return <>rendered</>;
    };
    const { getByText } = render(
      <QueryClientProvider client={createTestQueryClient()}>
        <ErrorBoundary>
          <Suspense fallback="loading">
            <Auth0Provider user={{ id: 'user-id' }}>
              <WhenReady>
                <Probe />
              </WhenReady>
            </Auth0Provider>
          </Suspense>
        </ErrorBoundary>
      </QueryClientProvider>,
    );

    await waitFor(() => expect(getByText('errored')).toBeInTheDocument());
    consoleErrorSpy.mockRestore();
  });
});

describe('useUploadManuscriptFileViaPresignedUrl', () => {
  const mockHandleError = jest.fn();
  const file = new File(['test content'], 'file.pdf', {
    type: 'application/pdf',
  });

  it('calls uploadManuscriptFileViaPresignedUrl with correct parameters', async () => {
    (uploadManuscriptFileViaPresignedUrl as jest.Mock).mockResolvedValueOnce({
      success: true,
    });

    const { result } = renderStateHook(() =>
      useUploadManuscriptFileViaPresignedUrl(),
    );
    await waitFor(() => expect(result.current).toBeTruthy());

    await act(async () => {
      const resultValue = await result.current(
        file,
        'Manuscript File',
        mockHandleError,
      );
      expect(resultValue).toEqual({ success: true });
    });

    expect(uploadManuscriptFileViaPresignedUrl).toHaveBeenCalledWith(
      file,
      'Manuscript File',
      mockAuthorization,
      mockHandleError,
    );
  });

  it('handles upload errors and calls error handler', async () => {
    const errorMessage = 'Upload failed!';

    (uploadManuscriptFileViaPresignedUrl as jest.Mock).mockImplementationOnce(
      async (
        _file: File,
        _type: string,
        _auth: string,
        handleError: (msg: string) => void,
      ) => {
        handleError(errorMessage);
        throw new Error(errorMessage);
      },
    );

    const { result } = renderStateHook(() =>
      useUploadManuscriptFileViaPresignedUrl(),
    );
    await waitFor(() => expect(result.current).toBeTruthy());

    await act(async () => {
      await expect(
        result.current(file, 'Manuscript File', mockHandleError),
      ).rejects.toThrow(errorMessage);
    });

    expect(uploadManuscriptFileViaPresignedUrl).toHaveBeenCalled();
    expect(mockHandleError).toHaveBeenCalledWith(errorMessage);
  });
});

describe('usePostPreprintResearchOutput', () => {
  const mockManuscriptId = 'manuscript-id-123';
  const mockResearchOutputResponse = {
    id: 'research-output-123',
    title: 'Test Preprint',
    documentType: 'Article',
    teams: [{ id: '42', displayName: 'Team One' }],
    published: true,
  };

  it('calls createPreprintResearchOutput with correct parameters and updates the cache', async () => {
    (createPreprintResearchOutput as jest.Mock).mockResolvedValue(
      mockResearchOutputResponse,
    );

    const { result, queryClient } = renderStateHook(() =>
      usePostPreprintResearchOutput(),
    );
    await waitFor(() => expect(result.current).toBeTruthy());

    await act(async () => {
      const response = await result.current(mockManuscriptId);
      expect(response).toEqual(mockResearchOutputResponse);
    });

    expect(createPreprintResearchOutput).toHaveBeenCalledWith(
      mockManuscriptId,
      mockAuthorization,
    );
    expect(
      queryClient.getQueryData(
        researchOutputQueryKeys.detail('research-output-123'),
      ),
    ).toEqual(mockResearchOutputResponse);
  });

  it('handles errors from createPreprintResearchOutput', async () => {
    const mockError = new Error('Failed to create preprint research output');
    (createPreprintResearchOutput as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderStateHook(() => usePostPreprintResearchOutput());
    await waitFor(() => expect(result.current).toBeTruthy());

    await act(async () => {
      await expect(result.current(mockManuscriptId)).rejects.toThrow(
        'Failed to create preprint research output',
      );
    });

    expect(createPreprintResearchOutput).toHaveBeenCalledWith(
      mockManuscriptId,
      mockAuthorization,
    );
  });
});

describe('useTeams', () => {
  const teamsOptions: GetTeamsListOptions = {
    searchQuery: '',
    teamType: 'all',
    currentPage: 0,
    pageSize: 10,
  };

  it('maps a non-Error rejection to an empty list', async () => {
    (getAlgoliaTeams as jest.Mock).mockRejectedValue('string rejection');

    const { result } = renderStateHook(() => useTeams(teamsOptions));

    await waitFor(() =>
      expect(result.current).toEqual({ total: 0, items: [] }),
    );
  });
});
