import { Canvas, Zoom } from '../../schema';
import { stillFilters, zoomSpans } from '../zoomSegments';

const canvas: Canvas = { width: 1920, height: 1080, fps: 30 };
const small: Canvas = { width: 1280, height: 720, fps: 30 };

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

  // a zoom with no ramps begins and ends mid stretch, so two held stretches
  // can touch with different windows; merging them by kind alone rendered
  // one of them through the other's window
  it('never merges two holds that hold different windows', () => {
    const spans = zoomSpans(
      [
        zoom({
          rampInMs: 0,
          rampOutMs: 0,
          startMs: 0,
          holdMs: 10_000,
          scale: 1.5,
          focus: { x: 0.2, y: 0.2 },
        }),
        zoom({
          id: 'z2',
          rampInMs: 0,
          rampOutMs: 0,
          startMs: 3000,
          holdMs: 3000,
          scale: 2,
          focus: { x: 0.8, y: 0.8 },
        }),
      ],
      10_000,
    );

    expect(
      spans.map(({ startMs, endMs, kind }) => [startMs, endMs, kind]),
    ).toEqual([
      [0, 3000, 'still'],
      [3000, 6000, 'still'],
      [6000, 10_000, 'still'],
    ]);
    expect(spans[0]?.window?.scale).toBe(1.5);
    expect(spans[1]?.window?.scale).toBe(2.5);
    expect(spans[2]?.window?.scale).toBe(1.5);
    expect(spans[0]?.window).toEqual(spans[2]?.window);
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
      canvas,
    );

    expect(filters).toEqual([
      'crop=960:540:480:270',
      'scale=1920:1080:flags=lanczos:out_color_matrix=bt709',
    ]);
  });

  // a capture larger than the canvas is cropped at its own resolution, so a
  // 2x zoom on a 2560x1440 take under a 1280x720 canvas resizes nothing at all
  it('cuts a larger capture at its own resolution', () => {
    expect(
      stillFilters({ scale: 2, cropX: 0.25, cropY: 0.25 }, small, {
        width: 2560,
        height: 1440,
      }),
    ).toEqual([
      'crop=1280:720:640:360',
      'scale=1280:720:flags=lanczos:out_color_matrix=bt709',
    ]);
  });

  it('never carries the per frame rescale', () => {
    expect(
      stillFilters({ scale: 2, cropX: 0, cropY: 0 }, canvas, canvas).join(','),
    ).not.toContain('eval=frame');
  });
});

