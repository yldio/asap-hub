import { Point } from '../schema';

const clampUnit = (value: number): number => Math.min(1, Math.max(0, value));

// four decimals is about a fifth of a pixel on a 4K frame, and keeps a long
// path from dominating the timeline document
export const quantise = (value: number): number =>
  Math.round(clampUnit(value) * 10000) / 10000;

// the capture viewport and the render frame rarely share an aspect ratio, and
// the renderer fits the recording inside the frame, so a captured point has to
// be fitted the same way or every effect drifts towards the letterbox
export const toFramePoint = (
  x: number,
  y: number,
  viewport: { width: number; height: number },
  frame: { width: number; height: number },
): Point | undefined => {
  if (
    viewport.width <= 0 ||
    viewport.height <= 0 ||
    frame.width <= 0 ||
    frame.height <= 0
  ) {
    return undefined;
  }

  const scale = Math.min(
    frame.width / viewport.width,
    frame.height / viewport.height,
  );
  const drawnWidth = (viewport.width * scale) / frame.width;
  const drawnHeight = (viewport.height * scale) / frame.height;

  return {
    x: quantise(
      (1 - drawnWidth) / 2 + clampUnit(x / viewport.width) * drawnWidth,
    ),
    y: quantise(
      (1 - drawnHeight) / 2 + clampUnit(y / viewport.height) * drawnHeight,
    ),
  };
};
