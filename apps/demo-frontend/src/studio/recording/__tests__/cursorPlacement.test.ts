import {
  createEmptyTimeline,
  layoutClips,
  placementAt,
  Timeline,
} from '@asap-hub/demo-timeline';
import { captureTargets } from '../cursorPlacement';

const takeOneStart = 1_700_000_000_000;
const takeTwoStart = takeOneStart + 40_000;

const timeline = (): Timeline => ({
  ...createEmptyTimeline(),
  clips: [
    {
      kind: 'source',
      id: 'clip-a',
      assetId: 'asset-a',
      inMs: 0,
      outMs: 4000,
      volume: 1,
    },
    {
      kind: 'source',
      id: 'clip-b',
      assetId: 'asset-b',
      inMs: 0,
      outMs: 6000,
      volume: 1,
    },
  ],
  cursor: [
    {
      clipId: 'clip-b',
      offsetMs: 0,
      recordedAtEpochMs: takeOneStart,
      path: [],
      effects: [
        {
          id: 'effect-1',
          tMs: 500,
          type: 'ripple',
          point: { x: 0.2, y: 0.3 },
          origin: 'derived-edited',
        },
      ],
    },
  ],
});

const durations: Record<string, number> = { 'asset-b': 6500 };
const assetDurationOf = (assetId: string) => durations[assetId];

const request = (document: Timeline, playheadMs: number) =>
  captureTargets(
    document,
    placementAt(layoutClips(document.clips), playheadMs),
    100000,
    assetDurationOf,
  );

describe('captureTargets', () => {
  // one session collects every take made before the apply, so every clip that
  // knows when its footage ran is a target with its own slice of the stream
  it('targets every clip that carries its take start', () => {
    const document = timeline();
    document.cursor = [
      ...document.cursor,
      {
        clipId: 'clip-a',
        offsetMs: 0,
        recordedAtEpochMs: takeTwoStart,
        path: [],
        effects: [],
      },
    ];

    const targets = request(document, 0)?.targets;

    expect(targets?.map(({ clipId }) => clipId)).toEqual(['clip-a', 'clip-b']);
    expect(targets?.map(({ startedAtEpochMs }) => startedAtEpochMs)).toEqual([
      takeTwoStart,
      takeOneStart,
    ]);
  });

  it('windows each take by the footage the source actually holds', () => {
    const [target] = request(timeline(), 5000)?.targets ?? [];

    expect(target?.startedAtEpochMs).toBe(takeOneStart);
    expect(target?.durationMs).toBe(6500);
  });

  it('falls back to the clip length when the asset is not yet probed', () => {
    const document = timeline();
    document.cursor = [
      {
        clipId: 'clip-a',
        offsetMs: 0,
        recordedAtEpochMs: takeTwoStart,
        path: [],
        effects: [],
      },
    ];

    const [target] = request(document, 0)?.targets ?? [];

    expect(target?.clipId).toBe('clip-a');
    expect(target?.durationMs).toBe(4000);
  });

  it('carries the effects already on each clip so hand edits survive', () => {
    const [target] = request(timeline(), 5000)?.targets ?? [];

    expect(target?.existing).toHaveLength(1);
  });

  it('leaves a clip that never carried a take start out of the slicing', () => {
    const targets = request(timeline(), 1000)?.targets;

    expect(targets?.map(({ clipId }) => clipId)).toEqual(['clip-b']);
  });

  // an imported video, or a document from before the studio kept take starts
  describe('a timeline with no recorded take at all', () => {
    const imported = (): Timeline => {
      const document = timeline();
      document.cursor = [];
      return document;
    };

    it('falls back to the one clip under the playhead', () => {
      const targets = request(imported(), 5000)?.targets;

      expect(targets).toHaveLength(1);
      expect(targets?.[0]?.clipId).toBe('clip-b');
      expect(targets?.[0]?.startedAtEpochMs).toBeUndefined();
      expect(targets?.[0]?.durationMs).toBeUndefined();
    });

    it('has nothing to apply to on an empty timeline', () => {
      expect(
        captureTargets(createEmptyTimeline(), undefined, 1000, () => undefined),
      ).toBeUndefined();
    });
  });

  it('frames the capture with the canvas the export uses', () => {
    expect(request(timeline(), 1000)?.frame).toEqual({
      width: 1920,
      height: 1080,
    });
    expect(request(timeline(), 1000)?.stoppedAtEpochMs).toBe(100000);
  });
});
