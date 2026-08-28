import { stageLabel } from '../RenderBar';

describe('stageLabel', () => {
  // the container reports these verbatim, so a label the encoder never sends
  // would leave every render showing the fallback
  it('names the stages the encoder reports', () => {
    expect(stageLabel('sources')).toBe('Fetching the sources');
    expect(stageLabel('sprite')).toBe('Building the preview images');
    expect(stageLabel('upload')).toBe('Uploading the demo');
  });

  it('reads the per step labels the plan produces', () => {
    expect(stageLabel('clip 0 (source asset-1)')).toBe('Rendering the clips');
    expect(stageLabel('join 3 clips (concat)')).toBe('Joining the timeline');
    expect(stageLabel('join 1 clip (xfade)')).toBe('Joining the timeline');
  });

  it('falls back for anything it does not know', () => {
    expect(stageLabel('something new')).toBe('Rendering');
  });
});
