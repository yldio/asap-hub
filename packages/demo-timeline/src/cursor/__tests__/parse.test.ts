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
  // the screen geometry is what places a whole screen or a window recording, so
  // it is kept; the pixel ratio divides out of every ratio and is not
  it('reads one event per line and keeps only the fields the derivation needs', () => {
    expect(parseCaptureEvents(`${line(move())}\n`)).toEqual([
      {
        id: 'e1',
        type: 'move',
        screenX: 100,
        screenY: 200,
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

// a whole screen or a window recording cannot be placed without them
describe('the screen geometry', () => {
  it('reads every field the mappings need', () => {
    const [event] = parseCaptureEvents(
      line(
        move({
          screenW: 1920,
          screenH: 1080,
          screenLeft: -1920,
          screenTop: 0,
          winX: 40,
          winY: 25,
          winW: 1280,
          winH: 800,
        }),
      ),
    );

    expect(event).toEqual(
      expect.objectContaining({
        screenW: 1920,
        screenH: 1080,
        screenLeft: -1920,
        screenTop: 0,
        winX: 40,
        winY: 25,
        winW: 1280,
        winH: 800,
      }),
    );
  });

  it('leaves out anything the snippet did not send, rather than inventing a zero', () => {
    const [event] = parseCaptureEvents(
      line({
        id: 'e3',
        type: 'move',
        t: 1000,
        x: 10,
        y: 20,
        viewportW: 800,
        viewportH: 600,
      }),
    );

    expect(event).not.toHaveProperty('screenW');
    expect(event).not.toHaveProperty('winX');
  });

  it('drops a field that is not a number at all', () => {
    const [event] = parseCaptureEvents(line(move({ screenW: 'wide' })));

    expect(event).not.toHaveProperty('screenW');
    expect(event?.screenX).toBe(100);
  });
});
