import { ClipPlacement } from '../clips';
import { cursorPointerTrack } from '../cursor/pointer';
import { bannerBand, bannerSvg, titleCardSvg } from '../presets';
import {
  Banner,
  Canvas,
  Clip,
  CursorLayer,
  Point,
  SourceClip,
  TitleClip,
  Zoom,
} from '../schema';
import { clipZooms, zoomDurationMs } from '../zoom';
import { assetHasAudio, assetPath } from './assets';
import { cursorArt } from './cursorArt';
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
  OverlayMove,
  OverlaySlide,
  OverlayWindow,
  overlayFilter,
  overlayInputFilters,
  secondsFromMs,
  videoFilters,
} from './filters';
import {
  bannerPngPath,
  clipOutputPath,
  cursorPngPath,
  pointerPngPath,
  titlePngPath,
} from './paths';
import { pointerMotion, pointerSvg } from './pointer';
import { FfmpegStep, RenderAsset, SvgFile } from './types';
import {
  onZoomedFrame,
  zoomExpressions,
  ZoomExpressions,
  zoomFilters,
} from './zoom';

export type ClipStepInput = {
  placement: ClipPlacement;
  canvas: Canvas;
  banners: Banner[];
  cursor: CursorLayer[];
  zooms: Zoom[];
  assets: Map<string, RenderAsset>;
  workDir: string;
};

export type ClipStepResult = { step: FfmpegStep; svgs: SvgFile[] };

type Overlay = SvgFile & {
  visible?: OverlayWindow;
  slide?: OverlaySlide;
  move?: OverlayMove;
};

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

// only the text fades: the black card behind it is the clip's own picture, so
// the section reads as a held frame the words arrive on and leave from
const titleOverlay = (
  clip: TitleClip,
  canvas: Canvas,
  workDir: string,
  index: number,
  durationMs: number,
): Overlay => ({
  path: titlePngPath(workDir, index),
  svg: titleCardSvg({
    preset: clip.preset,
    text: clip.text,
    subtitle: clip.subtitle,
    canvas,
  }),
  visible: {
    startMs: 0,
    endMs: durationMs,
    fadeInMs: clip.fadeInMs,
    fadeOutMs: clip.fadeOutMs,
  },
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
              fadeInMs: banner.fadeInMs,
              fadeOutMs: banner.fadeOutMs,
            },
            slide: bannerSlide(banner, canvas),
          },
        ];
  });

// every effect costs an ffmpeg input and a full frame composite, so a clip
// draws the ones a viewer sees first rather than failing to render at all
export const maxCursorOverlays = 60;

// A zoom at rest adds nothing, so an overlay that is gone before the zoom starts
// carries none of its arithmetic. That is the same answer the preview gives, and
// it keeps the filtergraph off a clip whose zooms and clicks never meet.
const zoomsDuring = (clip: Zoom[], startMs: number, endMs: number): Zoom[] =>
  clip.filter(
    (zoom) =>
      zoom.startMs < endMs && zoom.startMs + zoomDurationMs(zoom) > startMs,
  );

// The ring is drawn where the capture put it, on an image the size of the whole
// canvas, so the whole image is shifted by however far the zoom carries that one
// point. A ring that did not move would sit where the button used to be while
// the pointer clicking it had already followed the picture.
export const ringMove = (
  point: Point,
  canvas: Canvas,
  zoom: ZoomExpressions,
): OverlayMove => {
  // the ring was drawn at whole pixels, so it is moved from there
  const shift = (at: number, size: number, crop: string): string => {
    const drawn = Math.round(at * size);
    return `(${onZoomedFrame(`${drawn}`, size, crop, zoom.scale)})-${drawn}`;
  };
  return {
    x: shift(point.x, canvas.width, zoom.cropX),
    y: shift(point.y, canvas.height, zoom.cropY),
  };
};

// capture times are footage times, so what lines them up with the clip is the
// creator's nudge less however much of the footage the trim cut off the front
const captureShiftMs = (layer: CursorLayer, placement: ClipPlacement): number =>
  layer.offsetMs - (placement.clip.kind === 'source' ? placement.clip.inMs : 0);

