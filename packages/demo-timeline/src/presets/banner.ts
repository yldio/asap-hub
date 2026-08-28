import { BannerPreset } from '../schema';
import { blockHeight, stackLines } from './layout';
import {
  charactersPerLine,
  PresetCanvas,
  sansFontFamily,
  svgDocument,
  svgTextElement,
  wrapText,
} from './text';

const lowerThird = {
  scrim: '#000000',
  scrimOpacity: 0.55,
  heading: '#ffffff',
  subtitle: '#d5d5de',
  bandHeight: 0.26,
  padding: 0.06,
  headingSize: 0.055,
  headingWeight: 600,
  subtitleSize: 0.028,
  subtitleWeight: 400,
  gap: 0.018,
  headingLines: 2,
  subtitleLines: 1,
} as const;

const presets: Record<BannerPreset, typeof lowerThird> = { lowerThird };

export type BannerPosition = 'top' | 'bottom';

export type BannerBand = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const bannerBand = (
  preset: BannerPreset,
  position: BannerPosition,
  canvas: PresetCanvas,
): BannerBand => {
  const height = Math.round(canvas.height * presets[preset].bandHeight);
  return {
    x: 0,
    y: position === 'bottom' ? canvas.height - height : 0,
    width: canvas.width,
    height,
  };
};

export type BannerInput = {
  preset: BannerPreset;
  text: string;
  subtitle?: string;
  position: BannerPosition;
  canvas: PresetCanvas;
};

export const bannerSvg = ({
  preset,
  text,
  subtitle,
  position,
  canvas,
}: BannerInput): string => {
  const style = presets[preset];
  const band = bannerBand(preset, position, canvas);
  const padding = Math.round(canvas.width * style.padding);
  const headingSize = Math.round(canvas.height * style.headingSize);
  const subtitleSize = Math.round(canvas.height * style.subtitleSize);
  const textWidth = canvas.width - padding * 2;

  const headingLines = wrapText(
    text,
    charactersPerLine(textWidth, headingSize, 'sans'),
    style.headingLines,
  );
  const subtitleLines = subtitle
    ? wrapText(
        subtitle,
        charactersPerLine(textWidth, subtitleSize, 'sans'),
        style.subtitleLines,
      )
    : [];

  const gap =
    subtitleLines.length > 0 ? Math.round(canvas.height * style.gap) : 0;
  const total =
    blockHeight(headingLines.length, headingSize) +
    gap +
    blockHeight(subtitleLines.length, subtitleSize);
  const top = band.y + (band.height - total) / 2;

  return svgDocument(canvas, [
    `<rect x="${band.x}" y="${band.y}" width="${band.width}" height="${band.height}" fill="${style.scrim}" fill-opacity="${style.scrimOpacity}"/>`,
    ...stackLines(headingLines, headingSize, top).map((line) =>
      svgTextElement({
        text: line.text,
        x: padding,
        y: line.baseline,
        fontFamily: sansFontFamily,
        fontSize: headingSize,
        fontWeight: style.headingWeight,
        fill: style.heading,
        anchor: 'start',
      }),
    ),
    ...stackLines(
      subtitleLines,
      subtitleSize,
      top + blockHeight(headingLines.length, headingSize) + gap,
    ).map((line) =>
      svgTextElement({
        text: line.text,
        x: padding,
        y: line.baseline,
        fontFamily: sansFontFamily,
        fontSize: subtitleSize,
        fontWeight: style.subtitleWeight,
        fill: style.subtitle,
        anchor: 'start',
      }),
    ),
  ]);
};
