import { ClipPlacement } from '../clips';
import { alignedPath, alignedPoint } from '../cursor/align';
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
  colourTagFilter,
  filterSegment,
  graph,
  label,
  OverlayMove,
  OverlayOrigin,
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
import { pointerMotion, pointerSizePx, pointerSvg } from './pointer';
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
  origin?: OverlayOrigin;
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
  width: canvas.width,
  height: canvas.height,
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

// banners are authored one at a time rather than captured, so a clip never
// legitimately carries many; the cap is there for the same reason the click one
// is, that each overlay costs an input and a composite per frame
export const maxBannerOverlays = 20;

// a banner lives in programme time, so it is clipped to this placement and then
// rebased, because the overlay is enabled in clip local time. Its own span is
// carried across too, so a banner cut by a boundary does not ramp at the cut.
const bannerOverlays = (
  banners: Banner[],
  placement: ClipPlacement,
  canvas: Canvas,
  workDir: string,
): Overlay[] =>
  banners
    .flatMap((banner, index) => {
      const spanEndMs = banner.startMs + banner.durationMs;
      const startMs = Math.max(banner.startMs, placement.startMs);
      const endMs = Math.min(spanEndMs, placement.endMs);
      return endMs <= startMs
        ? []
        : [
            {
              path: bannerPngPath(workDir, index),
              width: canvas.width,
              height: canvas.height,
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
                spanStartMs: banner.startMs - placement.startMs,
                spanEndMs: spanEndMs - placement.startMs,
                fadeInMs: banner.fadeInMs,
                fadeOutMs: banner.fadeOutMs,
              },
              slide: bannerSlide(banner, canvas),
            },
          ];
    })
    .slice(0, maxBannerOverlays);

// every effect costs an ffmpeg input and a composite per frame, so a clip draws
// the ones a viewer sees first rather than failing to render at all
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
        const placedAt = alignedPoint(effect.point, layer, canvas);
        const art = cursorArt({ ...effect, point: placedAt }, canvas);
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
                width: art.width,
                height: art.height,
                origin: { x: art.x, y: art.y },
                // the effect's own span rides along, so a ring cut by a clip
                // edge keeps its true decay rate and is merely cut off, and
                // one that began before frame 0 arrives already part faded
                visible: {
                  startMs,
                  endMs,
                  spanStartMs: atMs,
                  spanEndMs: atMs + art.durationMs,
                  fadeInMs: art.fadeInMs,
                  fadeOutMs: art.fadeOutMs,
                },
                ...(zoom ? { move: ringMove(placedAt, canvas, zoom) } : {}),
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
    .flatMap((layer, layerPosition) => {
      const art = { canvas, variant: layer.pointer };
      const track = alignedPath(
        cursorPointerTrack({
          path: layer.path,
          offsetMs: captureShiftMs(layer, placement),
        }),
        layer,
        canvas,
      );
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
              // per layer as well as per clip: the schema permits two layers
              // on one clip, and one png cannot hold two pointers
              path: pointerPngPath(workDir, placement.index, layerPosition),
              ...pointerSizePx(art),
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

// The zoom magnifies whatever it is handed, so a capture at least as large as
// the canvas is cropped at its own resolution and scaled down once, rather than
// being fitted to the canvas and then magnified back out of it. The aspect has
// to match exactly: otherwise the canvas fit letterboxes the picture, and the
// preview scales those bars along with it.
const zoomCropsTheSource = (
  clip: Clip,
  canvas: Canvas,
  assets: Map<string, RenderAsset>,
): boolean => {
  if (clip.kind !== 'source') {
    return false;
  }
  const { width, height } = assets.get(clip.assetId) ?? {};
  return (
    width !== undefined &&
    height !== undefined &&
    width >= canvas.width &&
    height >= canvas.height &&
    width * canvas.height === height * canvas.width
  );
};

// the zoom's own scale is the canvas fit when it stands at rest, so a source it
// can crop needs no separate fit at all
const pictureFilters = (
  placement: ClipPlacement,
  canvas: Canvas,
  clipZoom: Zoom[],
  assets: Map<string, RenderAsset>,
): string[] => {
  const zoom = zoomFilters(clipZoom, canvas);
  if (zoom.length === 0) {
    return videoFilters({ canvas, placement });
  }
  return zoomCropsTheSource(placement.clip, canvas, assets)
    ? [...zoom, 'setsar=1', colourTagFilter]
    : [...videoFilters({ canvas, placement }), ...zoom];
};

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
      pictureFilters(placement, canvas, clipZoom, assets),
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
        [
          overlayFilter(
            overlay.visible,
            overlay.slide,
            overlay.move,
            overlay.origin,
          ),
        ],
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
        ...overlays.flatMap((overlay) =>
          imageInput(seconds, overlay.path, canvas.fps),
        ),
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
    svgs: overlays.map(({ path, svg, width, height }) => ({
      path,
      svg,
      width,
      height,
    })),
  };
};
