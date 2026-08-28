import { Zoom } from '@asap-hub/demo-timeline';
import { noZoom, zoomDurationMs, zoomTransformAt } from '../zoom';

const zoom = (overrides: Partial<Zoom> = {}): Zoom => ({
  id: 'zoom-1',
  clipId: 'clip-1',
  startMs: 1000,
  rampInMs: 400,
  holdMs: 1000,
  rampOutMs: 400,
  focus: { x: 0.25, y: 0.75 },
  scale: 2,
  easing: 'linear',
  ...overrides,
});

describe('zoomDurationMs', () => {
  it('is the ramps plus the hold', () => {
    expect(zoomDurationMs(zoom())).toBe(1800);
  });
});

describe('zoomTransformAt', () => {
  it('is at rest before the zoom starts', () => {
    expect(zoomTransformAt([zoom()], 'clip-1', 0)).toEqual(noZoom);
  });

  it('is halfway in the middle of the ramp', () => {
    expect(zoomTransformAt([zoom()], 'clip-1', 1200).scale).toBeCloseTo(1.5);
  });

  it('is fully in during the hold, at the focus point', () => {
    expect(zoomTransformAt([zoom()], 'clip-1', 2000)).toEqual({
      scale: 2,
      originX: 0.25,
      originY: 0.75,
    });
  });

  it('is back at rest after the zoom ends', () => {
    expect(zoomTransformAt([zoom()], 'clip-1', 3000)).toEqual(noZoom);
  });

  it('ignores a zoom belonging to another clip', () => {
    expect(zoomTransformAt([zoom()], 'clip-2', 2000)).toEqual(noZoom);
  });

  it('takes the strongest of two overlapping zooms rather than compounding', () => {
    const transform = zoomTransformAt(
      [zoom(), zoom({ id: 'zoom-2', scale: 3, focus: { x: 0.9, y: 0.1 } })],
      'clip-1',
      2000,
    );

    expect(transform).toEqual({ scale: 3, originX: 0.9, originY: 0.1 });
  });

  it('eases rather than stepping when asked to', () => {
    const eased = zoomTransformAt(
      [zoom({ easing: 'easeInOut' })],
      'clip-1',
      1100,
    ).scale;
    const linear = zoomTransformAt([zoom()], 'clip-1', 1100).scale;

    expect(eased).toBeLessThan(linear);
  });
});
