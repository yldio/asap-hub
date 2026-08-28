import { Canvas, Zoom } from '../schema';
import { secondsFromMs } from './filters';

export const zoomDurationMs = (zoom: Zoom): number =>
  zoom.rampInMs + zoom.holdMs + zoom.rampOutMs;

// a zoom that never leaves 1x, or that has no time to ramp, would only cost a
// rescale of every frame
const changesTheFrame = (zoom: Zoom): boolean =>
  zoom.scale > 1 && zoomDurationMs(zoom) > 0;

export const clipZooms = (zooms: Zoom[], clipId: string): Zoom[] =>
  zooms.filter((zoom) => zoom.clipId === clipId && changesTheFrame(zoom));

const gain = (value: number): string => value.toFixed(3);

const unit = (value: number): string => value.toFixed(4);

// zoompan writes its own constant rate timestamps, so the clip is pinned to the
// canvas rate first and the output frame count is the clock
const timeExpression = (canvas: Canvas): string => `on/${canvas.fps}`;

// the preview's easeInOut, with (-2u+2)^2/2 written as 2(1-u)^2
const easeExpression = (zoom: Zoom, ramp: string): string =>
  zoom.easing === 'linear'
    ? ramp
    : `if(lt(${ramp},0.5),2*${ramp}*${ramp},1-2*(1-${ramp})*(1-${ramp}))`;

const rampExpression = (
  zoom: Zoom,
  time: string,
  fromMs: number,
  spanMs: number,
): string =>
  easeExpression(
    zoom,
    `((${time}-${secondsFromMs(fromMs)})/${secondsFromMs(spanMs)})`,
  );

// 0 at rest and 1 fully in, exactly as the preview's progressAt: nothing outside
// the zoom's own window, eased over each ramp, held in between
const progressExpression = (zoom: Zoom, time: string): string => {
  const holdStartMs = zoom.startMs + zoom.rampInMs;
  const holdEndMs = holdStartMs + zoom.holdMs;
  const endMs = holdEndMs + zoom.rampOutMs;
  const rampIn =
    zoom.rampInMs === 0
      ? '1'
      : rampExpression(zoom, time, zoom.startMs, zoom.rampInMs);
  const rampOut =
    zoom.rampOutMs === 0
      ? '0'
      : `1-${rampExpression(zoom, time, holdEndMs, zoom.rampOutMs)}`;

  return `if(between(${time},${secondsFromMs(zoom.startMs)},${secondsFromMs(
    endMs,
  )}),if(lt(${time},${secondsFromMs(
    holdStartMs,
  )}),${rampIn},if(lt(${time},${secondsFromMs(holdEndMs)}),1,${rampOut})),0)`;
};

const gainExpression = (zoom: Zoom, time: string): string =>
  `${gain(zoom.scale - 1)}*${progressExpression(zoom, time)}`;

const scaleExpression = (gains: string[]): string => `1+${gains.join('+')}`;

// The browser scales the picture about the focus point, which leaves the source
// point at focus*(1-1/scale) of the frame at the top left of what stays
// visible: the same window zoompan crops, in input pixels. Two zooms at once
// each contribute their own offset, which is what the single zoom case reduces
// to, because a zoom at rest contributes nothing.
const offsetExpression = (
  gains: string[],
  focus: number[],
  size: 'iw' | 'ih',
): string =>
  gains.length === 1
    ? `${unit(focus[0] ?? 0)}*(${size}-${size}/zoom)`
    : gains
        .map(
          (each, position) =>
            `${unit(focus[position] ?? 0)}*(${size}-${size}/(1+${each}))`,
        )
        .join('+');

export const zoomFilters = (clip: Zoom[], canvas: Canvas): string[] => {
  if (clip.length === 0) {
    return [];
  }

  const time = timeExpression(canvas);
  const gains = clip.map((zoom) => gainExpression(zoom, time));
  const scale = scaleExpression(gains);
  const x = offsetExpression(
    gains,
    clip.map((zoom) => zoom.focus.x),
    'iw',
  );
  const y = offsetExpression(
    gains,
    clip.map((zoom) => zoom.focus.y),
    'ih',
  );

  return [
    `fps=${canvas.fps}`,
    `zoompan=z='${scale}':x='${x}':y='${y}':d=1:s=${canvas.width}x${canvas.height}:fps=${canvas.fps}`,
  ];
};
