import { Clip, limits, Transition } from './schema';

export type ClipPlacement = {
  clip: Clip;
  index: number;
  startMs: number;
  endMs: number;
  durationMs: number;
  overlapMs: number;
};

export const clipDurationMs = (clip: Clip): number =>
  clip.kind === 'source'
    ? Math.max(0, clip.outMs - clip.inMs)
    : clip.durationMs;

const isVisualTransition = (transition: Transition | undefined): boolean =>
  transition !== undefined && transition.type !== 'cut';

// a transition plays over both neighbours, so it can never eat more than half of either
export const transitionOverlapMs = (
  clip: Clip,
  previous: Clip | undefined,
): number => {
  if (!previous || !isVisualTransition(clip.transitionIn)) {
    return 0;
  }
  const shortest = Math.min(clipDurationMs(clip), clipDurationMs(previous));
  return Math.min(clip.transitionIn?.durationMs ?? 0, Math.floor(shortest / 2));
};

export const layoutClips = (clips: Clip[]): ClipPlacement[] =>
  clips.reduce<ClipPlacement[]>((placements, clip, index) => {
    const previous = placements[index - 1];
    const overlapMs = transitionOverlapMs(clip, clips[index - 1]);
    const durationMs = clipDurationMs(clip);
    const startMs = previous ? previous.endMs - overlapMs : 0;

    return [
      ...placements,
      {
        clip,
        index,
        startMs,
        endMs: startMs + durationMs,
        durationMs,
        overlapMs,
      },
    ];
  }, []);

export const timelineDurationMs = (clips: Clip[]): number =>
  layoutClips(clips).at(-1)?.endMs ?? 0;

export const placementAt = (
  placements: ClipPlacement[],
  tMs: number,
): ClipPlacement | undefined =>
  placements.find(
    (placement, index) =>
      tMs >= placement.startMs &&
      (tMs < placement.endMs || index === placements.length - 1),
  );

export const sourceTimeAt = (
  placement: ClipPlacement,
  tMs: number,
): number | undefined =>
  placement.clip.kind === 'source'
    ? placement.clip.inMs + (tMs - placement.startMs)
    : undefined;

export const clipLocalMs = (placement: ClipPlacement, tMs: number): number =>
  tMs - placement.startMs;

export const findClip = (clips: Clip[], clipId: string): Clip | undefined =>
  clips.find((clip) => clip.id === clipId);

export const insertClipAt = (
  clips: Clip[],
  clip: Clip,
  index: number,
): Clip[] => {
  const target = Math.max(0, Math.min(index, clips.length));
  return [...clips.slice(0, target), clip, ...clips.slice(target)];
};

// the first clip can never have an incoming transition, there is nothing to blend with
const dropLeadingTransition = (clips: Clip[]): Clip[] =>
  clips.map((clip, index) =>
    index === 0 && clip.transitionIn
      ? { ...clip, transitionIn: undefined }
      : clip,
  );

export const removeClip = (clips: Clip[], clipId: string): Clip[] =>
  dropLeadingTransition(clips.filter((clip) => clip.id !== clipId));

export const moveClip = (
  clips: Clip[],
  clipId: string,
  toIndex: number,
): Clip[] => {
  const from = clips.findIndex((clip) => clip.id === clipId);
  const clip = clips[from];
  if (!clip) {
    return clips;
  }
  const without = clips.filter((_, index) => index !== from);
  return dropLeadingTransition(
    insertClipAt(without, clip, Math.max(0, Math.min(toIndex, without.length))),
  );
};

export type TrimChange = { inMs?: number; outMs?: number };

export const trimClip = (
  clips: Clip[],
  clipId: string,
  change: TrimChange,
  assetDurationMs: number,
): Clip[] =>
  clips.map((clip) => {
    if (clip.id !== clipId || clip.kind !== 'source') {
      return clip;
    }

    const inMs = Math.max(0, Math.round(change.inMs ?? clip.inMs));
    const outMs = Math.min(
      assetDurationMs,
      Math.round(change.outMs ?? clip.outMs),
    );

    return outMs - inMs < limits.minClipMs ? clip : { ...clip, inMs, outMs };
  });

const splitPieces = (clip: Clip, localMs: number): [Clip, Clip] | undefined => {
  const leftMs = localMs;
  const rightMs = clipDurationMs(clip) - localMs;
  if (leftMs < limits.minClipMs || rightMs < limits.minClipMs) {
    return undefined;
  }

  if (clip.kind === 'source') {
    const at = clip.inMs + leftMs;
    return [
      { ...clip, outMs: at },
      { ...clip, inMs: at, transitionIn: undefined },
    ];
  }

  return [
    { ...clip, durationMs: leftMs },
    { ...clip, durationMs: rightMs, transitionIn: undefined },
  ];
};

export const splitAt = (
  clips: Clip[],
  tMs: number,
  newClipId: string,
): Clip[] => {
  const placement = placementAt(layoutClips(clips), tMs);
  if (!placement) {
    return clips;
  }

  const pieces = splitPieces(placement.clip, clipLocalMs(placement, tMs));
  if (!pieces) {
    return clips;
  }

  const [left, right] = pieces;
  return [
    ...clips.slice(0, placement.index),
    left,
    { ...right, id: newClipId },
    ...clips.slice(placement.index + 1),
  ];
};
