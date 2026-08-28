import { TitlePreset } from '../schema';
import { blockHeight, stackLines } from './layout';
import {
  charactersPerLine,
  PresetCanvas,
  sansFontFamily,
  serifFontFamily,
  svgDocument,
  svgTextElement,
  wrapText,
} from './text';

const centered = {
  background: '#0b0b0f',
  heading: '#ffffff',
  subtitle: '#b9b9c4',
  headingSize: 0.09,
  headingWeight: 600,
  subtitleSize: 0.036,
  subtitleWeight: 400,
  gap: 0.035,
  textWidth: 0.78,
  headingLines: 3,
  subtitleLines: 2,
} as const;

const presets: Record<TitlePreset, typeof centered> = { centered };

export type TitleCardInput = {
  preset: TitlePreset;
  text: string;
  subtitle?: string;
  canvas: PresetCanvas;
};

export const titleCardSvg = ({
  preset,
  text,
  subtitle,
  canvas,
}: TitleCardInput): string => {
  const style = presets[preset];
  const headingSize = Math.round(canvas.height * style.headingSize);
  const subtitleSize = Math.round(canvas.height * style.subtitleSize);
  const textWidth = canvas.width * style.textWidth;

  const headingLines = wrapText(
    text,
    charactersPerLine(textWidth, headingSize, 'serif'),
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
  const top = (canvas.height - total) / 2;
  const centre = Math.round(canvas.width / 2);

  return svgDocument(canvas, [
    `<rect x="0" y="0" width="${canvas.width}" height="${canvas.height}" fill="${style.background}"/>`,
    ...stackLines(headingLines, headingSize, top).map((line) =>
      svgTextElement({
        text: line.text,
        x: centre,
        y: line.baseline,
        fontFamily: serifFontFamily,
        fontSize: headingSize,
        fontWeight: style.headingWeight,
        fill: style.heading,
        anchor: 'middle',
      }),
    ),
    ...stackLines(
      subtitleLines,
      subtitleSize,
      top + blockHeight(headingLines.length, headingSize) + gap,
    ).map((line) =>
      svgTextElement({
        text: line.text,
        x: centre,
        y: line.baseline,
        fontFamily: sansFontFamily,
        fontSize: subtitleSize,
        fontWeight: style.subtitleWeight,
        fill: style.subtitle,
        anchor: 'middle',
      }),
    ),
  ]);
};
