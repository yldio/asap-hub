import { Canvas, Zoom } from '../../schema';
import { stillFilters, zoomSpans } from '../zoomSegments';

const canvas: Canvas = { width: 1920, height: 1080, fps: 30 };

const zoom = (overrides: Partial<Zoom> = {}): Zoom => ({
  id: 'z1',
  clipId: 'clip-1',
  startMs: 2000,
  rampInMs: 400,
  holdMs: 5000,
  rampOutMs: 400,
  focus: { x: 0.5, y: 0.5 },
  scale: 2,
  easing: 'easeInOut',
  ...overrides,
});

describe('zoomSpans', () => {
  it('cuts a zoom into quiet, ramp, hold, ramp and quiet', () => {
    expect(zoomSpans([zoom()], 12_000)).toEqual([
      { startMs: 0, endMs: 2000, kind: 'quiet' },
      { startMs: 2000, endMs: 2400, kind: 'moving' },
      {
        startMs: 2400,
        endMs: 7400,
        kind: 'still',
        window: { scale: 2, cropX: 0.25, cropY: 0.25 },
      },
      { startMs: 7400, endMs: 7800, kind: 'moving' },
      { startMs: 7800, endMs: 12_000, kind: 'quiet' },
    ]);
  });

  // the moving chain is right at every instant, so anything shorter than a
  // branch is worth stays on it rather than spawning a sliver
  it('folds a sliver into the moving stretch beside it', () => {
    const spans = zoomSpans([zoom({ startMs: 100 })], 12_000);
    expect(spans[0]).toEqual({ startMs: 0, endMs: 500, kind: 'moving' });
  });

  it('reads a hold shared by two zooms as one still window', () => {
    const spans = zoomSpans(
      [
        zoom(),
        zoom({ id: 'z2', startMs: 3000, holdMs: 1000, focus: { x: 1, y: 0 } }),
      ],
      12_000,
    );

    const both = spans.find(
      (span) => span.startMs === 3400 && span.endMs === 4400,
    );
    // gains 1 and 1: scale 3, x = 0.5*(1/2) + 1*(1/2) clipped to 1-1/3
    expect(both?.kind).toBe('still');
    expect(both?.window?.scale).toBe(3);
    expect(both?.window?.cropY).toBe(0.25);
    expect(both?.window?.cropX).toBeCloseTo(2 / 3, 5);
  });

  it('keeps a ramp of one zoom moving through the hold of another', () => {
    const spans = zoomSpans(
      [zoom(), zoom({ id: 'z2', startMs: 3000, holdMs: 1000 })],
      12_000,
    );
    expect(
      spans.find((span) => span.startMs === 3000 && span.endMs === 3400)?.kind,
    ).toBe('moving');
  });

  it('speaks whole-clip stillness when the ramps are zero', () => {
    const spans = zoomSpans(
      [zoom({ startMs: 0, rampInMs: 0, rampOutMs: 0, holdMs: 12_000 })],
      12_000,
    );
    expect(spans).toEqual([
      {
        startMs: 0,
        endMs: 12_000,
        kind: 'still',
        window: { scale: 2, cropX: 0.25, cropY: 0.25 },
      },
    ]);
  });
});

describe('stillFilters', () => {
  it('cuts the held window out of the source first, then scales up once', () => {
    const filters = stillFilters(
      { scale: 2, cropX: 0.25, cropY: 0.25 },
      canvas,
    );

    expect(filters).toEqual([
      "crop=w='2*floor(in_w*0.500000/2)':h='2*floor(in_h*0.500000/2)':x='in_w*0.250000':y='in_h*0.250000'",
      'scale=1920:1080:flags=lanczos:out_color_matrix=bt709',
    ]);
  });

  // the moving chain floors its magnified frame to even pixels; the shown
  // share follows the same floor so a seam shows the exact same region
  it('mirrors the even floor of the moving chain', () => {
    const filters = stillFilters(
      { scale: 1.8, cropX: 0.2, cropY: 0.3 },
      canvas,
    );

    // 1920*1.8 = 3456 even, 1080*1.8 = 1944 even
    expect(filters[0]).toContain(`in_w*${(1920 / 3456).toFixed(6)}`);
    expect(filters[0]).toContain(`in_h*${(1080 / 1944).toFixed(6)}`);
  });

  it('never carries the per frame rescale', () => {
    expect(
      stillFilters({ scale: 2, cropX: 0, cropY: 0 }, canvas).join(','),
    ).not.toContain('eval=frame');
  });
});
