import { CursorPathPoint } from '../schema';

// ~10Hz: smooth enough at 30fps once the renderer interpolates, and an order of
// magnitude fewer points than the snippet sends
export const pathSampleMs = 100;

// the snippet already throttles, but a 20Hz stream over a ten minute demo is
// still tens of thousands of points, so one sample per window is kept
export const resamplePath = (
  points: CursorPathPoint[],
  maxPoints: number,
): CursorPathPoint[] => {
  const sampled: CursorPathPoint[] = [];
  let currentWindow = -1;

  points.forEach((point) => {
    const window = Math.floor(point.tMs / pathSampleMs);
    if (window === currentWindow) {
      sampled[sampled.length - 1] = point;
      return;
    }
    currentWindow = window;
    sampled.push(point);
  });

  return sampled.slice(0, maxPoints);
};
