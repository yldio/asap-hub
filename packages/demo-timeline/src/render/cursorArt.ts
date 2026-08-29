import { edgeFor, resolveCursorColor } from '../cursorColors';
import { PresetCanvas, svgDocument } from '../presets';
import { CursorEffect, Point } from '../schema';

// how long each effect stays on screen, the same windows the preview plays
export const rippleDurationMs = 600;
export const spotlightDurationMs = 1200;

// the preview cuts the scrim in and out, which reads as a flash once it is
// burnt into the picture, so the render ramps it
export const spotlightFadeMs = 200;

export type CursorArtInput = {
  point: Point;
  canvas: PresetCanvas;
  color?: string;
};

// every size is a fraction of the canvas, so a click looks the same at 1080p
// and at 4K
const rippleStyle = {
  diameter: 0.09,
  strokeWidth: 0.004,
  strokeOpacity: 0.9,
  fillOpacity: 0.18,
} as const;

const spotlightStyle = {
  scrim: '#000000',
  scrimOpacity: 0.55,
  clearStop: 0.08,
  scrimStop: 0.26,
} as const;

export const rippleSvg = ({ point, canvas, color }: CursorArtInput): string => {
  const radius = Math.round((canvas.width * rippleStyle.diameter) / 2);
  const strokeWidth = Math.max(
    1,
    Math.round(canvas.height * rippleStyle.strokeWidth),
  );
  const ink = resolveCursorColor(color);
  const cx = Math.round(point.x * canvas.width);
  const cy = Math.round(point.y * canvas.height);

  // the dark edge sits just outside the ring, so a white click stays readable on
  // a white page and a coloured one stays readable on its own colour
  const edge = edgeFor(ink);

  return svgDocument(canvas, [
    `<circle cx="${cx}" cy="${cy}" r="${
      radius + strokeWidth
    }" fill="none" stroke="${edge.color}" stroke-opacity="${
      edge.opacity
    }" stroke-width="${strokeWidth}"/>`,
    `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${ink}" fill-opacity="${rippleStyle.fillOpacity}" stroke="${ink}" stroke-opacity="${rippleStyle.strokeOpacity}" stroke-width="${strokeWidth}"/>`,
  ]);
};

// a css radial-gradient measures its stops against the distance to the farthest
// corner, so the svg gradient is given that same radius
const farthestCornerPx = (point: Point, canvas: PresetCanvas): number => {
  const x = point.x * canvas.width;
  const y = point.y * canvas.height;
  return Math.max(
    ...[0, canvas.width].flatMap((cornerX) =>
      [0, canvas.height].map((cornerY) => Math.hypot(cornerX - x, cornerY - y)),
    ),
  );
};

export const spotlightSvg = ({ point, canvas }: CursorArtInput): string => {
  const cx = Math.round(point.x * canvas.width);
  const cy = Math.round(point.y * canvas.height);
  const radius = Math.round(farthestCornerPx(point, canvas));

  return svgDocument(canvas, [
    `<defs><radialGradient id="spotlight" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${radius}"><stop offset="${spotlightStyle.clearStop}" stop-color="${spotlightStyle.scrim}" stop-opacity="0"/><stop offset="${spotlightStyle.scrimStop}" stop-color="${spotlightStyle.scrim}" stop-opacity="${spotlightStyle.scrimOpacity}"/></radialGradient></defs>`,
    `<rect x="0" y="0" width="${canvas.width}" height="${canvas.height}" fill="url(#spotlight)"/>`,
  ]);
};

export type CursorArt = {
  svg: string;
  durationMs: number;
  fadeInMs: number;
  fadeOutMs: number;
};

// the zoom effect is a marker the editor materialises into a Zoom of its own,
// so it has no art to draw
export const cursorArt = (
  effect: CursorEffect,
  canvas: PresetCanvas,
): CursorArt | undefined => {
  const input = { point: effect.point, canvas, color: effect.color };
  if (effect.type === 'ripple') {
    // the preview's ring expands as it fades; the render holds the ring still
    // and decays it over the same window
    return {
      svg: rippleSvg(input),
      durationMs: rippleDurationMs,
      fadeInMs: 0,
      fadeOutMs: rippleDurationMs,
    };
  }
  return effect.type === 'spotlight'
    ? {
        svg: spotlightSvg(input),
        durationMs: spotlightDurationMs,
        fadeInMs: spotlightFadeMs,
        fadeOutMs: spotlightFadeMs,
      }
    : undefined;
};
