import { z } from 'zod';

export const roleSchema = z.enum(['creator', 'member']);

export const chapterSchema = z.object({
  startMs: z.number().int().nonnegative(),
  title: z.string().min(1),
});

export const createFolderSchema = z.object({
  name: z.string().min(1).max(120),
});

export const renameFolderSchema = z.object({
  name: z.string().trim().min(1).max(80),
});

export const bulkMoveSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(100),
  folderId: z.string().min(1),
});

export const bulkDeleteSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(100),
});

export const updateVideoSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  folderId: z.string().min(1).optional(),
  chapters: z.array(chapterSchema).optional(),
  recordedAt: z.string().min(1).optional(),
  version: z.number().int().nonnegative(),
});

export const publishVideoSchema = z.object({
  version: z.number().int().nonnegative(),
});

export const createUploadSchema = z.object({
  title: z.string().min(1).max(300),
  folderId: z.string().min(1).optional(),
  recordedAt: z.string().min(1).optional(),
});

export const uploadPartsSchema = z.object({
  uploadId: z.string().min(1),
  partNumbers: z.array(z.number().int().positive()).min(1),
});

export const completeUploadSchema = z.object({
  uploadId: z.string().min(1),
  parts: z
    .array(
      z.object({
        partNumber: z.number().int().positive(),
        eTag: z.string().min(1),
      }),
    )
    .min(1),
});

export const createInviteSchema = z.object({
  email: z.string().email(),
  role: roleSchema,
});
