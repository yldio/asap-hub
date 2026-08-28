import {
  Banner,
  Canvas,
  Clip,
  CursorEffect,
  CursorLayer,
  NarrationClip,
  insertClipAt,
  moveClip,
  removeClip,
  SourceClip,
  splitAt,
  Timeline,
  Transition,
  trimClip,
  Zoom,
} from '@asap-hub/demo-timeline';

export type TimelineAction =
  | {
      type: 'addClip';
      assetId: string;
      durationMs: number;
      clipId: string;
      index?: number;
    }
  | { type: 'removeClip'; clipId: string }
  | { type: 'moveClip'; clipId: string; toIndex: number }
  | {
      type: 'trimClip';
      clipId: string;
      inMs?: number;
      outMs?: number;
      // absent until the ingest has probed the asset
      assetDurationMs?: number;
    }
  | { type: 'splitAt'; tMs: number; clipId: string }
  | { type: 'duplicateClip'; clipId: string; newClipId: string }
  | { type: 'toggleMute'; clipId: string }
  | { type: 'setClipVolume'; clipId: string; volume: number }
  | { type: 'setTransition'; clipId: string; transition?: Transition }
  | {
      type: 'addTitleCard';
      clipId: string;
      index: number;
      text: string;
      durationMs: number;
    }
  | {
      type: 'updateTitleCard';
      clipId: string;
      text?: string;
      subtitle?: string;
      durationMs?: number;
      fadeInMs?: number;
      fadeOutMs?: number;
    }
  | { type: 'addBanner'; banner: Banner }
  | { type: 'updateBanner'; bannerId: string; change: Partial<Banner> }
  | { type: 'removeBanner'; bannerId: string }
  | { type: 'addNarration'; narration: NarrationClip }
  | {
      type: 'updateNarration';
      narrationId: string;
      change: Partial<NarrationClip>;
    }
  | { type: 'removeNarration'; narrationId: string }
  | { type: 'addZoom'; zoom: Zoom }
  | { type: 'updateZoom'; zoomId: string; change: Partial<Zoom> }
  | { type: 'removeZoom'; zoomId: string }
  | { type: 'addCursorEffect'; clipId: string; effect: CursorEffect }
  | {
      type: 'updateCursorEffect';
      clipId: string;
      effectId: string;
      change: Partial<CursorEffect>;
    }
  | { type: 'removeCursorEffect'; clipId: string; effectId: string }
  | {
      type: 'applyCapture';
      clipId: string;
      path: CursorLayer['path'];
      effects: CursorEffect[];
    }
  | {
      type: 'addChapter';
      id: string;
      clipId: string;
      offsetMs: number;
      title: string;
    }
  | { type: 'updateChapter'; chapterId: string; title: string }
  | { type: 'removeChapter'; chapterId: string }
  | { type: 'setCanvas'; canvas: Canvas };

const withClips = (timeline: Timeline, clips: Clip[]): Timeline => {
  const clipIds = new Set(clips.map((clip) => clip.id));
  const survives = <T extends { clipId: string }>(item: T) =>
    clipIds.has(item.clipId);

  // clip-anchored tracks cannot outlive their clip, so removing one takes its
  // zooms, cursor data and chapter markers with it
  return {
    ...timeline,
    clips,
    zooms: timeline.zooms.filter(survives),
    cursor: timeline.cursor.filter(survives),
    chapters: timeline.chapters.filter(survives),
  };
};

// a clip gains its cursor layer the first time something is put on it
const withCursorLayer = (
  timeline: Timeline,
  clipId: string,
  change: (layer: Timeline['cursor'][number]) => Timeline['cursor'][number],
): Timeline['cursor'] => {
  const existing = timeline.cursor.find((layer) => layer.clipId === clipId);
  if (!existing) {
    return [
      ...timeline.cursor,
      change({ clipId, offsetMs: 0, path: [], effects: [] }),
    ];
  }
  return timeline.cursor.map((layer) =>
    layer.clipId === clipId ? change(layer) : layer,
  );
};

const mapClip = (
  timeline: Timeline,
  clipId: string,
  change: (clip: SourceClip) => SourceClip,
): Timeline =>
  withClips(
    timeline,
    timeline.clips.map((clip) =>
      clip.id === clipId && clip.kind === 'source' ? change(clip) : clip,
    ),
  );

