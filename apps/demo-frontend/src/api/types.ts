export type Role = 'creator' | 'member';

export type Me = {
  sub: string;
  name: string;
  email: string;
  role: Role;
};

export type Folder = {
  id: string;
  name: string;
};

export type Chapter = {
  startMs: number;
  title: string;
};

export type VideoStatus = 'draft' | 'published';

export type ProcessingState = 'uploading' | 'processing' | 'ready' | 'failed';

export type Video = {
  id: string;
  title: string;
  status: VideoStatus;
  folderId: string;
  recordedAt: string;
  durationMs: number;
  chapters: Chapter[];
  processingState: ProcessingState;
  createdBy: { sub: string; name: string };
  lockedBy?: string;
  lockedByName?: string;
  lockExpiresAt?: string;
  version: number;
};

export type VideoAccess = {
  streamUrl: string;
  spriteUrl: string;
  thumbnailsVttUrl: string;
};

export type Invite = {
  email: string;
  role: Role;
  createdAt: string;
  claimedBy?: string;
};

export type ListResponse<T> = { items: T[] };
