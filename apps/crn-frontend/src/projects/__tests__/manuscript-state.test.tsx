import { reset } from '@asap-hub/flags';
import { createTestQueryClient } from '@asap-hub/frontend-utils';
import { ManuscriptPostRequest, ManuscriptResponse } from '@asap-hub/model';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { ReactNode, Suspense } from 'react';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getManuscript } from '../../network/teams/api';
import { manuscriptQueryKeys } from '../../network/teams/state';
import {
  createManuscript,
  getWorkspaceManuscripts,
  resubmitManuscript,
  uploadManuscriptFileViaPresignedUrl,
} from '../api';
import {
  useManuscriptById,
  usePostManuscript,
  useResubmitManuscript,
  useUploadManuscriptFileViaPresignedUrl,
  useWorkspaceManuscripts,
} from '../state';

jest.mock('../api', () => {
  const actual = jest.requireActual('../api');
  return {
    ...actual,
    createManuscript: jest.fn(),
    resubmitManuscript: jest.fn(),
    getWorkspaceManuscripts: jest.fn(),
    uploadManuscriptFileViaPresignedUrl: jest.fn(),
  };
});

jest.mock('../../network/teams/api', () => {
  const actual = jest.requireActual('../../network/teams/api');
  return {
    ...actual,
    getManuscript: jest.fn(),
  };
});

jest.mock('../../hooks/algolia', () => ({
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

const teamId = 'team-id-0';
const manuscriptId = 'manuscript-id-0';

const manuscriptPostPayload: ManuscriptPostRequest = {
  title: 'The Manuscript',
  teamId: '42',
  eligibilityReasons: [],
  impact: 'impact-id-1',
  categories: ['category-id-1'],
  versions: [
    {
      lifecycle: 'Publication',
      type: 'Original Research',
      manuscriptFile: {
        id: '42',
        filename: 'test-file',
        url: 'https://example.com/test-file',
      },
      teams: ['42'],
      labs: [],
      description: '',
      shortDescription: '',
      firstAuthors: [],
    },
  ],
};

afterEach(() => {
  jest.clearAllMocks();
  reset();
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

  it('resolves undefined without calling the API when the id is empty', async () => {
    const { result } = renderStateHook(() => useManuscriptById(''));

    await waitFor(() => expect(result.current).toBeTruthy());
    expect(result.current[0]).toBeUndefined();
    expect(getManuscript).not.toHaveBeenCalled();
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

describe('useWorkspaceManuscripts', () => {
  it('fetches the workspace manuscripts by teamId', async () => {
    const response = {
      manuscripts: [{ id: 'm-1', title: 'One' }],
      collaborationManuscripts: [{ id: 'm-2', title: 'Two' }],
    };
    (getWorkspaceManuscripts as jest.Mock).mockResolvedValue(response);

    const { result } = renderStateHook(() =>
      useWorkspaceManuscripts({ teamId }),
    );

    await waitFor(() => expect(result.current).toEqual(response));
    expect(getWorkspaceManuscripts).toHaveBeenCalledWith(
      { teamId },
      mockAuthorization,
    );
  });

  it('resolves null params to empty lists without calling the API', async () => {
    const { result, queryClient } = renderStateHook(() =>
      useWorkspaceManuscripts(null),
    );

    await waitFor(() =>
      expect(result.current).toEqual({
        manuscripts: [],
        collaborationManuscripts: [],
      }),
    );
    expect(getWorkspaceManuscripts).not.toHaveBeenCalled();
    expect(queryClient.getQueryData(manuscriptQueryKeys.workspace({}))).toEqual(
      { manuscripts: [], collaborationManuscripts: [] },
    );
  });
});

describe('usePostManuscript', () => {
  it('calls createManuscript API with the correct parameters', async () => {
    (createManuscript as jest.Mock).mockResolvedValue({ id: manuscriptId });

    const { result } = renderStateHook(() => usePostManuscript());
    await waitFor(() => expect(result.current).toBeTruthy());

    await act(async () => {
      await result.current(manuscriptPostPayload);
    });

    expect(createManuscript).toHaveBeenCalledWith(
      {
        ...manuscriptPostPayload,
        notificationList: undefined,
      },
      mockAuthorization,
    );
  });
});

describe('useResubmitManuscript', () => {
  it('calls resubmitManuscript API with the correct parameters', async () => {
    (resubmitManuscript as jest.Mock).mockResolvedValue({ id: manuscriptId });

    const { result } = renderStateHook(() => useResubmitManuscript());
    await waitFor(() => expect(result.current).toBeTruthy());

    await act(async () => {
      await result.current(manuscriptId, manuscriptPostPayload);
    });

    expect(resubmitManuscript).toHaveBeenCalledWith(
      manuscriptId,
      {
        ...manuscriptPostPayload,
        notificationList: undefined,
      },
      mockAuthorization,
    );
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
