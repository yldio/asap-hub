import { ClipPlacement } from '../clips';
import { SourceClip, Zoom } from '../schema';
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

export type TileSpan = { startMs: number; endMs: number };

export const tileSpans = (durationMs: number): TileSpan[] => {
  if (durationMs <= tileThresholdMs) {
    return [{ startMs: 0, endMs: durationMs }];
  }
  const spans: TileSpan[] = [];
  for (let at = 0; at < durationMs; at += tileTargetMs) {
    spans.push({ startMs: at, endMs: Math.min(at + tileTargetMs, durationMs) });
  }
  const last = spans[spans.length - 1];
  const before = spans[spans.length - 2];
  if (last && before && last.endMs - last.startMs < tileTailMs) {
    before.endMs = last.endMs;
    spans.pop();
  }
  return spans;
};

export type ClipTile = {
  placement: ClipPlacement;
  // how far into the clip's own time this tile starts: what a zoom's clip
  // local start has to come down by to speak the tile's time
  shiftMs: number;
};

// The tile is a source clip in its own right: banners clip to its programme
// span, capture times shift through its own inMs, and the held tail lands on
// whichever tile the footage runs out in. Everything the clip step already
// does is right for a tile, so the tile IS a placement.
export const tilePlacements = (
  placement: ClipPlacement,
  assets: Map<string, RenderAsset>,
  indexOf: () => number,
): ClipTile[] => {
  const { clip } = placement;
  if (clip.kind !== 'source' || placement.durationMs <= tileThresholdMs) {
    return [{ placement, shiftMs: 0 }];
  }
  const footageMs = assets.get(clip.assetId)?.durationMs;
  if (footageMs === undefined) {
    return [{ placement, shiftMs: 0 }];
  }

  // a tile that starts past the end of the footage would be an empty input,
  // so the boundaries stop at the footage and the last tile holds the rest
  const footageLocalMs = Math.max(1, Math.round(footageMs) - clip.inMs);
  const spans = tileSpans(Math.min(placement.durationMs, footageLocalMs));
  const lastSpan = spans[spans.length - 1];
  if (lastSpan) {
    lastSpan.endMs = placement.durationMs;
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
