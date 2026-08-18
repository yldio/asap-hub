import { API_BASE_URL } from '../config';
import type {
  Folder,
  Invite,
  ListResponse,
  Me,
  Role,
  Video,
  VideoAccess,
} from './types';

export class ApiError extends Error {
  readonly status: number;

  readonly code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export const isNotInvited = (error: unknown): boolean =>
  error instanceof ApiError &&
  error.status === 403 &&
  error.code === 'not_invited';

type RequestOptions = {
  method?: string;
  body?: unknown;
  credentials?: RequestCredentials;
};

const request = async <T>(
  path: string,
  token: string,
  { method = 'GET', body, credentials }: RequestOptions = {},
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}/api${path}`, {
    method,
    credentials,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

  const payload = await response.json().catch(() => undefined);

  if (!response.ok) {
    const code =
      payload && typeof payload === 'object' && 'error' in payload
        ? String((payload as { error: unknown }).error)
        : undefined;
    throw new ApiError(
      response.status,
      `Request to ${path} failed with status ${response.status}`,
      code,
    );
  }

  return payload as T;
};

export type GetToken = () => Promise<string>;

export const createApi = (getToken: GetToken) => ({
  getMe: async (): Promise<Me> => request<Me>('/me', await getToken()),

  listFolders: async (): Promise<Folder[]> =>
    (await request<ListResponse<Folder>>('/folders', await getToken())).items,

  createFolder: async (name: string): Promise<Folder> =>
    request<Folder>('/folders', await getToken(), {
      method: 'POST',
      body: { name },
    }),

  listVideos: async (folderId?: string): Promise<Video[]> => {
    const query = folderId ? `?folderId=${encodeURIComponent(folderId)}` : '';
    return (
      await request<ListResponse<Video>>(`/videos${query}`, await getToken())
    ).items;
  },

  getVideo: async (id: string): Promise<Video> =>
    request<Video>(`/videos/${encodeURIComponent(id)}`, await getToken()),

  requestAccess: async (id: string): Promise<VideoAccess> =>
    request<VideoAccess>(
      `/videos/${encodeURIComponent(id)}/access`,
      await getToken(),
      { method: 'POST', credentials: 'include' },
    ),

  listInvites: async (): Promise<Invite[]> =>
    (await request<ListResponse<Invite>>('/invites', await getToken())).items,

  createInvite: async (email: string, role: Role): Promise<void> => {
    await request<unknown>('/invites', await getToken(), {
      method: 'POST',
      body: { email, role },
    });
  },
});

export type Api = ReturnType<typeof createApi>;
