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
  parentId?: string;
};

export const rootFolderId = 'ROOT';

// PATCH /folders/:id sentinel meaning "move to the top level"
export const topLevelParentId = 'TOP';

export type FolderCounts = Record<string, number>;

export type BulkMoveResult = { moved: string[]; missing: string[] };

export type BulkDeleteResult = { deleted: string[]; missing: string[] };

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
  processingError?: string;
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

export type CreatedUpload = {
  videoId: string;
  uploadId: string;
  key: string;
  partSize: number;
};

export type PartUrl = { partNumber: number; url: string };

export type UploadedPart = { partNumber: number; eTag: string };

export type VideoPatch = {
  title?: string;
  folderId?: string;
  chapters?: Chapter[];
  recordedAt?: string;
  version: number;
};

export type Lease = {
  lockedBy: string;
  lockedByName: string;
  lockExpiresAt: string;
};
