import { ClipPlacement } from '../clips';
import { bannerSvg, titleCardSvg } from '../presets';
import { Banner, Canvas, Clip, SourceClip, TitleClip } from '../schema';
import { assetPath } from './assets';
import {
  audioEncodeArgs,
  containerArgs,
  imageInput,
  silentAudioInput,
  startArgs,
  videoEncodeArgs,
} from './encoding';
import {
  clipAudioFilters,
  clipHasAudio,
  filterSegment,
  graph,
  label,
  overlayFilter,
  overlayInputFilters,
  secondsFromMs,
  videoFilters,
} from './filters';
import { bannerPngPath, clipOutputPath, titlePngPath } from './paths';
import { FfmpegStep, RenderAsset, SvgFile } from './types';

export type ClipStepInput = {
  placement: ClipPlacement;
  canvas: Canvas;
  banners: Banner[];
  assets: Map<string, RenderAsset>;
  workDir: string;
};

export type ClipStepResult = { step: FfmpegStep; svgs: SvgFile[] };

type VisibleWindow = { startMs: number; endMs: number };

type Overlay = SvgFile & { visible?: VisibleWindow };

const sourceInput = (
  clip: SourceClip,
  assets: Map<string, RenderAsset>,
): string[] => [
  '-accurate_seek',
  '-ss',
  secondsFromMs(clip.inMs),
  '-to',
  secondsFromMs(clip.outMs),
  '-i',
  assetPath(assets, clip.assetId, `clip ${clip.id}`),
];

const titleInput = (canvas: Canvas, seconds: string): string[] => [
  '-f',
  'lavfi',
  '-t',
  seconds,
  '-i',
  `color=c=black:s=${canvas.width}x${canvas.height}:r=${canvas.fps}`,
  ...silentAudioInput(seconds),
];

const titleOverlay = (
  clip: TitleClip,
  canvas: Canvas,
  workDir: string,
  index: number,
): Overlay => ({
  path: titlePngPath(workDir, index),
  svg: titleCardSvg({
    preset: clip.preset,
    text: clip.text,
    subtitle: clip.subtitle,
    canvas,
  }),
});

// a banner lives in programme time, so it is clipped to this placement and then
// rebased, because the overlay is enabled in clip local time
const bannerOverlays = (
  banners: Banner[],
  placement: ClipPlacement,
  canvas: Canvas,
  workDir: string,
): Overlay[] =>
  banners.flatMap((banner, index) => {
    const startMs = Math.max(banner.startMs, placement.startMs);
    const endMs = Math.min(
      banner.startMs + banner.durationMs,
      placement.endMs,
    );
    return endMs <= startMs
      ? []
      : [
          {
            path: bannerPngPath(workDir, index),
            svg: bannerSvg({
              preset: banner.preset,
              text: banner.text,
              subtitle: banner.subtitle,
              position: banner.position,
              canvas,
            }),
            visible: {
              startMs: startMs - placement.startMs,
              endMs: endMs - placement.startMs,
            },
          },
        ];
  });

const describeClip = (clip: Clip): string =>
  clip.kind === 'source' ? `source ${clip.assetId}` : `title "${clip.text}"`;

// the title card carries its own silence on input 1, the source clip carries
// whatever the recording had on input 0
const audioMapFor = (clip: Clip): string | undefined => {
  if (!clipHasAudio(clip)) {
    return undefined;
  }
  return clip.kind === 'title' ? '1:a' : '0:a?';
};

export const buildClipStep = ({
  placement,
  canvas,
  banners,
  assets,
  workDir,
}: ClipStepInput): ClipStepResult => {
  const { clip, index, durationMs } = placement;
  const seconds = secondsFromMs(durationMs);

  const baseInput =
    clip.kind === 'source'
      ? sourceInput(clip, assets)
      : titleInput(canvas, seconds);
  const baseInputCount = clip.kind === 'source' ? 1 : 2;

  const overlays: Overlay[] = [
    ...(clip.kind === 'title'
      ? [titleOverlay(clip, canvas, workDir, index)]
      : []),
    ...bannerOverlays(banners, placement, canvas, workDir),
  ];

  const segments = [
    filterSegment(['0:v'], videoFilters({ canvas, placement }), 'v0'),
    ...overlays.flatMap((overlay, position) => [
      filterSegment(
        [`${baseInputCount + position}:v`],
        overlayInputFilters(overlay.visible),
        `o${position}`,
      ),
      filterSegment(
        [`v${position}`, `o${position}`],
        [overlayFilter(overlay.visible)],
        `v${position + 1}`,
      ),
    ]),
  ];

  const audioMap = audioMapFor(clip);

  const output = clipOutputPath(workDir, index);

  return {
    step: {
      label: `clip ${index} (${describeClip(clip)})`,
      output,
      args: [
        ...startArgs,
        ...baseInput,
        ...overlays.flatMap((overlay) => imageInput(seconds, overlay.path)),
        '-filter_complex',
        graph(segments),
        '-map',
        label(`v${overlays.length}`),
        ...(audioMap ? ['-map', audioMap] : []),
        ...videoEncodeArgs(canvas),
        ...(audioMap ? audioEncodeArgs(clipAudioFilters(clip)) : ['-an']),
        ...containerArgs,
        output,
      ],
    },
    svgs: overlays.map(({ path, svg }) => ({ path, svg })),
  };
};
