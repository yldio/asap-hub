import { act, renderHook, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';

import { CaptureSurface, CursorEffect } from '@asap-hub/demo-timeline';
import { TestApiProvider } from '../../../api/ApiProvider';
import type { Api } from '../../../api/client';
import { AuthContext, AuthState } from '../../../auth/AuthProvider';
import { authenticatedState } from '../../../test-utils';
import { useCursorCapture } from '../useCursorCapture';

const session = {
  sessionId: 'session-1',
  token: 'token-1',
  snippetUrl: 'http://localhost/capture/v1.js#project.project-1.first',
  bookmarkReady: false,
  captureUrl: 'http://localhost/capture',
  expiresAt: new Date(Date.now() + 3_600_000).toISOString(),
};

const open = { state: 'open' as const, eventCount: 42, clientCount: 1 };

const render = (api: Partial<Api>, recorded?: CaptureSurface) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthContext.Provider value={authenticatedState as AuthState}>
      <TestApiProvider api={api}>{children}</TestApiProvider>
    </AuthContext.Provider>
  );
  return renderHook(() => useCursorCapture('project-1', recorded), { wrapper });
};

beforeEach(() => window.localStorage.clear());

// a reload used to strand every event already captured: no session meant no
// status, and no status disabled the button that applies them
it('finds the session again after a reload', async () => {
  const startCapture = jest.fn().mockResolvedValue(session);
  const captureStatus = jest.fn().mockResolvedValue(open);

  const first = render({ startCapture, captureStatus });
  first.result.current.start();
  await waitFor(() => expect(first.result.current.session).toEqual(session));
  first.unmount();

  const second = render({ startCapture, captureStatus });

  expect(second.result.current.session).toEqual(session);
  await waitFor(() => expect(second.result.current.status).toEqual(open));
  expect(startCapture).toHaveBeenCalledTimes(1);
});

it('lets go of a session the server no longer has', async () => {
  window.localStorage.setItem(
    'demo-hub.capture.project-1',
    JSON.stringify(session),
  );
  const captureStatus = jest.fn().mockRejectedValue(new Error('gone'));

  const view = render({ captureStatus });

  await waitFor(() => expect(view.result.current.session).toBeUndefined());
  expect(window.localStorage.getItem('demo-hub.capture.project-1')).toBeNull();
});

// the bookmark is handed out the once it is minted, so a creator who lost
// theirs asks for another and has to be shown it in the panel they are looking at
it('keeps a replacement bookmark on the session it is showing', async () => {
  const startCapture = jest.fn().mockResolvedValue({
    ...session,
    snippetUrl: undefined,
    bookmarkReady: true,
  });
  const captureStatus = jest.fn().mockResolvedValue(open);
  const newCaptureBookmark = jest.fn().mockResolvedValue({
    snippetUrl: 'http://localhost/capture/v1.js#project.project-1.second',
    captureUrl: 'http://localhost/capture',
  });

  const view = render({ startCapture, captureStatus, newCaptureBookmark });
  await act(async () => view.result.current.start());
  await waitFor(() => expect(view.result.current.session).toBeDefined());

  await act(async () => view.result.current.newBookmark());

  await waitFor(() =>
    expect(view.result.current.session?.snippetUrl).toBe(
      'http://localhost/capture/v1.js#project.project-1.second',
    ),
  );
  // and it survives the reload the panel used to lose it on
  expect(window.localStorage.getItem('demo-hub.capture.project-1')).toContain(
    'project-1.second',
  );
});

it('reports a bookmark it could not replace', async () => {
  const startCapture = jest.fn().mockResolvedValue(session);
  const captureStatus = jest.fn().mockResolvedValue(open);
  const newCaptureBookmark = jest.fn().mockRejectedValue(new Error('nope'));

  const view = render({ startCapture, captureStatus, newCaptureBookmark });
  await act(async () => view.result.current.start());
  await waitFor(() => expect(view.result.current.session).toBeDefined());

  await act(async () => view.result.current.newBookmark());

  await waitFor(() =>
    expect(view.result.current.error).toBe(
      'Could not make a new capture bookmark.',
    ),
  );
  expect(view.result.current.session?.snippetUrl).toBe(session.snippetUrl);
});

it('does not offer a bookmark stored from before it named the project', async () => {
  window.localStorage.setItem(
    'demo-hub.capture.project-1',
    JSON.stringify({ ...session, snippetUrl: 'http://localhost/v1.js#s1.tok' }),
  );

  const view = render({ captureStatus: jest.fn().mockResolvedValue(open) });
  await waitFor(() => expect(view.result.current.status).toEqual(open));

  expect(view.result.current.session?.sessionId).toBe('session-1');
  expect(view.result.current.session?.snippetUrl).toBeUndefined();
});

