import { ClipPlacement } from '../clips';
import { SourceClip, Zoom } from '../schema';
import { clipZooms, zoomDurationMs } from '../zoom';
import { audioCodecArgs, containerArgs, startArgs } from './encoding';
import { filterSegment, graph, label } from './filters';
import { concatListContent } from './joinStep';
import { clipOutputPath, tileListPath } from './paths';
import { ConcatListFile, FfmpegStep, RenderAsset } from './types';

// One clip is one ffmpeg process, so a single long take used to hold the whole
// pool hostage: fifty minutes of demo encoded one core-group at a time. Past
// this length a clip is cut into tiles, each encoded in the pool like a clip of
// its own, and stitched back with the same sample accurate join the programme
// itself uses. The seams land on whole seconds, which every canvas rate divides.
export const tileThresholdMs = 90_000;
export const tileTargetMs = 60_000;
// a stub shorter than this rides with the tile before it instead
export const tileTailMs = 20_000;

// A clip with any zoom pays the per frame rescale for its whole length, even
// the stretches where nothing is zooming. Boundaries are therefore also cut
// where the zooms start and stop, padded a little, so a quiet tile carries no
// zoom at all and renders several times faster. A quiet stretch has to be
// worth its own tile to earn a cut.
export const zoomMarginMs = 500;
export const minTileMs = 15_000;

type Window = { startMs: number; endMs: number };

const mergedWindows = (windows: Window[]): Window[] =>
  [...windows]
    .sort((a, b) => a.startMs - b.startMs)
    .reduce<Window[]>((merged, window) => {
      const last = merged[merged.length - 1];
      if (last && window.startMs <= last.endMs) {
        last.endMs = Math.max(last.endMs, window.endMs);
        return merged;
      }
      return [...merged, { ...window }];
    }, []);

export const zoomWindows = (
  zooms: Zoom[],
  clipId: string,
  durationMs: number,
): Window[] =>
  mergedWindows(
    clipZooms(zooms, clipId)
      .map((zoom) => ({
        startMs: Math.max(0, zoom.startMs - zoomMarginMs),
        endMs: Math.min(
          durationMs,
          zoom.startMs + zoomDurationMs(zoom) + zoomMarginMs,
        ),
      }))
      .filter((window) => window.endMs > window.startMs),
  );

export type TileSpan = { startMs: number; endMs: number };

const gridded = (from: number, to: number): TileSpan[] => {
  const spans: TileSpan[] = [];
  for (let at = from; at < to; at += tileTargetMs) {
    spans.push({ startMs: at, endMs: Math.min(at + tileTargetMs, to) });
  }
  const last = spans[spans.length - 1];
  const before = spans[spans.length - 2];
  if (last && before && last.endMs - last.startMs < tileTailMs) {
    before.endMs = last.endMs;
    spans.pop();
  }
  return spans;
};

export const tileSpans = (
  durationMs: number,
  zoomed: Window[] = [],
): TileSpan[] => {
  // the zoom edges are boundaries in their own right, so a quiet stretch can
  // become a tile with no zoom chain at all; each stretch is then gridded
  const edges = [
    0,
    ...zoomed.flatMap((window) => [window.startMs, window.endMs]),
    durationMs,
  ]
    .map((edge) => Math.max(0, Math.min(durationMs, edge)))
    .sort((a, b) => a - b)
    .filter((edge, at, all) => at === 0 || edge > (all[at - 1] ?? 0));

  const stretches: TileSpan[] = [];
  for (let at = 0; at < edges.length - 1; at += 1) {
    stretches.push(...gridded(edges[at] ?? 0, edges[at + 1] ?? 0));
  }

  // a sliver is not worth a process of its own; it rides with its neighbour
  return stretches.reduce<TileSpan[]>((kept, span) => {
    const last = kept[kept.length - 1];
    if (last && span.endMs - span.startMs < minTileMs) {
      last.endMs = span.endMs;
      return kept;
    }
    if (last && last.endMs - last.startMs < minTileMs) {
      last.endMs = span.endMs;
      return kept;
    }
    return [...kept, { ...span }];
  }, []);
};

export type ClipTile = {
  placement: ClipPlacement;
  // how far into the clip's own time this tile starts: what a zoom's clip
  // local start has to come down by to speak the tile's time
  shiftMs: number;
  // whether any zoom window touches this tile; a quiet tile skips the whole
  // per frame rescale chain
  zoomed: boolean;
};

