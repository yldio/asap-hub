export type Role = 'creator' | 'member' | 'admin';

export type UserStatus = 'active' | 'revoked';

export type Me = {
  sub: string;
  name: string;
  email: string;
  role: Role;
};

export type ManagedUser = {
  sub: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
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

export type BulkDeleteResult = {
  deleted: string[];
  missing: string[];
  locked: string[];
};

export type Chapter = {
  startMs: number;
  title: string;
};

export type VideoStatus = 'draft' | 'published';

// 'empty' is a studio project that has never been rendered
export type ProcessingState =
  | 'empty'
  | 'uploading'
  | 'processing'
  | 'ready'
  | 'failed';

export type VideoKind = 'upload' | 'studio';

export type RenderState =
  | 'queued'
  | 'rendering'
  | 'done'
  | 'failed'
  | 'cancelled';

export type TimelinePointer = {
  key: string;
  timelineVersion: number;
  schemaVersion: number;
  updatedAt: string;
};

export type RenderJob = {
  renderId: string;
  state: RenderState;
  timelineVersion: number;
  stage?: string;
  progress?: number;
  error?: string;
};

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
  kind: VideoKind;
  mediaPath?: string;
  timeline?: TimelinePointer;
  render?: RenderJob;
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

export type AssetKind = 'video' | 'audio';

export type AssetState = 'uploading' | 'preparing' | 'ready' | 'failed';

export type ProjectAsset = {
  assetId: string;
  kind: AssetKind;
  state: AssetState;
  mimeType: string;
  label: string;
  bytes?: number;
  durationMs?: number;
  width?: number;
  height?: number;
  error?: string;
  // server-issued playable path; the editor never builds media urls itself
  url?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreatedAsset = {
  assetId: string;
  uploadId: string;
  key: string;
  partSize: number;
};

export type SavedTimeline = {
  video: Video;
  timelineVersion: number;
};

export type Lease = {
  lockedBy: string;
  lockedByName: string;
  lockExpiresAt: string;
};