// The whole screen holds the OS bar, the browser chrome and the page inside it,
// so stretching the page across the frame threw every click hundreds of pixels
// off. The recorder is the only thing that knows which it was.
describe('mapping a capture onto what was recorded', () => {
  const event = {
    id: 'e1',
    type: 'click',
    t: 1000,
    x: 1129.4,
    y: 593.1,
    viewportW: 1134,
    viewportH: 943,
    screenX: 1129.4,
    screenY: 680.1,
    screenW: 1920,
    screenH: 1080,
    screenLeft: 0,
    screenTop: 0,
    winX: 0,
    winY: 0,
    winW: 1134,
    winH: 1030,
  };

  const applied = async (
    recorded?: CaptureSurface,
    stored?: CaptureSurface,
  ) => {
    const view = render(
      {
        startCapture: jest.fn().mockResolvedValue(session),
        captureStatus: jest.fn().mockResolvedValue(open),
        finaliseCapture: jest.fn().mockResolvedValue(undefined),
        captureEvents: jest.fn().mockResolvedValue(JSON.stringify(event)),
      },
      recorded,
    );
    await act(async () => view.result.current.start());
    await waitFor(() => expect(view.result.current.session).toBeDefined());

    const results = await act(async () =>
      view.result.current.apply({
        stoppedAtEpochMs: 2000,
        frame: { width: 1920, height: 1080 },
        targets: [
          {
            clipId: 'clip-1',
            existing: [],
            ...(stored ? { surface: stored } : {}),
          },
        ],
      }),
    );
    return results?.[0];
  };

  it('places a whole screen take by the screen', async () => {
    const result = await applied('monitor');

    expect(result?.effects[0]?.point.x).toBeCloseTo(1129.4 / 1920, 3);
    expect(result?.surface).toBe('monitor');
  });

  it('places a tab take by the page, as it always did', async () => {
    const result = await applied('browser');

    expect(result?.effects[0]?.point.x).toBeGreaterThan(0.8);
  });

  it('falls back to what the layer was mapped through before', async () => {
    const result = await applied(undefined, 'monitor');

    expect(result?.surface).toBe('monitor');
    expect(result?.effects[0]?.point.x).toBeCloseTo(1129.4 / 1920, 3);
  });

  it('lets the live recorder overrule a stale one on the layer', async () => {
    const result = await applied('monitor', 'browser');

    expect(result?.surface).toBe('monitor');
  });
});

// The creator starts the take, switches to the tab they are demoing and only
// then clicks the bookmark. Reading the capture from its own first event drew
// every click that delay early: measured at 4286ms on a real capture.
describe('lining a capture up with the take', () => {
  const startedAtEpochMs = 1_700_000_000_000;
  const bookmarkDelayMs = 4286;
  const clickAtMs = 28_600;

  const ndjson = [
    {
      id: 'first',
      type: 'move',
      t: startedAtEpochMs + bookmarkDelayMs,
      x: 640,
      y: 360,
    },
    {
      id: 'click',
      type: 'click',
      t: startedAtEpochMs + clickAtMs,
      x: 640,
      y: 360,
    },
  ]
    .map((line) => JSON.stringify({ ...line, viewportW: 1280, viewportH: 720 }))
    .join('\n');

  const applied = async (origin?: number) => {
    const view = render({
      startCapture: jest.fn().mockResolvedValue(session),
      captureStatus: jest.fn().mockResolvedValue(open),
      finaliseCapture: jest.fn().mockResolvedValue(undefined),
      captureEvents: jest.fn().mockResolvedValue(ndjson),
    });
    await act(async () => view.result.current.start());
    await waitFor(() => expect(view.result.current.session).toBeDefined());

    const results = await act(async () =>
      view.result.current.apply({
        stoppedAtEpochMs: startedAtEpochMs + 60_000,
        frame: { width: 1280, height: 720 },
        targets: [
          {
            clipId: 'clip-1',
            existing: [],
            ...(origin ? { startedAtEpochMs: origin } : {}),
          },
        ],
      }),
    );
    return results?.[0];
  };

  // this hook is mounted fresh, the way it is after a reload: the origin only
  // reaches it because the document kept it on the clip
  it('times the capture from the take start the document kept', async () => {
    const result = await applied(startedAtEpochMs);

    expect(result?.effects[0]?.tMs).toBe(clickAtMs);
    expect(result?.path[0]?.tMs).toBe(bookmarkDelayMs);
  });

  it('falls back to the first event for a clip with no take start', async () => {
    const result = await applied();

    expect(result?.effects[0]?.tMs).toBe(24_314);
    expect(result?.path[0]?.tMs).toBe(0);
  });
});