const cursorOverlays = (
  cursor: CursorLayer[],
  placement: ClipPlacement,
  canvas: Canvas,
  workDir: string,
  clipZoom: Zoom[],
): Overlay[] =>
  cursor
    .filter((layer) => layer.clipId === placement.clip.id)
    .flatMap((layer) =>
      layer.effects.flatMap((effect) => {
        const art = cursorArt(effect, canvas);
        if (!art) {
          return [];
        }
        const atMs = effect.tMs + captureShiftMs(layer, placement);
        const startMs = Math.max(0, atMs);
        const endMs = Math.min(placement.durationMs, atMs + art.durationMs);
        // a spotlight is a scrim over the whole frame, and moving it would
        // uncover the very edge it is meant to darken, so it stays put
        const zoom =
          effect.type === 'ripple'
            ? zoomExpressions(zoomsDuring(clipZoom, startMs, endMs))
            : undefined;
        return endMs <= startMs
          ? []
          : [
              {
                svg: art.svg,
                visible: {
                  startMs,
                  endMs,
                  fadeInMs: art.fadeInMs,
                  fadeOutMs: art.fadeOutMs,
                },
                ...(zoom ? { move: ringMove(effect.point, canvas, zoom) } : {}),
              },
            ];
      }),
    )
    .slice(0, maxCursorOverlays)
    .map((overlay, position) => ({
      ...overlay,
      path: cursorPngPath(workDir, placement.index, position),
    }));

// the drawn pointer: one image for the whole clip, walked along the captured
// path by an expression, because it is somewhere different on every frame
const pointerOverlays = (
  cursor: CursorLayer[],
  placement: ClipPlacement,
  canvas: Canvas,
  workDir: string,
  clipZoom: Zoom[],
): Overlay[] =>
  cursor
    .filter((layer) => layer.clipId === placement.clip.id)
    .flatMap((layer) => {
      const art = { canvas, variant: layer.pointer };
      const track = cursorPointerTrack({
        path: layer.path,
        offsetMs: captureShiftMs(layer, placement),
      });
      const motion = pointerMotion(
        track,
        art,
        placement.durationMs,
        zoomExpressions(
          zoomsDuring(
            clipZoom,
            track[0]?.tMs ?? 0,
            track[track.length - 1]?.tMs ?? 0,
          ),
        ),
      );
      return motion
        ? [
            {
              path: pointerPngPath(workDir, placement.index),
              svg: pointerSvg(art),
              // the pointer arrives with the capture and leaves with it, the
              // way the preview shows it, so neither end is ramped
              visible: {
                startMs: motion.startMs,
                endMs: motion.endMs,
                fadeInMs: 0,
                fadeOutMs: 0,
              },
              move: { x: motion.x, y: motion.y },
            },
          ]
        : [];
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
  cursor,
  zooms,
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

  // the zoom moves the picture the banners sit on, exactly as the preview
  // scales the video under its own banner layer; the pointer and the click
  // rings are carried through the same window instead, so they ride the zoomed
  // picture rather than the frame it is drawn on
  const clipZoom = clipZooms(zooms, clip.id);
  const overlays: Overlay[] = [
    ...(clip.kind === 'title'
      ? [titleOverlay(clip, canvas, workDir, index, durationMs)]
      : []),
    ...cursorOverlays(cursor, placement, canvas, workDir, clipZoom),
    ...pointerOverlays(cursor, placement, canvas, workDir, clipZoom),
    ...bannerOverlays(banners, placement, canvas, workDir),
  ];

  const segments = [
    filterSegment(
      ['0:v'],
      [
        ...videoFilters({ canvas, placement }),
        ...zoomFilters(clipZoom, canvas),
      ],
      'v0',
    ),
    ...overlays.flatMap((overlay, position) => [
      filterSegment(
        [`${baseInputCount + position}:v`],
        overlayInputFilters(overlay.visible),
        `o${position}`,
      ),
      filterSegment(
        [`v${position}`, `o${position}`],
        [overlayFilter(overlay.visible, overlay.slide, overlay.move)],
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
