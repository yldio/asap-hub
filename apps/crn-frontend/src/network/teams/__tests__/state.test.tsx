import { BackendError } from '@asap-hub/frontend-utils';
import { TeamResponse } from '@asap-hub/model';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, renderHook, waitFor } from '@testing-library/react';
import { ReactNode, Suspense } from 'react';

import { getPresignedUrl } from '../../../shared-api/files';
import {
  createDiscussion,
  createPreprintResearchOutput,
  getManuscript,
  getManuscriptsByIds,
  patchTeam,
  updateDiscussion,
  uploadManuscriptFileViaPresignedUrl,
} from '../api';
import {
  manuscriptQueryKey,
  teamQueryKey,
  useBatchManuscriptsByIds,
  useCreateDiscussion,
  usePatchTeamById,
  usePostPreprintResearchOutput,
  usePresignedUrl,
  useReplyToDiscussion,
  useUploadManuscriptFileViaPresignedUrl,
} from '../state';

jest.mock('../api', () => ({
  createDiscussion: jest.fn(),
  createPreprintResearchOutput: jest.fn(),
  getManuscript: jest.fn(),
  getManuscriptsByIds: jest.fn(),
  patchTeam: jest.fn(),
  updateDiscussion: jest.fn(),
  uploadManuscriptFileViaPresignedUrl: jest.fn(),
  getTeam: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../../../shared-api/files');
jest.mock('@asap-hub/react-context', () => {
  const actual = jest.requireActual('@asap-hub/react-context');
  return {
    ...actual,
    useAuth0CRN: () => ({
      getTokenSilently: jest.fn().mockResolvedValue('access_token'),
    }),
  };
});
jest.mock('../../../shared-research/state', () => ({
  useSetResearchOutputItem: () => jest.fn(),
}));

const mockGetManuscript = getManuscript as jest.MockedFunction<
  typeof getManuscript
>;
const mockGetManuscriptsByIds = getManuscriptsByIds as jest.MockedFunction<
  typeof getManuscriptsByIds
>;
const mockUpdateDiscussion = updateDiscussion as jest.MockedFunction<
  typeof updateDiscussion
>;
const mockCreateDiscussion = createDiscussion as jest.MockedFunction<
  typeof createDiscussion
>;
const mockPatchTeam = patchTeam as jest.MockedFunction<typeof patchTeam>;
const mockUpload = uploadManuscriptFileViaPresignedUrl as jest.MockedFunction<
  typeof uploadManuscriptFileViaPresignedUrl
>;
const mockGetPresignedUrl = getPresignedUrl as jest.MockedFunction<
  typeof getPresignedUrl
>;
const mockCreatePreprint = createPreprintResearchOutput as jest.MockedFunction<
  typeof createPreprintResearchOutput
>;

beforeEach(() => {
  jest.clearAllMocks();
});

const makeClient = () =>
  new QueryClient({
    // Don't garbage-collect unobserved queries during a test — the batch hook
    // seeds per-id caches that aren't directly observed and would otherwise
    // be evicted immediately.
    defaultOptions: { queries: { retry: false, staleTime: 0 } },
  });

const wrap =
  (client: QueryClient): ((props: { children: ReactNode }) => JSX.Element) =>
  ({ children }) => (
    <QueryClientProvider client={client}>
      <Suspense fallback={<span>loading</span>}>{children}</Suspense>
    </QueryClientProvider>
  );

describe('usePatchTeamById', () => {
  it('calls patchTeam and merges the result into the team cache', async () => {
    const client = makeClient();
    const existing = { id: 'team-1', displayName: 'Old' } as TeamResponse;
    client.setQueryData(teamQueryKey('team-1'), existing);
    mockPatchTeam.mockResolvedValue({
      ...existing,
      displayName: 'New',
    } as TeamResponse);

    const { result } = renderHook(() => usePatchTeamById('team-1'), {
      wrapper: wrap(client),
    });
    await waitFor(() => expect(typeof result.current).toBe('function'));
    await result.current({ tools: [] });

    expect(mockPatchTeam).toHaveBeenCalledWith(
      'team-1',
      { tools: [] },
      expect.stringMatching(/^Bearer /),
    );
    expect(
      (client.getQueryData(teamQueryKey('team-1')) as TeamResponse).displayName,
    ).toBe('New');
  });
});

describe('useReplyToDiscussion', () => {
  it('updates the discussion and refetches the affected manuscript', async () => {
    const client = makeClient();
    mockUpdateDiscussion.mockResolvedValue({
      id: 'd1',
      text: 'reply',
    } as never);
    mockGetManuscript.mockResolvedValue({
      id: 'm1',
      versions: [],
      discussions: [],
    } as never);

    const { result } = renderHook(() => useReplyToDiscussion(), {
      wrapper: wrap(client),
    });
    await waitFor(() => expect(typeof result.current).toBe('function'));
    await result.current('m1', 'd1', { text: 'reply' } as never);

    expect(mockUpdateDiscussion).toHaveBeenCalledWith(
      'd1',
      expect.objectContaining({ text: 'reply' }),
      expect.stringMatching(/^Bearer /),
    );
    expect(mockGetManuscript).toHaveBeenCalledWith(
      'm1',
      expect.stringMatching(/^Bearer /),
    );
  });

  it('refetches the manuscript and rethrows on a 403', async () => {
    const client = makeClient();
    const forbidden = new BackendError(
      'forbidden',
      { statusCode: 403 } as never,
      403,
    );
    mockUpdateDiscussion.mockRejectedValue(forbidden);
    mockGetManuscript.mockResolvedValue({
      id: 'm1',
      versions: [],
      discussions: [],
    } as never);

    const { result } = renderHook(() => useReplyToDiscussion(), {
      wrapper: wrap(client),
    });
    await waitFor(() => expect(typeof result.current).toBe('function'));

    await expect(
      result.current('m1', 'd1', { text: 'x' } as never),
    ).rejects.toBe(forbidden);
    expect(mockGetManuscript).toHaveBeenCalled();
  });
});

describe('useCreateDiscussion', () => {
  it('creates the discussion and refreshes the manuscript', async () => {
    const client = makeClient();
    mockCreateDiscussion.mockResolvedValue({ id: 'd-new' } as never);
    mockGetManuscript.mockResolvedValue({
      id: 'm1',
      versions: [],
      discussions: [],
    } as never);

    const { result } = renderHook(() => useCreateDiscussion(), {
      wrapper: wrap(client),
    });
    await waitFor(() => expect(typeof result.current).toBe('function'));

    const id = await result.current('m1', 'title', 'body');
    expect(id).toBe('d-new');
    expect(mockCreateDiscussion).toHaveBeenCalled();
    expect(mockGetManuscript).toHaveBeenCalledWith(
      'm1',
      expect.stringMatching(/^Bearer /),
    );
  });

  it('refetches the manuscript on a 403 and rethrows', async () => {
    const client = makeClient();
    const forbidden = new BackendError(
      'forbidden',
      { statusCode: 403 } as never,
      403,
    );
    mockCreateDiscussion.mockRejectedValue(forbidden);
    mockGetManuscript.mockResolvedValue({
      id: 'm1',
      versions: [],
      discussions: [],
    } as never);

    const { result } = renderHook(() => useCreateDiscussion(), {
      wrapper: wrap(client),
    });
    await waitFor(() => expect(typeof result.current).toBe('function'));

    await expect(result.current('m1', 't', 'b')).rejects.toBe(forbidden);
    expect(mockGetManuscript).toHaveBeenCalled();
  });
});

describe('useUploadManuscriptFileViaPresignedUrl', () => {
  it('forwards file, fileType, authorization, and error handler', async () => {
    const client = makeClient();
    mockUpload.mockResolvedValue({ id: 'f1' } as never);
    const handleError = jest.fn();

    const { result } = renderHook(
      () => useUploadManuscriptFileViaPresignedUrl(),
      { wrapper: wrap(client) },
    );
    await waitFor(() => expect(typeof result.current).toBe('function'));

    const file = new File(['x'], 'x.pdf', { type: 'application/pdf' });
    await result.current(file, 'Manuscript File', handleError);

    expect(mockUpload).toHaveBeenCalledWith(
      file,
      'Manuscript File',
      expect.stringMatching(/^Bearer /),
      handleError,
    );
  });
});

describe('usePresignedUrl', () => {
  it('returns the upload URL on success and clears loading', async () => {
    const client = makeClient();
    mockGetPresignedUrl.mockResolvedValue({
      presignedUrl: 'https://upload.example.com',
    } as never);

    const { result } = renderHook(() => usePresignedUrl(), {
      wrapper: wrap(client),
    });

    let url: string | undefined;
    await act(async () => {
      url = await result.current.fetchPresignedUrl(
        'file.pdf',
        'application/pdf',
      );
    });
    expect(url).toBe('https://upload.example.com');
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('records the error and rethrows on failure', async () => {
    const client = makeClient();
    mockGetPresignedUrl.mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => usePresignedUrl(), {
      wrapper: wrap(client),
    });

    await act(async () => {
      await expect(
        result.current.fetchPresignedUrl('file.pdf', 'application/pdf'),
      ).rejects.toThrow('boom');
    });
    expect(result.current.error).toBe('Failed to generate pre-signed URL');
  });
});

describe('usePostPreprintResearchOutput', () => {
  it('calls createPreprintResearchOutput and returns the response', async () => {
    const client = makeClient();
    const response = { id: 'ro-1' };
    mockCreatePreprint.mockResolvedValue(response as never);

    const { result } = renderHook(() => usePostPreprintResearchOutput(), {
      wrapper: wrap(client),
    });
    await waitFor(() => expect(typeof result.current).toBe('function'));

    await expect(result.current('m1')).resolves.toEqual(response);
    expect(mockCreatePreprint).toHaveBeenCalledWith(
      'm1',
      expect.stringMatching(/^Bearer /),
    );
  });

  it('propagates errors from the API', async () => {
    const client = makeClient();
    mockCreatePreprint.mockRejectedValue(new Error('nope'));

    const { result } = renderHook(() => usePostPreprintResearchOutput(), {
      wrapper: wrap(client),
    });
    await waitFor(() => expect(typeof result.current).toBe('function'));

    await expect(result.current('m1')).rejects.toThrow('nope');
  });
});

describe('useBatchManuscriptsByIds', () => {
  it('does not call the API when the id list is empty', async () => {
    const client = makeClient();
    await act(async () => {
      renderHook(() => useBatchManuscriptsByIds([]), {
        wrapper: wrap(client),
      });
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
    });
    expect(mockGetManuscriptsByIds).not.toHaveBeenCalled();
  });

  it('deduplicates, sorts, and seeds per-id caches', async () => {
    const client = makeClient();
    mockGetManuscriptsByIds.mockResolvedValue([
      { id: 'm1', title: 'A' },
      { id: 'm2', title: 'B' },
    ] as never);

    const Probe = () => {
      useBatchManuscriptsByIds(['m2', 'm1', 'm1']);
      return <span>ready</span>;
    };
    const { findByText } = render(
      <QueryClientProvider client={client}>
        <Suspense fallback={<span>loading</span>}>
          <Probe />
        </Suspense>
      </QueryClientProvider>,
    );
    await findByText('ready');

    expect(mockGetManuscriptsByIds).toHaveBeenCalledWith(
      ['m1', 'm2'],
      expect.stringMatching(/^Bearer /),
    );
    expect(client.getQueryData(manuscriptQueryKey('m1'))).toEqual({
      id: 'm1',
      title: 'A',
    });
    expect(client.getQueryData(manuscriptQueryKey('m2'))).toEqual({
      id: 'm2',
      title: 'B',
    });
  });
});