// One session collects everything from the first take to the apply: take one,
// the fiddling in the studio between takes, take two. Each take's clip carries
// its own start and length, so each gets its own slice of the stream.
describe('two takes captured in one session', () => {
  const takeOneStart = 1_700_000_000_000;
  const takeOneClickMs = 2_000;
  // stopped after 10s, recorded again 30s later
  const takeTwoStart = takeOneStart + 40_000;
  const takeTwoClickMs = 3_000;

  const ndjson = [
    { id: 'c1', type: 'click', t: takeOneStart + takeOneClickMs },
    { id: 'between', type: 'click', t: takeOneStart + 20_000 },
    { id: 'c2', type: 'click', t: takeTwoStart + takeTwoClickMs },
  ]
    .map((line) =>
      JSON.stringify({
        ...line,
        x: 640,
        y: 360,
        viewportW: 1280,
        viewportH: 720,
      }),
    )
    .join('\n');

  const view = async () => {
    const rendered = render({
      startCapture: jest.fn().mockResolvedValue(session),
      captureStatus: jest.fn().mockResolvedValue(open),
      finaliseCapture: jest.fn().mockResolvedValue(undefined),
      captureEvents: jest.fn().mockResolvedValue(ndjson),
    });
    await act(async () => rendered.result.current.start());
    await waitFor(() => expect(rendered.result.current.session).toBeDefined());
    return rendered;
  };

  const targets = (existingOnTakeOne: CursorEffect[] = []) => [
    {
      clipId: 'clip-take-1',
      existing: existingOnTakeOne,
      startedAtEpochMs: takeOneStart,
      durationMs: 10_000,
    },
    {
      clipId: 'clip-take-2',
      existing: [],
      startedAtEpochMs: takeTwoStart,
      durationMs: 8_000,
    },
  ];

  it('lands each take on its own clip at its own times', async () => {
    const rendered = await view();

    const applied = await act(async () =>
      rendered.result.current.apply({
        stoppedAtEpochMs: takeTwoStart + 8_000,
        frame: { width: 1280, height: 720 },
        targets: targets(),
      }),
    );

    expect(applied?.map(({ clipId }) => clipId)).toEqual([
      'clip-take-1',
      'clip-take-2',
    ]);
    expect(applied?.[0]?.effects.map(({ tMs }) => tMs)).toEqual([
      takeOneClickMs,
    ]);
    expect(applied?.[1]?.effects.map(({ tMs }) => tMs)).toEqual([
      takeTwoClickMs,
    ]);
    // the click between the takes was filming nothing and lands nowhere
    expect(applied?.[0]?.path.map(({ tMs }) => tMs)).toEqual([takeOneClickMs]);
    expect(applied?.[1]?.path.map(({ tMs }) => tMs)).toEqual([takeTwoClickMs]);
  });

  it('keeps a hand moved effect on one clip while refreshing the other', async () => {
    const rendered = await view();
    const moved = {
      id: 'ripple-c1',
      tMs: 1_234,
      type: 'ripple' as const,
      point: { x: 0.9, y: 0.9 },
      origin: 'derived-edited' as const,
      sourceEventId: 'c1',
    };

    const applied = await act(async () =>
      rendered.result.current.apply({
        stoppedAtEpochMs: takeTwoStart + 8_000,
        frame: { width: 1280, height: 720 },
        targets: targets([moved]),
      }),
    );

    expect(applied?.[0]?.effects).toEqual([moved]);
    expect(applied?.[1]?.effects[0]).toMatchObject({
      tMs: takeTwoClickMs,
      origin: 'derived',
      sourceEventId: 'c2',
    });
  });

  it('says so when no event fell inside any take', async () => {
    const rendered = await view();

    const applied = await act(async () =>
      rendered.result.current.apply({
        stoppedAtEpochMs: takeTwoStart + 8_000,
        frame: { width: 1280, height: 720 },
        targets: [
          {
            clipId: 'clip-elsewhere',
            existing: [],
            startedAtEpochMs: takeOneStart - 500_000,
            durationMs: 10_000,
          },
        ],
      }),
    );

    expect(applied).toBeUndefined();
    expect(rendered.result.current.error).toBe(
      'That capture has no events during any recorded take.',
    );
  });
});
