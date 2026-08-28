import { Timeline as TimelineDoc } from '@asap-hub/demo-timeline';
import { ProjectAsset } from '../../../api/types';
import {
  assetsOnTimeline,
  canvasForAssets,
  raiseCanvas,
} from '../canvasChoice';

const asset = (overrides: Partial<ProjectAsset> = {}): ProjectAsset => ({
  assetId: 'asset-a',
  kind: 'video',
  state: 'ready',
  mimeType: 'video/mp4',
  label: 'A',
  width: 3840,
  height: 2160,
  fps: 60,
  createdAt: '2026-08-28T00:00:00.000Z',
  updatedAt: '2026-08-28T00:00:00.000Z',
  ...overrides,
});

describe('canvasForAssets', () => {
  // an import added straight away used to pin the whole project to 1080p30,
  // because the chooser was handed a source the ingest had not read yet
  it('says nothing at all while every source is still being prepared', () => {
    expect(
      canvasForAssets([
        asset({
          state: 'preparing',
          width: undefined,
          height: undefined,
          fps: undefined,
        }),
      ]),
    ).toBeUndefined();
  });

  it('follows the footage once the ingest has read it', () => {
    expect(canvasForAssets([asset()])).toEqual({
      width: 3840,
      height: 2160,
      fps: 60,
    });
  });

  it('ignores a source with no format beside one that has it', () => {
    expect(
      canvasForAssets([
        asset({ assetId: 'b', height: undefined, fps: undefined }),
        asset({ height: 1080, width: 1920, fps: 60 }),
      ]),
    ).toEqual({ width: 1920, height: 1080, fps: 60 });
  });
});

describe('raiseCanvas', () => {
  it('takes the taller format when the probe reports one', () => {
    expect(
      raiseCanvas(
        { width: 1920, height: 1080, fps: 30 },
        { width: 3840, height: 2160, fps: 60 },
      ),
    ).toEqual({ width: 3840, height: 2160, fps: 60 });
  });

  it('never drops a project down to a smaller source', () => {
    expect(
      raiseCanvas(
        { width: 3840, height: 2160, fps: 60 },
        { width: 1920, height: 1080, fps: 30 },
      ),
    ).toEqual({ width: 3840, height: 2160, fps: 60 });
  });
});

describe('assetsOnTimeline', () => {
  it('reads only the sources the clips actually use', () => {
    const clips: TimelineDoc['clips'] = [
      {
        kind: 'source',
        id: 'c1',
        assetId: 'asset-a',
        inMs: 0,
        outMs: 1000,
        volume: 1,
      },
      {
        kind: 'title',
        id: 't1',
        durationMs: 1000,
        preset: 'centered',
        text: 'x',
      },
    ];

    expect(assetsOnTimeline(clips, { 'asset-a': asset() })).toEqual([asset()]);
  });
});
