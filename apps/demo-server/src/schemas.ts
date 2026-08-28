import { z } from 'zod';
import { isFolderId, isVideoId } from './routes/request';

// ids land in S3 keys, DynamoDB key templates and CloudFront policy resources,
// so the body-supplied ones are held to the same alphabet as the path params
const folderIdField = z
  .string()
  .refine(isFolderId, { message: 'invalid folder id' });

// a parent is always a real folder row, never the synthetic ROOT bucket
const parentIdField = z
  .string()
  .refine((value) => value !== 'ROOT' && isVideoId(value), {
    message: 'invalid parent folder id',
  });

export const maxChapters = 500;

export const roleSchema = z.enum(['creator', 'member', 'admin']);

export const userStatusSchema = z.enum(['active', 'revoked']);

export const chapterSchema = z.object({
  startMs: z.number().int().nonnegative(),
  title: z.string().min(1).max(300),
});

export const createFolderSchema = z.object({
  name: z.string().min(1).max(120),
  parentId: parentIdField.optional(),
});

// parentId 'TOP' moves the folder to the top level; omitting it leaves the parent untouched
export const updateFolderSchema = z
  .object({
    name: z.string().trim().min(1).max(80).optional(),
    parentId: parentIdField.optional(),
  })
  .refine(
    ({ name, parentId }) => name !== undefined || parentId !== undefined,
    {
      message: 'name or parentId is required',
    },
  );

export const bulkMoveSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(100),
  folderId: folderIdField,
});

export const bulkDeleteSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(100),
});

export const updateVideoSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  folderId: folderIdField.optional(),
  chapters: z.array(chapterSchema).max(maxChapters).optional(),
  recordedAt: z.string().min(1).optional(),
  version: z.number().int().nonnegative(),
});

export const publishVideoSchema = z.object({
  version: z.number().int().nonnegative(),
});

export const createUploadSchema = z.object({
  title: z.string().min(1).max(300),
  folderId: folderIdField.optional(),
  recordedAt: z.string().min(1).optional(),
});

export const uploadPartsSchema = z.object({
  uploadId: z.string().min(1).max(256),
  partNumbers: z.array(z.number().int().positive().max(10000)).min(1).max(1000),
});

export const completeUploadSchema = z.object({
  uploadId: z.string().min(1).max(256),
  parts: z
    .array(
      z.object({
        partNumber: z.number().int().positive().max(10000),
        eTag: z.string().min(1).max(256),
      }),
    )
    .min(1)
    .max(10000),
});

export const createProjectSchema = z.object({
  title: z.string().min(1).max(300),
  folderId: folderIdField.optional(),
  recordedAt: z.string().min(1).optional(),
});

// the document itself is validated by timelineSchema from @asap-hub/demo-timeline;
// this is the envelope the editor sends around it
export const saveTimelineSchema = z.object({
  timeline: z.unknown(),
  timelineVersion: z.number().int().nonnegative(),
  version: z.number().int().nonnegative(),
});

export const createAssetSchema = z.object({
  kind: z.enum(['video', 'audio']),
  mimeType: z.string().min(1).max(120),
  label: z.string().min(1).max(300),
  extension: z
    .string()
    .min(1)
    .max(8)
    .regex(/^[a-z0-9]+$/, 'invalid extension'),
});

export const assetPartsSchema = z.object({
  uploadId: z.string().min(1).max(256),
  partNumbers: z.array(z.number().int().positive().max(10000)).min(1).max(1000),
});

export const completeAssetSchema = z.object({
  uploadId: z.string().min(1).max(256),
  parts: z
    .array(
      z.object({
        partNumber: z.number().int().positive().max(10000),
        eTag: z.string().min(1).max(256),
      }),
    )
    .min(1)
    .max(10000),
});

export const createInviteSchema = z.object({
  email: z.string().email(),
  role: roleSchema,
});

export const updateUserSchema = z
  .object({
    role: roleSchema.optional(),
    status: userStatusSchema.optional(),
  })
  .refine(({ role, status }) => role !== undefined || status !== undefined, {
    message: 'role or status is required',
  });
