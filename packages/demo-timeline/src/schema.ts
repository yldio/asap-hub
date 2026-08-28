import { z } from 'zod';

export const currentSchemaVersion = 1;

export const limits = {
  clips: 200,
  banners: 200,
  narration: 100,
  zooms: 200,
  cursorLayers: 200,
  cursorEffects: 500,
  cursorPathPoints: 20000,
  chapters: 500,
  textLength: 200,
  transitionMs: 3000,
  offsetMs: 60000,
  minClipMs: 100,
  maxTimelineMs: 4 * 60 * 60 * 1000,
} as const;

const idSchema = z.string().min(1).max(64);
const msSchema = z.number().int().min(0).max(limits.maxTimelineMs);
const unitSchema = z.number().min(0).max(1);
const textSchema = z.string().max(limits.textLength);
const volumeSchema = z.number().min(0).max(2);

export const pointSchema = z.object({ x: unitSchema, y: unitSchema });

export const transitionSchema = z.object({
  type: z.enum(['cut', 'crossfade', 'slide']),
  durationMs: z.number().int().min(0).max(limits.transitionMs),
});

export const titlePresets = ['centered'] as const;
export const bannerPresets = ['lowerThird'] as const;

export const sourceClipSchema = z.object({
  kind: z.literal('source'),
  id: idSchema,
  assetId: idSchema,
  inMs: msSchema,
  outMs: msSchema,
  volume: volumeSchema,
  transitionIn: transitionSchema.optional(),
});

export const titleClipSchema = z.object({
  kind: z.literal('title'),
  id: idSchema,
  durationMs: msSchema,
  preset: z.enum(titlePresets),
  text: textSchema,
  subtitle: textSchema.optional(),
  transitionIn: transitionSchema.optional(),
});

export const clipSchema = z.discriminatedUnion('kind', [
  sourceClipSchema,
  titleClipSchema,
]);

export const bannerSchema = z.object({
  id: idSchema,
  startMs: msSchema,
  durationMs: msSchema,
  preset: z.enum(bannerPresets),
  text: textSchema,
  subtitle: textSchema.optional(),
  position: z.enum(['top', 'bottom']),
  animation: z.enum(['fade', 'slide']),
});

export const narrationClipSchema = z.object({
  id: idSchema,
  assetId: idSchema,
  startMs: msSchema,
  inMs: msSchema,
  outMs: msSchema,
  volume: volumeSchema,
});

// clip-anchored, with clip-local times, so reordering and trimming carry it along
export const zoomSchema = z.object({
  id: idSchema,
  clipId: idSchema,
  startMs: msSchema,
  rampInMs: msSchema,
  holdMs: msSchema,
  rampOutMs: msSchema,
  focus: pointSchema,
  scale: z.number().min(1).max(4),
  easing: z.enum(['linear', 'easeInOut']),
});

export const chapterMarkerSchema = z.object({
  id: idSchema,
  clipId: idSchema,
  offsetMs: msSchema,
  title: textSchema,
});

export const cursorEffectSchema = z.object({
  id: idSchema,
  tMs: msSchema,
  type: z.enum(['ripple', 'spotlight', 'zoom']),
  point: pointSchema,
  origin: z.enum(['derived', 'derived-edited', 'manual']),
  sourceEventId: idSchema.optional(),
});

export const cursorPathPointSchema = z.object({
  tMs: msSchema,
  x: unitSchema,
  y: unitSchema,
});

export const cursorLayerSchema = z.object({
  clipId: idSchema,
  offsetMs: z.number().int().min(-limits.offsetMs).max(limits.offsetMs),
  path: z.array(cursorPathPointSchema).max(limits.cursorPathPoints),
  effects: z.array(cursorEffectSchema).max(limits.cursorEffects),
});

export const canvasSchema = z.object({
  width: z.number().int().min(640).max(3840),
  height: z.number().int().min(360).max(2160),
  fps: z.union([z.literal(24), z.literal(30), z.literal(60)]),
});

const timelineShape = z.object({
  schemaVersion: z.literal(currentSchemaVersion),
  canvas: canvasSchema,
  clips: z.array(clipSchema).max(limits.clips),
  banners: z.array(bannerSchema).max(limits.banners),
  narration: z.array(narrationClipSchema).max(limits.narration),
  zooms: z.array(zoomSchema).max(limits.zooms),
  cursor: z.array(cursorLayerSchema).max(limits.cursorLayers),
  chapters: z.array(chapterMarkerSchema).max(limits.chapters),
});

type TrackedId = { id: string; path: (string | number)[] };

const trackIds = <T extends { id: string }>(
  entries: T[],
  track: string,
): TrackedId[] =>
  entries.map((entry, index) => ({ id: entry.id, path: [track, index, 'id'] }));

// the second and later occurrences: the first one is the id's rightful owner
const repeats = (tracked: TrackedId[]): TrackedId[] => {
  const seen = new Set<string>();
  return tracked.filter(({ id }) => {
    const repeat = seen.has(id);
    seen.add(id);
    return repeat;
  });
};

// structural rules live in the schemas; these are the rules that need the whole document
export const timelineSchema = timelineShape.superRefine((timeline, context) => {
  timeline.clips.forEach((clip, index) => {
    if (clip.kind === 'source' && clip.outMs <= clip.inMs) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['clips', index, 'outMs'],
        message: 'outMs must be greater than inMs',
      });
    }
  });

  const ids = [
    ...trackIds(timeline.clips, 'clips'),
    ...trackIds(timeline.banners, 'banners'),
    ...trackIds(timeline.narration, 'narration'),
    ...trackIds(timeline.zooms, 'zooms'),
  ];
  repeats(ids).forEach(({ id, path }) => {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path,
      message: `duplicate id ${id}`,
    });
  });

  const clipIds = new Set(timeline.clips.map((clip) => clip.id));
  const requireKnownClip = (
    clipId: string,
    path: (string | number)[],
  ): void => {
    if (!clipIds.has(clipId)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path,
        message: `references unknown clip ${clipId}`,
      });
    }
  };

  timeline.cursor.forEach((layer, index) =>
    requireKnownClip(layer.clipId, ['cursor', index, 'clipId']),
  );
  timeline.zooms.forEach((zoom, index) =>
    requireKnownClip(zoom.clipId, ['zooms', index, 'clipId']),
  );
  timeline.chapters.forEach((chapter, index) =>
    requireKnownClip(chapter.clipId, ['chapters', index, 'clipId']),
  );
});

export type Point = z.infer<typeof pointSchema>;
export type Transition = z.infer<typeof transitionSchema>;
export type TitlePreset = (typeof titlePresets)[number];
export type BannerPreset = (typeof bannerPresets)[number];
export type SourceClip = z.infer<typeof sourceClipSchema>;
export type TitleClip = z.infer<typeof titleClipSchema>;
export type Clip = z.infer<typeof clipSchema>;
export type Banner = z.infer<typeof bannerSchema>;
export type NarrationClip = z.infer<typeof narrationClipSchema>;
export type Zoom = z.infer<typeof zoomSchema>;
export type ChapterMarker = z.infer<typeof chapterMarkerSchema>;
export type CursorEffect = z.infer<typeof cursorEffectSchema>;
export type CursorPathPoint = z.infer<typeof cursorPathPointSchema>;
export type CursorLayer = z.infer<typeof cursorLayerSchema>;
export type Canvas = z.infer<typeof canvasSchema>;
export type Timeline = z.infer<typeof timelineShape>;
