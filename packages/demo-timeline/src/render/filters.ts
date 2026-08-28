import { ClipPlacement } from '../clips';
import { Fade, FadeRamps, resolveFade } from '../fade';
import { Canvas, Clip, Transition } from '../schema';

export const secondsFromMs = (ms: number): string => (ms / 1000).toFixed(3);

export const chain = (filters: string[]): string => filters.join(',');

export const label = (name: string): string => `[${name}]`;

export const graph = (segments: string[]): string => segments.join(';');

export const filterSegment = (
  inputs: string[],
  filters: string[],
  output: string,
): string => `${inputs.map(label).join('')}${chain(filters)}${label(output)}`;

export const fitToCanvasFilters = (canvas: Canvas): string[] => [
  `scale=${canvas.width}:${canvas.height}:force_original_aspect_ratio=decrease:flags=lanczos`,
  `pad=${canvas.width}:${canvas.height}:(ow-iw)/2:(oh-ih)/2:color=black`,
  'setsar=1',
];

export type VideoFilterContext = { canvas: Canvas; placement: ClipPlacement };

// every filter a clip's own video needs, in chain order; a title card's
// background is generated at canvas size already, so it only needs square pixels
export const videoFilters = ({
  canvas,
  placement,
}: VideoFilterContext): string[] =>
  placement.clip.kind === 'source' ? fitToCanvasFilters(canvas) : ['setsar=1'];

// screen recordings are variable frame rate, and concat or xfade over VFR
// desyncs the audio, so every stage one clip is resampled to a constant rate
export const resampleFilter = 'aresample=async=1:first_pts=0';

export const audioSampleRate = 48000;

// concat rewrites the timebase of what it produces, and xfade refuses two
// inputs whose timebases differ, so both sides of a blend are pinned to one
export const timebaseFilter = 'settb=AVTB';

// concat and acrossfade refuse to join streams whose rate, layout or sample
// format differ, and a recording's own audio is often 44.1kHz mono while the
// silence generated for a title card is 48kHz stereo
export const audioFormatFilter = `aformat=sample_fmts=fltp:sample_rates=${audioSampleRate}:channel_layouts=stereo`;

export const clipAudioFilters = (clip: Clip): string[] =>
  clip.kind === 'source' && clip.volume !== 1
    ? [`volume=${clip.volume}`, resampleFilter, audioFormatFilter]
    : [resampleFilter, audioFormatFilter];

export type OverlayWindow = Fade & { startMs: number; endMs: number };

// a signed distance in pixels: the offset the overlay travels from and back to
export type OverlaySlide = { distancePx: number };

export const overlayFadeRamps = (visible: OverlayWindow): FadeRamps =>
  resolveFade(visible, visible.endMs - visible.startMs);

const overlayFadeFilters = (visible: OverlayWindow): string[] => {
  const { inMs, outMs } = overlayFadeRamps(visible);
  return [
    ...(inMs > 0
      ? [
          `fade=t=in:st=${secondsFromMs(visible.startMs)}:d=${secondsFromMs(
            inMs,
          )}:alpha=1`,
        ]
      : []),
    ...(outMs > 0
      ? [
          `fade=t=out:st=${secondsFromMs(
            visible.endMs - outMs,
          )}:d=${secondsFromMs(outMs)}:alpha=1`,
        ]
      : []),
  ];
};

export const overlayInputFilters = (visible?: OverlayWindow): string[] =>
  visible ? ['format=rgba', ...overlayFadeFilters(visible)] : ['format=rgba'];

// the preset draws itself at the right place on a canvas sized PNG, so the
// overlay always composites at the origin
export const overlayOrigin = '0:0';

// ramps the whole overlay from distancePx to zero over the fade in, holds it in
// place, then ramps back out; min and max clamp each ramp to its own window
const slideExpression = (
  distancePx: number,
  visible: OverlayWindow,
  { inMs, outMs }: FadeRamps,
): string =>
  `${distancePx}*(1-min(1,max(0,(t-${secondsFromMs(
    visible.startMs,
  )})/${secondsFromMs(inMs)}))+min(1,max(0,(t-${secondsFromMs(
    visible.endMs - outMs,
  )})/${secondsFromMs(outMs)})))`;

const overlayPosition = (
  visible: OverlayWindow,
  slide: OverlaySlide | undefined,
): string => {
  const ramps = overlayFadeRamps(visible);
  return slide && ramps.inMs > 0 && ramps.outMs > 0
    ? `x=0:y='${slideExpression(slide.distancePx, visible, ramps)}'`
    : overlayOrigin;
};

export const overlayFilter = (
  visible?: OverlayWindow,
  slide?: OverlaySlide,
): string =>
  visible
    ? `overlay=${overlayPosition(
        visible,
        slide,
      )}:enable='between(t,${secondsFromMs(visible.startMs)},${secondsFromMs(
        visible.endMs,
      )})'`
    : `overlay=${overlayOrigin}`;

const xfadeNames: Record<Exclude<Transition['type'], 'cut'>, string> = {
  crossfade: 'fade',
  slide: 'slideleft',
};

export const xfadeTransition = (transition: Transition | undefined): string =>
  transition && transition.type !== 'cut'
    ? xfadeNames[transition.type]
    : xfadeNames.crossfade;
