import type { Timeline } from '@asap-hub/demo-timeline';
import { API_BASE_URL } from '../config';
import type {
  BulkDeleteResult,
  BulkMoveResult,
  CreatedAsset,
  CreatedUpload,
  Folder,
  FolderCounts,
  Invite,
  Lease,
  ListResponse,
  ManagedUser,
  Me,
  PartUrl,
  ProjectAsset,
  RecordingSession,
  RecordingSessionStatus,
  Role,
  SavedTimeline,
  UploadedPart,
  UserStatus,
  Video,
  VideoAccess,
  VideoPatch,
} from './types';
import { topLevelParentId } from './types';

export class ApiError extends Error {
  readonly status: number;

  readonly code?: string;

  readonly holderName?: string;

  constructor(
    status: number,
    message: string,
    code?: string,
    holderName?: string,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.holderName = holderName;
  }
}

export const isNotInvited = (error: unknown): boolean =>
  error instanceof ApiError &&
  error.status === 403 &&
  error.code === 'not_invited';

export const isRevoked = (error: unknown): boolean =>
  error instanceof ApiError && error.status === 403 && error.code === 'revoked';

export const isLockedOut = (error: unknown): boolean =>
  error instanceof ApiError && error.status === 409 && error.code === 'locked';

type RequestOptions = {
  method?: string;
  body?: unknown;
  credentials?: RequestCredentials;
  keepalive?: boolean;
};

