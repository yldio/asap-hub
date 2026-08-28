import { layoutClips, Timeline as TimelineDoc } from '@asap-hub/demo-timeline';
import { render } from '@testing-library/react';
import { ProjectAsset } from '../../../api/types';
import PreviewStage from '../PreviewStage';

const asset: ProjectAsset = {
  assetId: 'asset-a',
  kind: 'video',
  state: 'ready',
  mimeType: 'video/mp4',
  label: 'A',
  durationMs: 10000,
  url: 'blob:a',
  createdAt: '2026-08-28T00:00:00.000Z',
  updatedAt: '2026-08-28T00:00:00.000Z',
};

const clip = (volume: number): TimelineDoc['clips'][number] => ({
  kind: 'source',
  id: 'clip-a',
  assetId: 'asset-a',
  inMs: 0,
  outMs: 10000,
  volume,
});

const renderStage = (clipVolume: number, previewVolume: number) => {
  const [placement] = layoutClips([clip(clipVolume)]);
  const view = render(
    <PreviewStage
      box={{ width: 320, height: 180 }}
      placement={placement}
      banners={[]}
      zooms={[]}
      cursorEffects={[]}
      playheadMs={0}
      playing={false}
      volume={previewVolume}
      assets={{ 'asset-a': asset }}
      assetUrl={() => asset.url}
    />,
  );
  const video = view.container.querySelector('video');
  if (!video) {
    throw new Error('expected the stage to render a video element');
  }
  return video;
};

// jsdom has no media playback, and the stage pauses the element on mount
beforeAll(() => {
  HTMLMediaElement.prototype.pause = jest.fn();
  HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
});

describe('the preview sound', () => {
  // a clip turned down sounded exactly like one at full level in the studio,
  // and only the export told the truth
  it('applies the clip level as well as the preview slider', () => {
    expect(renderStage(0.4, 1).volume).toBeCloseTo(0.4);
  });

  it('multiplies the two rather than letting either stand alone', () => {
    expect(renderStage(0.5, 0.5).volume).toBeCloseTo(0.25);
  });

  it('mutes a clip the creator has silenced', () => {
    expect(renderStage(0, 1).muted).toBe(true);
  });

  it('can only turn an element down, so a boosted clip plays at full', () => {
    expect(renderStage(1.6, 1).volume).toBeCloseTo(1);
  });
});