// The two chains have to show one picture, or the seam between a ramp and its
// hold jumps. The moving chain rounds against the frame it magnifies to and
// the still chain against the source, so what each one lands on is measured
// here rather than compared as a string.
describe('a held window against the moving chain', () => {
  const even = (value: number): number => value - (value % 2);

  // zoom.ts magnifies to an even multiple of the canvas, and ffmpeg's crop
  // rounds its x to a whole pixel of that frame, holds the window inside it,
  // then floors it to an even one for yuv420p
  const magnified = (size: number, scale: number): number =>
    even(Math.floor(size * scale));
  const movingCropAt = (share: number, frame: number, shown: number): number =>
    even(Math.min(Math.max(Math.round(share * frame), 0), frame - shown));

  const numbers = (filter = '', head = 'crop='): number[] =>
    filter.startsWith(head)
      ? filter
          .slice(head.length)
          .split(':')
          .map((part) => Number(part))
      : [];

  // what ffmpeg reads out of the emitted chain on one axis, in source pixels
  const shownBy = (
    filters: string[],
    axis: 0 | 1,
  ): { at: number; gain: number } => {
    const cut = numbers(filters[0]);
    const crop = cut[axis] ?? NaN;
    const cropAt = cut[axis + 2] ?? NaN;
    const scaled = numbers(filters[1], 'scale=')[axis] ?? NaN;
    const showAt = numbers(filters[2])[axis + 2] ?? 0;
    const gain = scaled / crop;
    return { at: cropAt + showAt / gain, gain };
  };

  const inputs = [
    undefined,
    { width: 2560, height: 1440 },
    { width: 3840, height: 2160 },
  ];
  const scales = [1.5, 1.7, 2, 2.5, 3, 4];
  const focuses = [0, 0.37, 0.5, 1];

  const measure = (
    frame: Canvas,
    input: { width: number; height: number },
    scale: number,
    focus: { x: number; y: number },
  ) => {
    const [span] = zoomSpans(
      [
        zoom({
          startMs: 0,
          rampInMs: 0,
          rampOutMs: 0,
          holdMs: 4000,
          scale,
          focus,
        }),
      ],
      4000,
    );
    const held = span?.window ?? { scale, cropX: 0, cropY: 0 };
    const filters = stillFilters(held, frame, input);

    const axes = ([0, 1] as const).map((axis) => {
      const canvasSize = axis === 0 ? frame.width : frame.height;
      const inputSize = axis === 0 ? input.width : input.height;
      const share = axis === 0 ? held.cropX : held.cropY;
      const magnifiedSize = magnified(canvasSize, held.scale);
      const gain = magnifiedSize / inputSize;
      const at = movingCropAt(share, magnifiedSize, canvasSize) / gain;
      const still = shownBy(filters, axis);
      return {
        gain: still.gain,
        originPx: Math.abs(still.at - at) * gain,
        magnificationPct: (Math.abs(still.gain - gain) / gain) * 100,
      };
    });
    const [across, down] = axes;

    return {
      where: `${frame.width}x${frame.height} canvas, ${input.width}x${input.height} input, scale ${scale}, focus ${focus.x},${focus.y}`,
      originPx: Math.max(across?.originPx ?? NaN, down?.originPx ?? NaN),
      magnificationPct: Math.max(
        across?.magnificationPct ?? NaN,
        down?.magnificationPct ?? NaN,
      ),
      aspectPct:
        (Math.abs((across?.gain ?? NaN) - (down?.gain ?? NaN)) /
          (down?.gain ?? NaN)) *
        100,
    };
  };

  const measured = [canvas, small].flatMap((frame) =>
    inputs.flatMap((input) =>
      scales.flatMap((scale) =>
        focuses.flatMap((x) =>
          focuses.map((y) => measure(frame, input ?? frame, scale, { x, y })),
        ),
      ),
    ),
  );

  it('sweeps every canvas, input, scale and focus', () => {
    expect(measured).toHaveLength(2 * 3 * 6 * 4 * 4);
  });

  // within one output pixel of the moving chain's origin, a twentieth of a
  // percent of its magnification, and the same magnification on both axes
  it('holds the crop origin, the magnification and the aspect', () => {
    const missed = measured
      .filter(
        ({ originPx, magnificationPct, aspectPct }) =>
          !(originPx <= 1 && magnificationPct <= 0.05 && aspectPct <= 0.05),
      )
      .sort(
        (a, b) =>
          b.originPx - a.originPx || b.magnificationPct - a.magnificationPct,
      );

    expect([
      `${missed.length} of ${measured.length} windows miss the moving chain`,
      ...missed
        .slice(0, 5)
        .map(
          ({ where, originPx, magnificationPct, aspectPct }) =>
            `${where}: origin off ${originPx.toFixed(
              3,
            )}px, magnification off ${magnificationPct.toFixed(
              4,
            )}%, aspect off ${aspectPct.toFixed(4)}%`,
        ),
    ]).toEqual([`0 of ${measured.length} windows miss the moving chain`]);
  });

  // the window sits hard against the far edge at the largest crop the schema
  // allows, which is where a rounded rectangle runs out of source
  it('keeps every rectangle even and inside the frame it is cut from', () => {
    const strayed = [canvas, small].flatMap((frame) =>
      inputs.flatMap((input) =>
        scales.flatMap((scale) => {
          const size = input ?? frame;
          const share = 1 - 1 / scale;
          const filters = stillFilters(
            { scale, cropX: share, cropY: share },
            frame,
            size,
          );
          const [w = NaN, h = NaN, x = NaN, y = NaN] = numbers(filters[0]);
          const [sw = NaN, sh = NaN] = numbers(filters[1], 'scale=');
          const [, , ox = 0, oy = 0] = numbers(filters[2]);
          const off =
            [w, h, x, y, sw, sh, ox, oy].some((each) => each % 2 !== 0) ||
            !(x >= 0 && y >= 0) ||
            !(x + w <= size.width && y + h <= size.height) ||
            !(ox + frame.width <= sw && oy + frame.height <= sh);
          return off
            ? [
                `${frame.width}x${frame.height} on ${size.width}x${size.height} at ${scale}`,
              ]
            : [];
        }),
      ),
    );

    expect(strayed).toEqual([]);
  });
});