const request = async <T>(
  path: string,
  token: string,
  { method = 'GET', body, credentials, keepalive }: RequestOptions = {},
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}/api${path}`, {
    method,
    credentials,
    keepalive,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

  const payload =
    response.status === 204
      ? undefined
      : await response.json().catch(() => undefined);

  // a 200 with an unparseable body is the SPA fallback masking an api miss
  if (response.ok && response.status !== 204 && payload === undefined) {
    throw new ApiError(response.status, `Request to ${path} returned no JSON`);
  }

  if (!response.ok) {
    const envelope =
      payload && typeof payload === 'object'
        ? (payload as { error?: unknown; holderName?: unknown })
        : undefined;
    throw new ApiError(
      response.status,
      `Request to ${path} failed with status ${response.status}`,
      envelope && 'error' in envelope ? String(envelope.error) : undefined,
      envelope && typeof envelope.holderName === 'string'
        ? envelope.holderName
        : undefined,
    );
  }

  return payload as T;
};

const stripQuotes = (value: string): string => value.replace(/^"|"$/g, '');

export const uploadPart = async (
  url: string,
  blob: Blob,
  signal?: AbortSignal,
): Promise<string> => {
  const response = await fetch(url, { method: 'PUT', body: blob, signal });
  if (!response.ok) {
    throw new ApiError(
      response.status,
      `Part upload failed with status ${response.status}`,
    );
  }
  const eTag = response.headers.get('ETag');
  if (!eTag)
    throw new ApiError(response.status, 'Part upload returned no ETag');
  return stripQuotes(eTag);
};

export type GetToken = () => Promise<string>;

export const createApi = (getToken: GetToken) => ({
  getMe: async (): Promise<Me> => request<Me>('/me', await getToken()),

  listFolders: async (): Promise<Folder[]> =>
    (await request<ListResponse<Folder>>('/folders', await getToken())).items,

  folderCounts: async (): Promise<FolderCounts> =>
    (
      await request<{ counts: FolderCounts }>(
        '/folders/counts',
        await getToken(),
      )
    ).counts,

  createFolder: async (name: string, parentId?: string): Promise<Folder> =>
    request<Folder>('/folders', await getToken(), {
      method: 'POST',
      body: parentId ? { name, parentId } : { name },
    }),

  renameFolder: async (id: string, name: string): Promise<Folder> =>
    request<Folder>(`/folders/${encodeURIComponent(id)}`, await getToken(), {
      method: 'PATCH',
      body: { name },
    }),

  // parentId defaults to the top-level sentinel so a folder can be detached
  moveFolder: async (
    id: string,
    parentId: string = topLevelParentId,
  ): Promise<Folder> =>
    request<Folder>(`/folders/${encodeURIComponent(id)}`, await getToken(), {
      method: 'PATCH',
      body: { parentId },
    }),

  deleteFolder: async (id: string): Promise<void> => {
    await request<void>(
      `/folders/${encodeURIComponent(id)}`,
      await getToken(),
      {
        method: 'DELETE',
      },
    );
  },

  bulkMoveVideos: async (
    ids: string[],
    folderId: string,
  ): Promise<BulkMoveResult> =>
    request<BulkMoveResult>('/videos/bulk-move', await getToken(), {
      method: 'POST',
      body: { ids, folderId },
    }),

  bulkDeleteVideos: async (ids: string[]): Promise<BulkDeleteResult> =>
    request<BulkDeleteResult>('/videos/bulk-delete', await getToken(), {
      method: 'POST',
      body: { ids },
    }),

  listVideos: async (folderId?: string): Promise<Video[]> => {
    const query = folderId ? `?folderId=${encodeURIComponent(folderId)}` : '';
    return (
      await request<ListResponse<Video>>(`/videos${query}`, await getToken())
    ).items;
  },

  listAllVideos: async (): Promise<Video[]> =>
    (await request<ListResponse<Video>>('/videos/all', await getToken())).items,

  getVideo: async (id: string): Promise<Video> =>
    request<Video>(`/videos/${encodeURIComponent(id)}`, await getToken()),

  requestAccess: async (id: string): Promise<VideoAccess> =>
    request<VideoAccess>(
      `/videos/${encodeURIComponent(id)}/access`,
      await getToken(),
      { method: 'POST', credentials: 'include' },
    ),

  createProject: async (input: {
    title: string;
    folderId?: string;
    recordedAt?: string;
  }): Promise<{ video: Video; timeline: Timeline; timelineVersion: number }> =>
    request('/projects', await getToken(), { method: 'POST', body: input }),

  getTimeline: async (
    id: string,
  ): Promise<{ timeline: Timeline; timelineVersion: number }> =>
    request(`/projects/${encodeURIComponent(id)}/timeline`, await getToken()),

  saveTimeline: async (
    id: string,
    input: { timeline: Timeline; timelineVersion: number; version: number },
  ): Promise<SavedTimeline> =>
    request<SavedTimeline>(
      `/projects/${encodeURIComponent(id)}/timeline`,
      await getToken(),
      { method: 'PUT', body: input },
    ),

  listAssets: async (id: string): Promise<ProjectAsset[]> =>
    (
      await request<{ assets: ProjectAsset[] }>(
        `/projects/${encodeURIComponent(id)}/assets`,
        await getToken(),
      )
    ).assets,

  createAsset: async (
    id: string,
    input: {
      kind: 'video' | 'audio';
      mimeType: string;
      label: string;
      extension: string;
    },
  ): Promise<CreatedAsset> =>
    request<CreatedAsset>(
      `/projects/${encodeURIComponent(id)}/assets`,
      await getToken(),
      { method: 'POST', body: input },
    ),

  createAssetPartUrls: async (
    id: string,
    assetId: string,
    uploadId: string,
    partNumbers: number[],
  ): Promise<PartUrl[]> =>
    (
      await request<{ urls: PartUrl[] }>(
        `/projects/${encodeURIComponent(id)}/assets/${encodeURIComponent(
          assetId,
        )}/parts`,
        await getToken(),
        { method: 'POST', body: { uploadId, partNumbers } },
      )
    ).urls,

  completeAsset: async (
    id: string,
    assetId: string,
    uploadId: string,
    parts: UploadedPart[],
  ): Promise<ProjectAsset> =>
    (
      await request<{ asset: ProjectAsset }>(
        `/projects/${encodeURIComponent(id)}/assets/${encodeURIComponent(
          assetId,
        )}/complete`,
        await getToken(),
        { method: 'POST', body: { uploadId, parts } },
      )
    ).asset,

  deleteAsset: async (id: string, assetId: string): Promise<void> => {
    await request<void>(
      `/projects/${encodeURIComponent(id)}/assets/${encodeURIComponent(
        assetId,
      )}`,
      await getToken(),
      { method: 'DELETE' },
    );
  },

  startCapture: async (id: string): Promise<RecordingSession> =>
    request<RecordingSession>(
      `/projects/${encodeURIComponent(id)}/recordings`,
      await getToken(),
      { method: 'POST' },
    ),

  captureStatus: async (
    id: string,
    sessionId: string,
  ): Promise<RecordingSessionStatus> =>
    request<RecordingSessionStatus>(
      `/projects/${encodeURIComponent(id)}/recordings/${encodeURIComponent(
        sessionId,
      )}`,
      await getToken(),
    ),

  finaliseCapture: async (
    id: string,
    sessionId: string,
    window: { startedAtEpochMs: number; stoppedAtEpochMs: number },
  ): Promise<{ eventsKey: string }> =>
    request<{ eventsKey: string }>(
      `/projects/${encodeURIComponent(id)}/recordings/${encodeURIComponent(
        sessionId,
      )}/finalise`,
      await getToken(),
      { method: 'POST', body: window },
    ),

  captureEvents: async (id: string, sessionId: string): Promise<string> =>
    request<string>(
      `/projects/${encodeURIComponent(id)}/recordings/${encodeURIComponent(
        sessionId,
      )}/events`,
      await getToken(),
    ),

  startRender: async (id: string, version: number): Promise<Video> =>
    (
      await request<{ video: Video }>(
        `/projects/${encodeURIComponent(id)}/render`,
        await getToken(),
        { method: 'POST', body: { version } },
      )
    ).video,

  cancelRender: async (id: string, version: number): Promise<Video> =>
    (
      await request<{ video: Video }>(
        `/projects/${encodeURIComponent(id)}/render`,
        await getToken(),
        { method: 'DELETE', body: { version } },
      )
    ).video,

  createUpload: async (input: {
    title: string;
    folderId?: string;
    recordedAt?: string;
  }): Promise<CreatedUpload> =>
    request<CreatedUpload>('/uploads', await getToken(), {
      method: 'POST',
      body: input,
    }),

  createPartUrls: async (
    videoId: string,
    uploadId: string,
    partNumbers: number[],
  ): Promise<PartUrl[]> =>
    (
      await request<{ urls: PartUrl[] }>(
        `/uploads/${encodeURIComponent(videoId)}/parts`,
        await getToken(),
        { method: 'POST', body: { uploadId, partNumbers } },
      )
    ).urls,

  completeUpload: async (
    videoId: string,
    uploadId: string,
    parts: UploadedPart[],
  ): Promise<Video> =>
    (
      await request<{ video: Video }>(
        `/uploads/${encodeURIComponent(videoId)}/complete`,
        await getToken(),
        { method: 'POST', body: { uploadId, parts } },
      )
    ).video,

  abortUpload: async (videoId: string, uploadId: string): Promise<void> => {
    await request<void>(
      `/uploads/${encodeURIComponent(videoId)}?uploadId=${encodeURIComponent(
        uploadId,
      )}`,
      await getToken(),
      { method: 'DELETE' },
    );
  },

  updateVideo: async (id: string, patch: VideoPatch): Promise<Video> =>
    (
      await request<{ video: Video }>(
        `/videos/${encodeURIComponent(id)}`,
        await getToken(),
        { method: 'PATCH', body: patch },
      )
    ).video,

  unpublishVideo: async (id: string, version: number): Promise<Video> =>
    (
      await request<{ video: Video }>(
        `/videos/${encodeURIComponent(id)}/unpublish`,
        await getToken(),
        { method: 'POST', body: { version } },
      )
    ).video,

  publishVideo: async (id: string, version: number): Promise<Video> =>
    (
      await request<{ video: Video }>(
        `/videos/${encodeURIComponent(id)}/publish`,
        await getToken(),
        { method: 'POST', body: { version } },
      )
    ).video,

  acquireLease: async (id: string): Promise<Lease> =>
    request<Lease>(
      `/videos/${encodeURIComponent(id)}/lease`,
      await getToken(),
      {
        method: 'POST',
      },
    ),

  releaseLease: async (id: string): Promise<void> => {
    await request<void>(
      `/videos/${encodeURIComponent(id)}/lease`,
      await getToken(),
      { method: 'DELETE' },
    );
  },

  releaseLeaseOnUnload: (id: string, token: string): void => {
    void fetch(`${API_BASE_URL}/api/videos/${encodeURIComponent(id)}/lease`, {
      method: 'DELETE',
      keepalive: true,
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => undefined);
  },

  deleteVideo: async (id: string): Promise<void> => {
    await request<void>(`/videos/${encodeURIComponent(id)}`, await getToken(), {
      method: 'DELETE',
    });
  },

  listInvites: async (): Promise<Invite[]> =>
    (await request<ListResponse<Invite>>('/invites', await getToken())).items,

  createInvite: async (email: string, role: Role): Promise<void> => {
    await request<unknown>('/invites', await getToken(), {
      method: 'POST',
      body: { email, role },
    });
  },

  cancelInvite: async (email: string): Promise<void> => {
    await request<void>(
      `/invites/${encodeURIComponent(email)}`,
      await getToken(),
      { method: 'DELETE' },
    );
  },

  listUsers: async (): Promise<ManagedUser[]> =>
    (await request<ListResponse<ManagedUser>>('/users', await getToken()))
      .items,

  updateUser: async (
    sub: string,
    patch: { role?: Role; status?: UserStatus },
  ): Promise<ManagedUser> =>
    request<ManagedUser>(
      `/users/${encodeURIComponent(sub)}`,
      await getToken(),
      {
        method: 'PATCH',
        body: patch,
      },
    ),

  deleteUser: async (sub: string): Promise<void> => {
    await request<void>(`/users/${encodeURIComponent(sub)}`, await getToken(), {
      method: 'DELETE',
    });
  },
});

export type Api = ReturnType<typeof createApi>;