// The tile is a source clip in its own right: banners clip to its programme
// span, capture times shift through its own inMs, and the held tail lands on
// whichever tile the footage runs out in. Everything the clip step already
// does is right for a tile, so the tile IS a placement.
export const tilePlacements = (
  placement: ClipPlacement,
  assets: Map<string, RenderAsset>,
  indexOf: () => number,
  zooms: Zoom[] = [],
): ClipTile[] => {
  const { clip } = placement;
  const windows =
    clip.kind === 'source'
      ? zoomWindows(zooms, clip.id, placement.durationMs)
      : [];
  const whole: ClipTile[] = [
    { placement, shiftMs: 0, zoomed: windows.length > 0 },
  ];
  const quietMs =
    placement.durationMs -
    windows.reduce((total, window) => total + window.endMs - window.startMs, 0);
  // long clips tile for the pool; a shorter one tiles only when the zoom
  // edges free at least a tile's worth of quiet running time
  const worthIt =
    placement.durationMs > tileThresholdMs ||
    (windows.length > 0 &&
      quietMs >= minTileMs &&
      placement.durationMs >= 2 * minTileMs);
  if (clip.kind !== 'source' || !worthIt) {
    return whole;
  }
  const footageMs = assets.get(clip.assetId)?.durationMs;
  if (footageMs === undefined) {
    return whole;
  }

  // a tile that starts past the end of the footage would be an empty input,
  // so the boundaries stop at the footage and the last tile holds the rest
  const footageLocalMs = Math.max(1, Math.round(footageMs) - clip.inMs);
  const boundMs = Math.min(placement.durationMs, footageLocalMs);
  const spans = tileSpans(
    boundMs,
    windows.map((window) => ({
      startMs: Math.min(window.startMs, boundMs),
      endMs: Math.min(window.endMs, boundMs),
    })),
  );
  const lastSpan = spans[spans.length - 1];
  if (lastSpan) {
    lastSpan.endMs = placement.durationMs;
  }
  if (spans.length < 2) {
    return whole;
  }

  return spans.map((span) => {
    const tileClip: SourceClip = {
      ...clip,
      inMs: clip.inMs + span.startMs,
      outMs: clip.inMs + span.endMs,
    };
    return {
      placement: {
        clip: tileClip,
        index: indexOf(),
        startMs: placement.startMs + span.startMs,
        endMs: placement.startMs + span.endMs,
        durationMs: span.endMs - span.startMs,
        overlapMs: 0,
      },
      shiftMs: span.startMs,
      zoomed: windows.some(
        (window) => window.startMs < span.endMs && window.endMs > span.startMs,
      ),
    };
  });
};

// a zoom's startMs speaks the clip's own time; inside a tile the clock starts
// at the tile, so the zoom comes down by the tile's shift. The expressions are
// pure functions of t, so a zoom already mid ramp at a tile's first frame
// still draws the exact window it would have in one piece.
export const shiftZoomsForTile = (
  zooms: Zoom[],
  clipId: string,
  shiftMs: number,
): Zoom[] =>
  shiftMs === 0
    ? zooms
    : zooms.map((zoom) =>
        zoom.clipId === clipId
          ? { ...zoom, startMs: zoom.startMs - shiftMs }
          : zoom,
      );

export type AssembleStep = { step: FfmpegStep; listFile: ConcatListFile };

// the tiles come back together exactly the way the cut only join works: video
// copied off the concat demuxer under -copyts, audio rebuilt through the
// concat filter so no per tile AAC priming leaks into the middle of a clip
export const buildAssembleStep = (
  clipIndex: number,
  tiles: ClipTile[],
  workDir: string,
): AssembleStep => {
  const listPath = tileListPath(workDir, clipIndex);
  const tilePaths = tiles.map((tile) =>
    clipOutputPath(workDir, tile.placement.index),
  );
  const audioInputs = tiles.map((_unused, position) => `${position + 1}:a`);
  const durationMs = tiles.reduce(
    (total, tile) => total + tile.placement.durationMs,
    0,
  );

  return {
    listFile: { path: listPath, content: concatListContent(tilePaths) },
    step: {
      label: `assemble clip ${clipIndex} from ${tiles.length} tiles`,
      output: clipOutputPath(workDir, clipIndex),
      serial: true,
      // a stream copy is far cheaper than an encode, whatever the length
      weightMs: Math.round(durationMs / 20),
      args: [
        ...startArgs,
        '-copyts',
        '-f',
        'concat',
        '-safe',
        '0',
        '-i',
        listPath,
        ...tilePaths.flatMap((path) => ['-i', path]),
        '-filter_complex',
        graph([
          filterSegment(
            audioInputs,
            [`concat=n=${audioInputs.length}:v=0:a=1`],
            'ta',
          ),
        ]),
        '-map',
        '0:v',
        '-map',
        label('ta'),
        '-c:v',
        'copy',
        ...audioCodecArgs,
        ...containerArgs,
        clipOutputPath(workDir, clipIndex),
      ],
    },
  };
};
