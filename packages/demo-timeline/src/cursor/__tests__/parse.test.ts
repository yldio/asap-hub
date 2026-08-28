import { parseCaptureEvents } from '../parse';

const line = (event: Record<string, unknown>): string => JSON.stringify(event);

const move = (overrides: Record<string, unknown> = {}) => ({
  id: 'e1',
  type: 'move',
  t: 1_000,
  x: 640,
  y: 360,
  viewportW: 1280,
  viewportH: 720,
  devicePixelRatio: 2,
  screenX: 100,
  screenY: 200,
  ...overrides,
});

describe('parseCaptureEvents', () => {
  it('reads one event per line and keeps only the fields the derivation needs', () => {
    expect(parseCaptureEvents(`${line(move())}\n`)).toEqual([
      {
        id: 'e1',
        type: 'move',
        t: 1_000,
        x: 640,
        y: 360,
        viewportW: 1280,
        viewportH: 720,
      },
    ]);
  });

  it('keeps a target when the snippet recorded one', () => {
    const [event] = parseCaptureEvents(
      line(move({ id: 'e2', type: 'over', target: 'button.primary' })),
    );

    expect(event?.target).toBe('button.primary');
  });

  it('ignores blank lines and surrounding whitespace', () => {
    expect(
      parseCaptureEvents(
        `\n  ${line(move())}  \n\n${line(move({ id: 'e2' }))}`,
      ),
    ).toHaveLength(2);
  });

  it('skips a truncated line rather than failing the whole recording', () => {
    const events = parseCaptureEvents(
      [line(move()), '{"id":"e2","type":"mo', line(move({ id: 'e3' }))].join(
        '\n',
      ),
    );

    expect(events.map(({ id }) => id)).toEqual(['e1', 'e3']);
  });

  it.each([
    ['an unknown type', move({ type: 'visibility' })],
    ['a missing id', { ...move(), id: undefined }],
    ['a non-numeric timestamp', move({ t: 'now' })],
    ['a missing viewport', { ...move(), viewportW: undefined }],
    ['an infinite coordinate', move({ x: Infinity })],
  ])('drops a line with %s', (_label, event) => {
    expect(parseCaptureEvents(line(event))).toEqual([]);
  });

  it('drops a line that is not an object', () => {
    expect(parseCaptureEvents('42\n"nope"\nnull')).toEqual([]);
  });
});
