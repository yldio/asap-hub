import { limits } from '../../schema';
import { deriveCursorEffects } from '../derive';
import { parseCaptureEvents } from '../parse';
import { CaptureEvent, DeriveOptions } from '../types';

const startedAtEpochMs = 1_700_000_000_000;

const frame = { width: 1920, height: 1080 };

const options = (overrides: Partial<DeriveOptions> = {}): DeriveOptions => ({
  startedAtEpochMs,
  frame,
  ...overrides,
});

const event = (overrides: Partial<CaptureEvent> = {}): CaptureEvent => ({
  id: 'e1',
  type: 'move',
  t: startedAtEpochMs,
  x: 640,
  y: 360,
  viewportW: 1280,
  viewportH: 720,
  ...overrides,
});

const at = (
  atMs: number,
  overrides: Partial<CaptureEvent> = {},
): CaptureEvent => event({ t: startedAtEpochMs + atMs, ...overrides });

describe('deriveCursorEffects', () => {
  it('turns a captured take into a path and a ripple per click', () => {
    const ndjson = [
      { id: 'e1', type: 'move', t: 1_700_000_000_000, x: 0, y: 0 },
      { id: 'e2', type: 'move', t: 1_700_000_000_500, x: 640, y: 360 },
      { id: 'e3', type: 'down', t: 1_700_000_001_000, x: 1280, y: 720 },
      { id: 'e4', type: 'click', t: 1_700_000_001_100, x: 1280, y: 720 },
    ]
      .map((line) =>
        JSON.stringify({ ...line, viewportW: 1280, viewportH: 720 }),
      )
      .join('\n');

    const { path, effects } = deriveCursorEffects(
      parseCaptureEvents(ndjson),
      options(),
    );

    expect(path).toEqual([
      { tMs: 0, x: 0, y: 0 },
      { tMs: 500, x: 0.5, y: 0.5 },
      { tMs: 1000, x: 1, y: 1 },
      { tMs: 1100, x: 1, y: 1 },
    ]);
    expect(effects).toEqual([
      {
        id: 'ripple-e4',
        tMs: 1100,
        type: 'ripple',
        point: { x: 1, y: 1 },
        origin: 'derived',
        sourceEventId: 'e4',
      },
    ]);
  });

  it('applies the clip offset and drops anything before the take started', () => {
    const { path } = deriveCursorEffects(
      [at(-400, { id: 'early' }), at(0, { id: 'e1' }), at(600, { id: 'e2' })],
      options({ offsetMs: 250 }),
    );

    expect(path.map(({ tMs }) => tMs)).toEqual([250, 850]);
  });

  it('drops an event past the longest timeline the document allows', () => {
    const { path } = deriveCursorEffects(
      [at(limits.maxTimelineMs + 1, { id: 'late' }), at(10, { id: 'e1' })],
      options(),
    );

    expect(path.map(({ tMs }) => tMs)).toEqual([10]);
  });

  it('normalises against the viewport of each event, not a fixed size', () => {
    const { effects } = deriveCursorEffects(
      [
        at(0, { id: 'small', type: 'click', x: 640, y: 360 }),
        at(1000, {
          id: 'large',
          type: 'click',
          x: 960,
          y: 540,
          viewportW: 1920,
          viewportH: 1080,
        }),
      ],
      options(),
    );

    expect(effects.map(({ point }) => point)).toEqual([
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 },
    ]);
  });

  it('letterboxes a viewport whose aspect ratio differs from the frame', () => {
    const { effects } = deriveCursorEffects(
      [
        at(0, {
          id: 'square',
          type: 'click',
          x: 1000,
          y: 500,
          viewportW: 1000,
          viewportH: 1000,
        }),
      ],
      options(),
    );

    expect(effects[0]?.point).toEqual({ x: 0.7813, y: 0.5 });
  });

  it('resamples the path to about 10Hz and quantises to four decimals', () => {
    const moves = Array.from({ length: 40 }, (_unused, index) =>
      at(index * 25, { id: `m${index}`, x: index, y: 0 }),
    );

    const { path } = deriveCursorEffects(moves, options());

    // 40 samples over a second at 25ms apart collapse to one per 100ms window
    expect(path).toHaveLength(10);
    expect(path.map(({ tMs }) => tMs)).toEqual([
      75, 175, 275, 375, 475, 575, 675, 775, 875, 975,
    ]);
    expect(path[1]).toEqual({ tMs: 175, x: 0.0055, y: 0 });
  });

  it('collapses rapid repeat clicks inside the dedupe window', () => {
    const { effects } = deriveCursorEffects(
      [
        at(0, { id: 'c1', type: 'click' }),
        at(120, { id: 'c2', type: 'click' }),
        at(240, { id: 'c3', type: 'click' }),
        at(900, { id: 'c4', type: 'click' }),
      ],
      options({ dedupeWindowMs: 300 }),
    );

    expect(effects.map(({ sourceEventId }) => sourceEventId)).toEqual([
      'c1',
      'c4',
    ]);
  });

  it('keeps repeat clicks that fall outside a shortened dedupe window', () => {
    const { effects } = deriveCursorEffects(
      [
        at(0, { id: 'c1', type: 'click' }),
        at(120, { id: 'c2', type: 'click' }),
      ],
      options({ dedupeWindowMs: 100 }),
    );

    expect(effects).toHaveLength(2);
  });

  it('omits ripples when they are turned off', () => {
    const { effects } = deriveCursorEffects(
      [at(0, { id: 'c1', type: 'click' })],
      options({ ripples: false }),
    );

    expect(effects).toEqual([]);
  });

  it('spotlights a hover once per element it enters', () => {
    const { effects } = deriveCursorEffects(
      [
        at(0, { id: 'h1', type: 'over', target: 'button.primary' }),
        at(1000, { id: 'h2', type: 'over', target: 'button.primary' }),
        at(2000, { id: 'h3', type: 'over', target: 'a.nav' }),
      ],
      options({ ripples: false, spotlight: true }),
    );

    expect(effects.map(({ id }) => id)).toEqual([
      'spotlight-h1',
      'spotlight-h3',
    ]);
  });

  describe('auto zoom', () => {
    const autoZoom = {
      enabled: true,
      scale: 1.6,
      leadMs: 400,
      holdMs: 1200,
      minGapMs: 800,
    };

    it('leads each kept click and never starts before the clip does', () => {
      const { effects } = deriveCursorEffects(
        [
          at(100, { id: 'c1', type: 'click' }),
          at(5000, { id: 'c2', type: 'click' }),
        ],
        options({ ripples: false, autoZoom }),
      );

      expect(effects.map(({ tMs }) => tMs)).toEqual([0, 4600]);
      expect(effects[0]).toMatchObject({
        id: 'zoom-c1',
        type: 'zoom',
        origin: 'derived',
        sourceEventId: 'c1',
      });
    });

    it('skips a zoom that would start before the previous one finished holding', () => {
      const { effects } = deriveCursorEffects(
        [
          at(1000, { id: 'c1', type: 'click' }),
          at(1500, { id: 'c2', type: 'click' }),
          at(1800, { id: 'c3', type: 'click' }),
          at(2200, { id: 'c4', type: 'click' }),
        ],
        options({ ripples: false, autoZoom, dedupeWindowMs: 100 }),
      );

      expect(effects.map(({ sourceEventId }) => sourceEventId)).toEqual([
        'c1',
        'c4',
      ]);
    });

    it('is skipped entirely when disabled or scaled to nothing', () => {
      const clicks = [at(0, { id: 'c1', type: 'click' })];

      expect(
        deriveCursorEffects(
          clicks,
          options({
            ripples: false,
            autoZoom: { ...autoZoom, enabled: false },
          }),
        ).effects,
      ).toEqual([]);
      expect(
        deriveCursorEffects(
          clicks,
          options({ ripples: false, autoZoom: { ...autoZoom, scale: 1 } }),
        ).effects,
      ).toEqual([]);
    });
  });

  it('orders every kind of effect by clip time', () => {
    const { effects } = deriveCursorEffects(
      [
        at(2000, { id: 'c1', type: 'click' }),
        at(500, { id: 'h1', type: 'over', target: 'a.nav' }),
      ],
      options({
        spotlight: true,
        autoZoom: {
          enabled: true,
          scale: 2,
          leadMs: 300,
          holdMs: 0,
          minGapMs: 0,
        },
      }),
    );

    expect(effects.map(({ id }) => id)).toEqual([
      'spotlight-h1',
      'zoom-c1',
      'ripple-c1',
    ]);
  });

  it('never returns more effects than the document allows', () => {
    const clicks = Array.from({ length: limits.cursorEffects + 20 }, (_x, i) =>
      at(i * 1000, { id: `c${i}`, type: 'click' }),
    );

    expect(deriveCursorEffects(clicks, options()).effects).toHaveLength(
      limits.cursorEffects,
    );
  });
});

describe('a capture with no start time given', () => {
  // the caller cannot know when the capture ran, and guessing an origin put
  // every event before zero, where they were dropped and nothing was added
  const events = [
    {
      id: 'a',
      type: 'click' as const,
      t: 1_700_000_000_000,
      x: 10,
      y: 10,
      viewportW: 100,
      viewportH: 100,
    },
    {
      id: 'b',
      type: 'click' as const,
      t: 1_700_000_004_000,
      x: 20,
      y: 20,
      viewportW: 100,
      viewportH: 100,
    },
  ];
  const frame = { width: 1920, height: 1080 };

  it('takes its origin from the first event', () => {
    const derived = deriveCursorEffects(events, { frame });

    expect(derived.effects.length).toBeGreaterThan(0);
    expect(derived.effects[0]?.tMs).toBe(0);
  });

  it('keeps every event rather than dropping the lot', () => {
    const wrongOrigin = deriveCursorEffects(events, {
      frame,
      startedAtEpochMs: Date.now(),
    });

    expect(wrongOrigin.effects).toHaveLength(0);
    expect(deriveCursorEffects(events, { frame }).effects).not.toHaveLength(0);
  });
});
