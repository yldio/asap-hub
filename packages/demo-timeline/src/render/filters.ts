import { ClipPlacement } from '../clips';
import { Canvas, Clip, Transition } from '../schema';

export const secondsFromMs = (ms: number): string => (ms / 1000).toFixed(3);

export const chain = (filters: string[]): string => filters.join(',');

export const label = (name: string): string => `[${name}]`;

export const graph = (segments: string[]): string => segments.join(';');

export const filterSegment = (
  inputs: string[],
  filters: string[],
  output: string,
): string =>
  `${inputs.map(label).join('')}${chain(filters)}${label(output)}`;

export const fitToCanvasFilters = (canvas: Canvas): string[] => [
  `scale=${canvas.width}:${canvas.height}:force_original_aspect_ratio=decrease:flags=lanczos`,
  `pad=${canvas.width}:${canvas.height}:(ow-iw)/2:(oh-ih)/2:color=black`,
  'setsar=1',
];

export type VideoFilterContext = { canvas: Canvas; placement: ClipPlacement };

export type VideoFilterContributor = (context: VideoFilterContext) => string[];

const fitToCanvas: VideoFilterContributor = ({ canvas, placement }) =>
  placement.clip.kind === 'source' ? fitToCanvasFilters(canvas) : ['setsar=1'];

// zooms and cursor effects join this list later; every contributor returns the
// filters it needs on the clip's own video, in chain order
export const videoFilterContributors: VideoFilterContributor[] = [fitToCanvas];

export const videoFilters = (context: VideoFilterContext): string[] =>
  videoFilterContributors.flatMap((contribute) => contribute(context));

// screen recordings are variable frame rate, and concat or xfade over VFR
// desyncs the audio, so every stage one clip is resampled to a constant rate
export const resampleFilter = 'aresample=async=1:first_pts=0';

export const clipHasAudio = (clip: Clip): boolean =>
  clip.kind === 'title' || clip.volume > 0;

export const clipAudioFilters = (clip: Clip): string[] =>
  clip.kind === 'source' && clip.volume !== 1
    ? [`volume=${clip.volume}`, resampleFilter]
    : [resampleFilter];

export const overlayFadeMs = 300;

const overlayFadeFilters = (
  visibleStartMs: number,
  visibleEndMs: number,
): string[] => {
  const fadeMs = Math.min(
    overlayFadeMs,
    Math.floor((visibleEndMs - visibleStartMs) / 2),
  );
  if (fadeMs <= 0) {
    return [];
  }
  return [
    `fade=t=in:st=${secondsFromMs(visibleStartMs)}:d=${secondsFromMs(fadeMs)}:alpha=1`,
    `fade=t=out:st=${secondsFromMs(visibleEndMs - fadeMs)}:d=${secondsFromMs(fadeMs)}:alpha=1`,
  ];
};

export const overlayInputFilters = (
  visible?: { startMs: number; endMs: number },
): string[] =>
  visible
    ? ['format=rgba', ...overlayFadeFilters(visible.startMs, visible.endMs)]
    : ['format=rgba'];

// the preset draws itself at the right place on a canvas sized PNG, so the
// overlay always composites at the origin
export const overlayOrigin = '0:0';

export const overlayFilter = (visible?: {
  startMs: number;
  endMs: number;
}): string =>
  visible
    ? `overlay=${overlayOrigin}:enable='between(t,${secondsFromMs(visible.startMs)},${secondsFromMs(visible.endMs)})'`
    : `overlay=${overlayOrigin}`;

const xfadeNames: Record<Exclude<Transition['type'], 'cut'>, string> = {
  crossfade: 'fade',
  slide: 'slideleft',
};

export const xfadeTransition = (transition: Transition | undefined): string =>
  transition && transition.type !== 'cut'
    ? xfadeNames[transition.type]
    : xfadeNames.crossfade;
