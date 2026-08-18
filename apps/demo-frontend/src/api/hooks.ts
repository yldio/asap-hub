import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';

import { useApi } from './ApiProvider';
import { ApiError } from './client';
import type { Folder, Invite, Me, Role, Video, VideoAccess } from './types';

const noRetryOnClientError = (
  failureCount: number,
  error: unknown,
): boolean => {
  if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
    return false;
  }
  return failureCount < 2;
};

export const useMe = (enabled: boolean): UseQueryResult<Me, unknown> => {
  const api = useApi();
  return useQuery({
    queryKey: ['me'],
    queryFn: () => api.getMe(),
    enabled,
    retry: noRetryOnClientError,
    staleTime: 5 * 60 * 1000,
  });
};

export const useFolders = (): UseQueryResult<Folder[], unknown> => {
  const api = useApi();
  return useQuery({
    queryKey: ['folders'],
    queryFn: () => api.listFolders(),
    retry: noRetryOnClientError,
  });
};

export const useVideos = (
  folderId?: string,
): UseQueryResult<Video[], unknown> => {
  const api = useApi();
  return useQuery({
    queryKey: ['videos', folderId ?? null],
    queryFn: () => api.listVideos(folderId),
    retry: noRetryOnClientError,
  });
};

export const useVideo = (id: string): UseQueryResult<Video, unknown> => {
  const api = useApi();
  return useQuery({
    queryKey: ['video', id],
    queryFn: () => api.getVideo(id),
    enabled: Boolean(id),
    retry: noRetryOnClientError,
  });
};

export const useVideoAccess = (
  id: string,
): UseQueryResult<VideoAccess, unknown> => {
  const api = useApi();
  return useQuery({
    queryKey: ['video-access', id],
    queryFn: () => api.requestAccess(id),
    retry: false,
    staleTime: 10 * 60 * 1000,
  });
};

export const useInvites = (): UseQueryResult<Invite[], unknown> => {
  const api = useApi();
  return useQuery({
    queryKey: ['invites'],
    queryFn: () => api.listInvites(),
    retry: noRetryOnClientError,
  });
};

export const useCreateInvite = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, role }: { email: string; role: Role }) =>
      api.createInvite(email, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invites'] }),
  });
};

export const useCreateFolder = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => api.createFolder(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['folders'] }),
  });
};