export const timelineReducer = (
  timeline: Timeline,
  action: TimelineAction,
): Timeline => {
  switch (action.type) {
    case 'addClip': {
      const clip: SourceClip = {
        kind: 'source',
        id: action.clipId,
        assetId: action.assetId,
        inMs: 0,
        outMs: action.durationMs,
        volume: 1,
      };
      return withClips(
        timeline,
        insertClipAt(
          timeline.clips,
          clip,
          action.index ?? timeline.clips.length,
        ),
      );
    }

    case 'removeClip':
      return withClips(timeline, removeClip(timeline.clips, action.clipId));

    case 'moveClip':
      return withClips(
        timeline,
        moveClip(timeline.clips, action.clipId, action.toIndex),
      );

    case 'trimClip':
      return withClips(
        timeline,
        trimClip(
          timeline.clips,
          action.clipId,
          { inMs: action.inMs, outMs: action.outMs },
          action.assetDurationMs,
        ),
      );

    case 'splitAt':
      return withClips(
        timeline,
        splitAt(timeline.clips, action.tMs, action.clipId),
      );

    case 'duplicateClip': {
      const index = timeline.clips.findIndex(
        (clip) => clip.id === action.clipId,
      );
      const original = timeline.clips[index];
      if (!original) {
        return timeline;
      }
      // the copy follows the original and starts on a cut, whatever the
      // original blended into
      const copy = {
        ...original,
        id: action.newClipId,
        transitionIn: undefined,
      };
      return withClips(timeline, insertClipAt(timeline.clips, copy, index + 1));
    }

    case 'toggleMute':
      return mapClip(timeline, action.clipId, (clip) => ({
        ...clip,
        volume: clip.volume === 0 ? 1 : 0,
      }));

    case 'setClipVolume':
      return mapClip(timeline, action.clipId, (clip) => ({
        ...clip,
        volume: action.volume,
      }));

    case 'setTransition':
      return withClips(
        timeline,
        timeline.clips.map((clip, index) =>
          clip.id === action.clipId && index > 0
            ? { ...clip, transitionIn: action.transition }
            : clip,
        ),
      );

    case 'addTitleCard':
      return withClips(
        timeline,
        insertClipAt(
          timeline.clips,
          {
            kind: 'title',
            id: action.clipId,
            durationMs: action.durationMs,
            preset: 'centered',
            text: action.text,
          },
          action.index,
        ),
      );

    case 'updateTitleCard':
      return withClips(
        timeline,
        timeline.clips.map((clip) =>
          clip.id === action.clipId && clip.kind === 'title'
            ? {
                ...clip,
                text: action.text ?? clip.text,
                subtitle: action.subtitle ?? clip.subtitle,
                durationMs: action.durationMs ?? clip.durationMs,
                fadeInMs: action.fadeInMs ?? clip.fadeInMs,
                fadeOutMs: action.fadeOutMs ?? clip.fadeOutMs,
              }
            : clip,
        ),
      );

    case 'addBanner':
      return { ...timeline, banners: [...timeline.banners, action.banner] };

    case 'updateBanner':
      return {
        ...timeline,
        banners: timeline.banners.map((banner) =>
          banner.id === action.bannerId
            ? { ...banner, ...action.change, id: banner.id }
            : banner,
        ),
      };

    case 'removeBanner':
      return {
        ...timeline,
        banners: timeline.banners.filter(
          (banner) => banner.id !== action.bannerId,
        ),
      };

    case 'addNarration':
      return {
        ...timeline,
        narration: [...timeline.narration, action.narration],
      };

    case 'updateNarration':
      return {
        ...timeline,
        narration: timeline.narration.map((take) =>
          take.id === action.narrationId
            ? { ...take, ...action.change, id: take.id, assetId: take.assetId }
            : take,
        ),
      };

    case 'removeNarration':
      return {
        ...timeline,
        narration: timeline.narration.filter(
          (take) => take.id !== action.narrationId,
        ),
      };

    case 'addZoom':
      return { ...timeline, zooms: [...timeline.zooms, action.zoom] };

    case 'updateZoom':
      return {
        ...timeline,
        zooms: timeline.zooms.map((zoom) =>
          zoom.id === action.zoomId
            ? { ...zoom, ...action.change, id: zoom.id, clipId: zoom.clipId }
            : zoom,
        ),
      };

    case 'removeZoom':
      return {
        ...timeline,
        zooms: timeline.zooms.filter((zoom) => zoom.id !== action.zoomId),
      };

    case 'addCursorEffect':
      return {
        ...timeline,
        cursor: withCursorLayer(timeline, action.clipId, (layer) => ({
          ...layer,
          effects: [...layer.effects, action.effect],
        })),
      };

    case 'updateCursorEffect':
      return {
        ...timeline,
        cursor: withCursorLayer(timeline, action.clipId, (layer) => ({
          ...layer,
          effects: layer.effects.map((effect) =>
            effect.id === action.effectId
              ? {
                  ...effect,
                  ...action.change,
                  id: effect.id,
                  // a hand edit protects the effect from the next re-derive
                  origin:
                    effect.origin === 'derived'
                      ? 'derived-edited'
                      : effect.origin,
                }
              : effect,
          ),
        })),
      };

    case 'removeCursorEffect':
      return {
        ...timeline,
        cursor: withCursorLayer(timeline, action.clipId, (layer) => ({
          ...layer,
          effects: layer.effects.filter(
            (effect) => effect.id !== action.effectId,
          ),
        })),
      };

    case 'applyCapture':
      return {
        ...timeline,
        cursor: withCursorLayer(timeline, action.clipId, (layer) => ({
          ...layer,
          path: action.path,
          effects: action.effects,
        })),
      };

    case 'addChapter':
      return {
        ...timeline,
        chapters: [
          ...timeline.chapters,
          {
            id: action.id,
            clipId: action.clipId,
            offsetMs: action.offsetMs,
            title: action.title,
          },
        ],
      };

    case 'updateChapter':
      return {
        ...timeline,
        chapters: timeline.chapters.map((chapter) =>
          chapter.id === action.chapterId
            ? { ...chapter, title: action.title }
            : chapter,
        ),
      };

    case 'removeChapter':
      return {
        ...timeline,
        chapters: timeline.chapters.filter(
          (chapter) => chapter.id !== action.chapterId,
        ),
      };

    case 'setCanvas':
      return timeline.canvas.width === action.canvas.width &&
        timeline.canvas.height === action.canvas.height &&
        timeline.canvas.fps === action.canvas.fps
        ? timeline
        : { ...timeline, canvas: action.canvas };

    default:
      return timeline;
  }
};
