import {
  createEmptyTimeline,
  layoutClips,
  placementAt,
  Timeline,
} from '@asap-hub/demo-timeline';
import { captureTarget } from '../cursorPlacement';

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

const targetAt = (playheadMs: number) => {
  const document = timeline();
  const placements = layoutClips(document.clips);
  return captureTarget(document, placementAt(placements, playheadMs), 100000);
};

describe('captureTarget', () => {
  // it used to land on clips[0] whatever the playhead was over, which is not
  // the recording the creator had just made
  it('lands on the clip under the playhead', () => {
    expect(targetAt(5000)?.clipId).toBe('clip-b');
  });

  it('lands on the first clip when the playhead is over it', () => {
    expect(targetAt(1000)?.clipId).toBe('clip-a');
  });

  // working the origin back from the timeline put it minutes away from when the
  // capture ran, and every event fell before zero and was thrown away
  it('leaves the time origin to the events themselves', () => {
    expect(targetAt(5000)?.request.startedAtEpochMs).toBeUndefined();
    expect(targetAt(5000)?.request.stoppedAtEpochMs).toBe(100000);
  });

  it('carries the effects already on that clip so hand edits survive', () => {
    expect(targetAt(5000)?.request.existing).toHaveLength(1);
    expect(targetAt(1000)?.request.existing).toEqual([]);
  });

  it('frames the capture with the canvas the export uses', () => {
    expect(targetAt(1000)?.request.frame).toEqual({
      width: 1920,
      height: 1080,
    });
  });

  it('has nothing to apply to on an empty timeline', () => {
    expect(
      captureTarget(createEmptyTimeline(), undefined, 1000),
    ).toBeUndefined();
  });
});
