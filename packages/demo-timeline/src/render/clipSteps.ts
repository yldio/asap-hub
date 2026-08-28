import { ClipPlacement } from '../clips';
import { bannerBand, bannerSvg, titleCardSvg } from '../presets';
import { Banner, Canvas, Clip, SourceClip, TitleClip } from '../schema';
import { assetHasAudio, assetPath } from './assets';
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
  filterSegment,
  graph,
  label,
  OverlaySlide,
  OverlayWindow,
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

type Overlay = SvgFile & { visible?: OverlayWindow; slide?: OverlaySlide };

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

// the banner travels the height of its own band, so it comes from the frame
// edge it sits against: a bottom banner rises, a top banner drops
const bannerSlide = (
  banner: Banner,
  canvas: Canvas,
): OverlaySlide | undefined => {
  if (banner.animation !== 'slide') {
    return undefined;
  }
  const { height } = bannerBand(banner.preset, banner.position, canvas);
  return { distancePx: banner.position === 'bottom' ? height : -height };
};

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
    const endMs = Math.min(banner.startMs + banner.durationMs, placement.endMs);
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
            slide: bannerSlide(banner, canvas),
          },
        ];
  });

const describeClip = (clip: Clip): string =>
  clip.kind === 'source' ? `source ${clip.assetId}` : `title "${clip.text}"`;

// a title card, a muted clip and a recording with no sound all still need a
// track, because the stage two concat demuxer refuses a mixed stream layout
const usesSourceAudio = (
  clip: Clip,
  assets: Map<string, RenderAsset>,
): boolean =>
  clip.kind === 'source' &&
  clip.volume > 0 &&
  assetHasAudio(assets, clip.assetId);

export const buildClipStep = ({
  placement,
  canvas,
  banners,
  assets,
  workDir,
}: ClipStepInput): ClipStepResult => {
  const { clip, index, durationMs } = placement;
  const seconds = secondsFromMs(durationMs);

  const videoInput =
    clip.kind === 'source'
      ? sourceInput(clip, assets)
      : titleInput(canvas, seconds);
  const generatedAudio = !usesSourceAudio(clip, assets);
  const audioMap = generatedAudio ? '1:a' : '0:a?';
  const baseInputCount = generatedAudio ? 2 : 1;

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
        [overlayFilter(overlay.visible, overlay.slide)],
        `v${position + 1}`,
      ),
    ]),
  ];

  const output = clipOutputPath(workDir, index);

  return {
    step: {
      label: `clip ${index} (${describeClip(clip)})`,
      output,
      args: [
        ...startArgs,
        ...videoInput,
        ...(generatedAudio ? silentAudioInput(seconds) : []),
        ...overlays.flatMap((overlay) => imageInput(seconds, overlay.path)),
        '-filter_complex',
        graph(segments),
        '-map',
        label(`v${overlays.length}`),
        '-map',
        audioMap,
        ...videoEncodeArgs(canvas),
        ...audioEncodeArgs(clipAudioFilters(clip)),
        ...containerArgs,
        output,
      ],
    },
    svgs: overlays.map(({ path, svg }) => ({ path, svg })),
  };
};
