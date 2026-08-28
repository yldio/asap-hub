import {
  Banner,
  Canvas,
  Clip,
  NarrationClip,
  insertClipAt,
  moveClip,
  removeClip,
  SourceClip,
  splitAt,
  Timeline,
  Transition,
  trimClip,
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
      assetDurationMs: number;
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
  | { type: 'setCanvas'; canvas: Canvas }
  | { type: 'replaceTimeline'; timeline: Timeline };

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
        narration: timeline.narration.map((clip) =>
          clip.id === action.narrationId
            ? { ...clip, ...action.change, id: clip.id }
            : clip,
        ),
      };

    case 'removeNarration':
      return {
        ...timeline,
        narration: timeline.narration.filter(
          (clip) => clip.id !== action.narrationId,
        ),
      };

    case 'setCanvas':
      return timeline.canvas.width === action.canvas.width &&
        timeline.canvas.height === action.canvas.height &&
        timeline.canvas.fps === action.canvas.fps
        ? timeline
        : { ...timeline, canvas: action.canvas };

    case 'replaceTimeline':
      return action.timeline;

    default:
      return timeline;
  }
};
