import { createManuscriptResponse } from '@asap-hub/fixtures';
import {
  ManuscriptVersion,
  TeamDataObject,
  TeamManuscript,
  TeamStatus,
  TeamType,
} from '@asap-hub/model';
import { BackendError } from '@asap-hub/frontend-utils';
import { waitFor } from '@testing-library/dom';
import { act, renderHook } from '@testing-library/react';
import * as recoilModule from 'recoil';
import {
  MutableSnapshot,
  RecoilRoot,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { authorizationState } from '../../../auth/state';
import {
  getManuscript,
  updateDiscussion,
  createDiscussion,
  createPreprintResearchOutput,
} from '../api';
import * as stateModule from '../state';
import {
  patchedTeamState,
  teamState,
  useReplyToDiscussion,
  useVersionById,
  versionSelector,
  useUploadManuscriptFileViaPresignedUrl,
} from '../state';

import * as uploadApi from '../api';
import { getPresignedUrl } from '../../../shared-api/files';

const mockSetDiscussion = jest.fn();

jest.mock('../api', () => ({
  updateDiscussion: jest.fn(),
  getManuscript: jest.fn(),
  uploadManuscriptFileViaPresignedUrl: jest.fn(),
  createDiscussion: jest.fn(),
  createPreprintResearchOutput: jest.fn(),
}));

jest.mock('../../../shared-api/files');

const teamId = 'team-id-0';
const teamType = 'Discovery Team' as TeamType;
const teamStatus = 'Active' as TeamStatus;

const teamMock = {
  id: 'id-0',
  teamId: 'team-id-0',
  teamType,
  teamStatus,
  tags: [{ id: 'tag-1', name: 'Research' }],
  members: [],
  lastModifiedDate: '2021-09-01T00:00:00Z',
  labCount: 1,
  displayName: 'Team One',
  projectTitle: 'Project Title',
};

const mockVersionData = createManuscriptResponse()
  .versions[0] as ManuscriptVersion;

describe('team selectors', () => {
  test('teamState selector retrieves team with tags', () => {
    const initialState = ({ set }: MutableSnapshot) => {
      const mockTeam: TeamDataObject = {
        ...teamMock,
        manuscripts: [],
      };

      set(teamState(teamId), mockTeam);
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecoilRoot initializeState={initialState}>{children}</RecoilRoot>
    );

    const { result } = renderHook(() => useRecoilValue(teamState(teamId)), {
      wrapper,
    });

    expect(result.current?.displayName).toBe('Team One');
    expect(result.current?.tags.length).toBe(1);
  });

  test('resets team state when newValue is undefined', () => {
    jest.spyOn(console, 'error').mockImplementation();
    const mockTeam = {
      id: 'id-0',
      teamId,
      teamType,
      teamStatus,
      tags: [],
      members: [],
      lastModifiedDate: '2021-09-01T00:00:00Z',
      labCount: 1,
      displayName: 'Team One',
      projectTitle: 'Project Title',
      manuscripts: [],
    };
    const initialState = ({ set }: MutableSnapshot) => {
      set(patchedTeamState(teamId), mockTeam);
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecoilRoot initializeState={initialState}>{children}</RecoilRoot>
    );

    const { result } = renderHook(
      () => {
        const [getTeamState, setTeamState] = useRecoilState(teamState(teamId));
        return { setTeamState, getTeamState };
      },
      { wrapper },
    );

    expect(result.current.getTeamState).toEqual(mockTeam);

    act(() => {
      result.current.setTeamState(undefined);
    });

    expect(result.current.getTeamState).toEqual(mockTeam);
  });
});

describe('versionSelector', () => {
  test('retrieves manuscript version', () => {
    const manuscriptId = 'manuscript-id-0';
    const versionId = 'version-id-0';

    const initialState = ({ set }: MutableSnapshot) => {
      const mockTeam = {
        ...teamMock,
        manuscripts: [
          {
            id: manuscriptId,
            versions: [
              {
                id: versionId,
              },
            ],
          },
        ] as TeamManuscript[],
      };

      set(teamState(teamId), mockTeam);
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecoilRoot initializeState={initialState}>{children}</RecoilRoot>
    );

    const { result } = renderHook(
      () =>
        useRecoilValue(versionSelector({ teamId, manuscriptId, versionId })),
      {
        wrapper,
      },
    );

    expect(result.current?.id).toBe(versionId);
  });

  test('returns undefined if manuscript or version does not exist', () => {
    const manuscriptId = 'manuscript-id-0';
    const versionId = 'nonexistent-version-id';

    const initialState = ({ set }: MutableSnapshot) => {
      const mockTeam = {
        ...teamMock,
        manuscripts: [
          {
            id: manuscriptId,
            versions: [
              {
                id: 'version-id-0',
              },
            ],
          },
        ] as TeamManuscript[],
      };

      set(teamState(teamId), mockTeam);
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecoilRoot initializeState={initialState}>{children}</RecoilRoot>
    );

    const { result } = renderHook(
      () =>
        useRecoilValue(versionSelector({ teamId, manuscriptId, versionId })),
      {
        wrapper,
      },
    );

    expect(result.current).toBeUndefined();
  });

  test('does not update version if versionId does not match', () => {
    const manuscriptId = 'manuscript-id-1';

    const initialState = ({ set }: MutableSnapshot) => {
      const mockTeam = {
        ...teamMock,
        manuscripts: [
          {
            id: manuscriptId,
            versions: [
              { id: 'version-id-1', description: 'Original Version 1' },
              { id: 'version-id-2', description: 'Original Version 2' },
            ],
          },
        ] as TeamManuscript[],
      };

      set(teamState(teamId), mockTeam);
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecoilRoot initializeState={initialState}>{children}</RecoilRoot>
    );

    const { result } = renderHook(
      () =>
        useVersionById({
          teamId,
          manuscriptId,
          versionId: 'nonexistent-version-id',
        }),
      { wrapper },
    );

    const updateVersion = (prev: ManuscriptVersion) => ({
      ...prev,
      description: 'Updated description',
    });

    act(() => {
      result.current[1](updateVersion);
    });

    const updatedTeam = renderHook(() => useRecoilValue(teamState(teamId)), {
      wrapper,
    }).result.current;

    const originalVersions = updatedTeam?.manuscripts.find(
      (m) => m.id === manuscriptId,
    )?.versions;
    expect(originalVersions).toEqual([
      { id: 'version-id-1', description: 'Original Version 1' },
      { id: 'version-id-2', description: 'Original Version 2' },
    ]);
  });
});

describe('useVersionById hook', () => {
  test('retrieves manuscript version and allows updating', () => {
    const manuscriptId = 'manuscript-id-1';

    const initialState = ({ set }: MutableSnapshot) => {
      const mockTeam = {
        ...teamMock,
        manuscripts: [
          {
            id: manuscriptId,
            versions: [mockVersionData],
          },
        ] as TeamManuscript[],
      };

      set(teamState(teamId), mockTeam);
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecoilRoot initializeState={initialState}>{children}</RecoilRoot>
    );

    const { result } = renderHook(
      () =>
        useVersionById({ teamId, manuscriptId, versionId: mockVersionData.id }),
      {
        wrapper,
      },
    );

    expect(result.current[0]?.id).toBe('version-1');

    const updateVersion = (prev: ManuscriptVersion) => ({
      ...prev,
      description: 'Updated description',
    });
    act(() => {
      result.current[1](updateVersion);
    });

    expect(result.current[0]?.description).toBe('Updated description');
  });

  test('only updates the matching version in the concerned manuscript and leaves other versions and manuscripts untouched', () => {
    const manuscriptId = 'manuscript-id-1';

    const initialState = ({ set }: MutableSnapshot) => {
      const mockTeam = {
        ...teamMock,
        manuscripts: [
          {
            id: manuscriptId,
            versions: [
              {
                ...mockVersionData,
                description: 'Original Version 1 Description',
              },
              {
                ...mockVersionData,
                id: 'version-2',
                description: 'Original Version 2 Description',
              },
            ],
          },
          {
            id: 'manuscript-id-2',
            versions: [
              {
                ...mockVersionData,
                id: 'version-3',
                description: 'Original Version 3 Description',
              },
            ],
          },
        ] as TeamManuscript[],
      };

      set(teamState(teamId), mockTeam);
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecoilRoot initializeState={initialState}>{children}</RecoilRoot>
    );

    const { result } = renderHook(
      () =>
        useVersionById({ teamId, manuscriptId, versionId: mockVersionData.id }),
      {
        wrapper,
      },
    );

    expect(result.current[0]?.id).toBe('version-1');

    const updateVersion = (prev: ManuscriptVersion) => ({
      ...prev,
      description: 'Updated description',
    });
    act(() => {
      result.current[1](updateVersion);
    });

    expect(result.current[0]?.description).toBe('Updated description');

    const { result: resultState } = renderHook(
      () => useRecoilValue(teamState(teamId)),
      { wrapper },
    );

    const resultVersion =
      resultState.current && resultState.current.manuscripts
        ? resultState.current.manuscripts[1]
        : undefined;
    expect(resultVersion).toEqual({
      id: 'manuscript-id-2',
      versions: [
        {
          ...mockVersionData,
          id: 'version-3',
          description: 'Original Version 3 Description',
        },
      ],
    });
  });
});

const discussionId = 'discussion-id-0';
const manuscriptId = 'manuscript-id-0';
const manuscriptId2 = 'manuscript-id-1';

const mockTeam = {
  id: 'id-0',
  teamId,
  teamType,
  manuscripts: [
    {
      id: manuscriptId,
      status: 'Waiting for Report',
    },
  ],
};

const mockDiscussion = {
  id: discussionId,
  title: 'Updated Discussion',
  status: 'Addendum Required',
};

const mockUpdatedManuscript = {
  id: manuscriptId,
  status: 'Addendum Required',
};

const mockAuthorization = 'mock-token';

describe('useReplyToDiscussion', () => {
  beforeEach(() => {
    jest.spyOn(recoilModule, 'useRecoilValue').mockImplementation((state) => {
      if (state === authorizationState) {
        return mockAuthorization;
      }
      return undefined;
    });

    jest
      .spyOn(stateModule, 'useSetDiscussion')
      .mockReturnValue(mockSetDiscussion);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('calls updateDiscussion API with the correct parameters', async () => {
    (updateDiscussion as jest.Mock).mockResolvedValue({
      discussion: mockDiscussion,
      manuscript: mockUpdatedManuscript,
    });

    (getManuscript as jest.Mock).mockResolvedValue(mockUpdatedManuscript);

    const initialState = ({ set }: MutableSnapshot) => {
      set(teamState(teamId), mockTeam as TeamDataObject);
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecoilRoot initializeState={initialState}>{children}</RecoilRoot>
    );

    const { result } = renderHook(() => useReplyToDiscussion(), {
      wrapper,
    });

    const patch = { text: 'Reply message', manuscriptId };

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

  test('handles 403 error and refetches manuscript', async () => {
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

    const initialState = ({ set }: MutableSnapshot) => {
      set(teamState(teamId), mockTeam as TeamDataObject);
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecoilRoot initializeState={initialState}>{children}</RecoilRoot>
    );

    const { result } = renderHook(() => useReplyToDiscussion(), {
      wrapper,
    });

    const patch = { text: 'Reply after 403', manuscriptId };

    await act(async () => {
      await expect(
        result.current(manuscriptId, discussionId, patch),
      ).rejects.toThrow(errorMessage);
    });

    expect(getManuscript).toHaveBeenCalledWith(manuscriptId, mockAuthorization);
  });

  test('updates teamState with the updated manuscript status', async () => {
    (updateDiscussion as jest.Mock).mockResolvedValue({
      discussion: mockDiscussion,
      manuscript: mockUpdatedManuscript,
    });

    const initialState = ({ set }: MutableSnapshot) => {
      set(teamState(teamId), {
        ...mockTeam,
        manuscripts: [
          ...mockTeam.manuscripts,
          {
            id: manuscriptId2,
            status: 'Waiting for Report',
          },
        ],
      } as TeamDataObject);
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecoilRoot initializeState={initialState}>{children}</RecoilRoot>
    );

    const { result } = renderHook(() => useReplyToDiscussion(), {
      wrapper,
    });

    const patch = { text: 'Reply message', manuscriptId };

    await act(async () => {
      await result.current(manuscriptId, discussionId, patch);
    });

    const { result: stateResult } = renderHook(
      () => useRecoilValue(teamState(teamId)),
      { wrapper },
    );

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(() => {
      expect(stateResult.current?.manuscripts).toEqual([
        {
          id: manuscriptId,
          status: 'Addendum Required',
        },
        {
          id: manuscriptId2,
          status: 'Waiting for Report',
        },
      ]);
    });
  });

  test('does not update teamState if the response does not include manuscript updates', async () => {
    (updateDiscussion as jest.Mock).mockResolvedValue({
      discussion: mockDiscussion,
    });

    const initialState = ({ set }: MutableSnapshot) => {
      set(teamState(teamId), mockTeam as TeamDataObject);
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecoilRoot initializeState={initialState}>{children}</RecoilRoot>
    );

    const { result } = renderHook(() => useReplyToDiscussion(), {
      wrapper,
    });

    const patch = { text: 'Reply message', manuscriptId };

    await act(async () => {
      await result.current(manuscriptId, discussionId, patch);
    });

    const { result: stateResult } = renderHook(
      () => useRecoilValue(teamState(teamId)),
      { wrapper },
    );

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(() => {
      expect(stateResult.current?.manuscripts).toEqual(mockTeam.manuscripts);
    });
  });

  test('handles nonexistant team gracefully', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    (updateDiscussion as jest.Mock).mockResolvedValue({
      discussion: mockDiscussion,
      manuscript: mockUpdatedManuscript,
    });

    const initialState = ({ set }: MutableSnapshot) => {
      set(teamState(teamId), mockTeam as TeamDataObject);
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecoilRoot initializeState={initialState}>{children}</RecoilRoot>
    );

    const { result } = renderHook(() => useReplyToDiscussion(), {
      wrapper,
    });

    const patch = { text: 'Reply message', manuscriptId };

    await act(async () => {
      await result.current(manuscriptId, discussionId, patch);
    });

    const { result: stateResult } = renderHook(
      () => useRecoilValue(teamState(`${teamId}-nonexistent`)),
      { wrapper },
    );

    expect(stateResult.current).toBeUndefined();
  });

  test('handles API errors without updating state', async () => {
    const mockError = new Error('API error');
    (updateDiscussion as jest.Mock).mockRejectedValue(mockError);

    const initialState = ({ set }: MutableSnapshot) => {
      set(teamState(teamId), mockTeam as TeamDataObject);
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecoilRoot initializeState={initialState}>{children}</RecoilRoot>
    );

    const { result } = renderHook(() => useReplyToDiscussion(), {
      wrapper,
    });

    const patch = { text: 'Reply message', manuscriptId };

    await expect(
      act(async () => {
        await result.current(manuscriptId, discussionId, patch);
      }),
    ).rejects.toThrow();

    const { result: stateResult } = renderHook(
      () => useRecoilValue(teamState(teamId)),
      { wrapper },
    );

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(() => {
      expect(stateResult.current?.manuscripts).toEqual(mockTeam.manuscripts);
    });
  });
});

describe('useUploadManuscriptFileViaPresignedUrl', () => {
  const mockHandleError = jest.fn();
  const file = new File(['test content'], 'file.pdf', {
    type: 'application/pdf',
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(recoilModule, 'useRecoilValue').mockImplementation((state) => {
      if (state === authorizationState) {
        return mockAuthorization;
      }
      return undefined;
    });
  });

  it('calls uploadManuscriptFileViaPresignedUrl with correct parameters', async () => {
    const mockFn = uploadApi.uploadManuscriptFileViaPresignedUrl as jest.Mock;
    mockFn.mockResolvedValueOnce({ success: true });

    const { result } = renderHook(
      () => useUploadManuscriptFileViaPresignedUrl(),
      {
        wrapper: RecoilRoot,
      },
    );

    await act(async () => {
      const resultValue = await result.current(
        file,
        'Manuscript File',
        mockHandleError,
      );
      expect(resultValue).toEqual({ success: true });
    });

    await waitFor(() => {
      expect(
        uploadApi.uploadManuscriptFileViaPresignedUrl,
      ).toHaveBeenCalledWith(
        file,
        'Manuscript File',
        mockAuthorization,
        mockHandleError,
      );
    });
  });

  it('handles upload errors and calls error handler', async () => {
    const errorMessage = 'Upload failed!';

    const mockFn = uploadApi.uploadManuscriptFileViaPresignedUrl as jest.Mock;
    mockFn.mockImplementationOnce(
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

    const { result } = renderHook(
      () => useUploadManuscriptFileViaPresignedUrl(),
      {
        wrapper: RecoilRoot,
      },
    );

    await act(async () => {
      try {
        await result.current(file, 'Manuscript File', mockHandleError);
      } catch (e) {
        // expected
      }
    });

    expect(mockFn).toHaveBeenCalled();
    expect(mockHandleError).toHaveBeenCalledWith(errorMessage);
  });
});

describe('usePresignedUrl', () => {
  const mockUploadUrl = 'https://presigned-url.com/file.pdf';
  const mockGetPresignedUrl = getPresignedUrl as jest.Mock;

  beforeEach(() => {
    jest.spyOn(recoilModule, 'useRecoilValue').mockImplementation((state) => {
      if (state === authorizationState) return mockAuthorization;
      return undefined;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches the presigned URL successfully and updates loading state', async () => {
    mockGetPresignedUrl.mockResolvedValueOnce({ presignedUrl: mockUploadUrl });

    const { result } = renderHook(() => stateModule.usePresignedUrl(), {
      wrapper: RecoilRoot,
    });

    let url: string | undefined;
    await act(async () => {
      url = await result.current.fetchPresignedUrl(
        'file.pdf',
        'application/pdf',
      );
    });

    expect(mockGetPresignedUrl).toHaveBeenCalledWith(
      'file.pdf',
      mockAuthorization,
      'application/pdf',
    );
    expect(url).toBe(mockUploadUrl);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('sets error state on failure and throws error', async () => {
    mockGetPresignedUrl.mockRejectedValueOnce(new Error('Oops'));

    const { result } = renderHook(() => stateModule.usePresignedUrl(), {
      wrapper: RecoilRoot,
    });

    await act(async () => {
      await expect(
        result.current.fetchPresignedUrl('file.pdf', 'application/pdf'),
      ).rejects.toThrow('Oops');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Failed to generate pre-signed URL');
  });
});

describe('useCreateDiscussion', () => {
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

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecoilRoot>{children}</RecoilRoot>
    );

    const { result } = renderHook(() => stateModule.useCreateDiscussion(), {
      wrapper,
    });

    await act(async () => {
      await expect(
        result.current(manuscriptId, 'title', 'content'),
      ).rejects.toThrow(errorMessage);
    });

    expect(getManuscript).toHaveBeenCalledWith(manuscriptId, mockAuthorization);
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

  beforeEach(() => {
    jest.spyOn(recoilModule, 'useRecoilValue').mockImplementation((state) => {
      if (state === authorizationState) {
        return mockAuthorization;
      }
      return undefined;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls createPreprintResearchOutput with correct parameters and updates state', async () => {
    (createPreprintResearchOutput as jest.Mock).mockResolvedValue(
      mockResearchOutputResponse,
    );

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecoilRoot>{children}</RecoilRoot>
    );

    const { result } = renderHook(
      () => stateModule.usePostPreprintResearchOutput(),
      {
        wrapper,
      },
    );

    await act(async () => {
      const response = await result.current(mockManuscriptId);
      expect(response).toEqual(mockResearchOutputResponse);
    });

    expect(createPreprintResearchOutput).toHaveBeenCalledWith(
      mockManuscriptId,
      mockAuthorization,
    );
  });

  it('handles errors from createPreprintResearchOutput', async () => {
    const mockError = new Error('Failed to create preprint research output');
    (createPreprintResearchOutput as jest.Mock).mockRejectedValue(mockError);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecoilRoot>{children}</RecoilRoot>
    );

    const { result } = renderHook(
      () => stateModule.usePostPreprintResearchOutput(),
      {
        wrapper,
      },
    );

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

  it('returns the research output response from the API', async () => {
    (createPreprintResearchOutput as jest.Mock).mockResolvedValue(
      mockResearchOutputResponse,
    );

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecoilRoot>{children}</RecoilRoot>
    );

    const { result } = renderHook(
      () => stateModule.usePostPreprintResearchOutput(),
      {
        wrapper,
      },
    );

    let response;
    await act(async () => {
      response = await result.current(mockManuscriptId);
    });

    expect(response).toEqual(mockResearchOutputResponse);
  });
});
