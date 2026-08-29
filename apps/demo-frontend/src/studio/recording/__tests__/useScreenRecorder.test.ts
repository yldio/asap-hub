import { act, renderHook, waitFor } from '@testing-library/react';
import { useScreenRecorder } from '../useScreenRecorder';

type FakeRecorder = MediaRecorder & {
  emit: (size: number) => void;
  started: number | undefined;
};

const fakeRecorder = (): FakeRecorder => {
  const listeners: Record<string, ((event: { data: Blob }) => void)[]> = {};
  const recorder = {
    state: 'inactive',
    started: undefined as number | undefined,
    addEventListener(type: string, listener: (event: { data: Blob }) => void) {
      listeners[type] = [...(listeners[type] ?? []), listener];
    },
    start(timeslice?: number) {
      recorder.started = timeslice;
      recorder.state = 'recording';
    },
    stop() {
      recorder.state = 'inactive';
      listeners.stop?.forEach((listener) => listener({ data: new Blob([]) }));
    },
    pause() {
      recorder.state = 'paused';
    },
    resume() {
      recorder.state = 'recording';
    },
    emit(size: number) {
      listeners.dataavailable?.forEach((listener) =>
        listener({ data: new Blob(['x'.repeat(size)]) }),
      );
    },
  };
  return recorder as unknown as FakeRecorder;
};

const fakeStream = (displaySurface?: string) => {
  const ended: (() => void)[] = [];
  const track = {
    stop: jest.fn(),
    getSettings: () => (displaySurface ? { displaySurface } : {}),
    addEventListener: jest.fn((type: string, listener: () => void) => {
      if (type === 'ended') ended.push(listener);
    }),
    end: () => ended.forEach((listener) => listener()),
  };
  return {
    getTracks: () => [track],
    getVideoTracks: () => [track],
    track,
  } as unknown as MediaStream & { track: typeof track };
};

const setup = (
  overrides: Record<string, unknown> = {},
  displaySurface?: string,
) => {
  const recorders: FakeRecorder[] = [];
  const stream = fakeStream(displaySurface);
  const options = {
    withMicrophone: false,
    getDisplayMedia: jest.fn().mockResolvedValue(stream),
    getUserMedia: jest.fn().mockResolvedValue(fakeStream()),
    createRecorder: jest.fn(() => {
      const recorder = fakeRecorder();
      recorders.push(recorder);
      return recorder;
    }),
    isTypeSupported: (mimeType: string) =>
      mimeType === 'video/webm;codecs=vp9,opus' ||
      mimeType === 'audio/webm;codecs=opus',
    now: jest.fn(() => 1000),
    ...overrides,
  };

  const view = renderHook(() => useScreenRecorder(options));
  return { view, recorders, options, stream };
};

it('starts idle', () => {
  const { view } = setup();

  expect(view.result.current.status).toBe('idle');
});

it('captures the screen and reports that it is recording', async () => {
  const { view, options, recorders } = setup();

  await act(async () => {
    await view.result.current.start();
  });

  expect(options.getDisplayMedia).toHaveBeenCalled();
  expect(view.result.current.status).toBe('recording');
  // chunked so a long take streams rather than being held whole in memory
  expect(recorders[0]?.started).toBe(5000);
});

it('does not open the microphone unless it was asked to', async () => {
  const { view, options } = setup();

  await act(async () => {
    await view.result.current.start();
  });

  expect(options.getUserMedia).not.toHaveBeenCalled();
});

it('records the microphone alongside the screen when asked', async () => {
  const { view, options, recorders } = setup({ withMicrophone: true });

  await act(async () => {
    await view.result.current.start();
  });

  expect(options.getUserMedia).toHaveBeenCalled();
  expect(recorders).toHaveLength(2);
});

it('hands back the take when it stops', async () => {
  const { view, recorders } = setup();

  await act(async () => {
    await view.result.current.start();
  });
  act(() => recorders[0]?.emit(64));

  let take;
  await act(async () => {
    take = await view.result.current.stop();
  });

  expect(take).toMatchObject({
    mimeType: 'video/webm;codecs=vp9,opus',
    extension: 'webm',
  });
  expect(view.result.current.status).toBe('idle');
});

it('releases the capture when it stops', async () => {
  const { view, stream } = setup();

  await act(async () => {
    await view.result.current.start();
  });
  await act(async () => {
    await view.result.current.stop();
  });

  expect(stream.track.stop).toHaveBeenCalled();
});

it('releases the capture when the editor goes away mid take', async () => {
  const { view, stream } = setup();

  await act(async () => {
    await view.result.current.start();
  });
  view.unmount();

  expect(stream.track.stop).toHaveBeenCalled();
});

it('pauses and resumes', async () => {
  const { view } = setup();

  await act(async () => {
    await view.result.current.start();
  });
  act(() => view.result.current.pause());
  expect(view.result.current.status).toBe('paused');

  act(() => view.result.current.resume());
  expect(view.result.current.status).toBe('recording');
});

// a pause stops the recorder, so the file holds none of it; counting the wall
// clock alone reported 0:35 for a take that was only 0:27 of footage
describe('a take that was paused', () => {
  const clock = () => {
    let atMs = 1000;
    return Object.assign(() => atMs, {
      advance: (ms: number) => {
        atMs += ms;
      },
    });
  };

  it('reports only the time it was actually recording', async () => {
    const now = clock();
    const { view } = setup({ now });

    await act(async () => {
      await view.result.current.start();
    });
    now.advance(18000);
    act(() => view.result.current.pause());
    now.advance(9000);
    act(() => view.result.current.resume());
    now.advance(9000);

    let take;
    await act(async () => {
      take = await view.result.current.stop();
    });

    expect(take).toMatchObject({ durationMs: 27000 });
  });

  it('reports the same length when it is stopped while still paused', async () => {
    const now = clock();
    const { view } = setup({ now });

    await act(async () => {
      await view.result.current.start();
    });
    now.advance(5000);
    act(() => view.result.current.pause());
    now.advance(20000);

    let take;
    await act(async () => {
      take = await view.result.current.stop();
    });

    expect(take).toMatchObject({ durationMs: 5000 });
  });
});

it('explains a declined screen share', async () => {
  const declined = Object.assign(new Error('no'), { name: 'NotAllowedError' });
  const { view } = setup({
    getDisplayMedia: jest.fn().mockRejectedValue(declined),
  });

  await act(async () => {
    await view.result.current.start();
  });

  await waitFor(() =>
    expect(view.result.current.error).toBe('Screen sharing was declined.'),
  );
  expect(view.result.current.status).toBe('idle');
});

it('refuses to start when no format is supported', async () => {
  const { view, options } = setup({ isTypeSupported: () => false });

  await act(async () => {
    await view.result.current.start();
  });

  expect(options.getDisplayMedia).not.toHaveBeenCalled();
  expect(view.result.current.error).toMatch(/cannot record/);
});

describe('when the browser ends the share', () => {
  // Chrome's own Stop sharing bar is how most takes end. It used to only set a
  // label, so nothing was saved and the microphone stayed live.
  it('finishes the take and hands it over', async () => {
    const onEnded = jest.fn();
    const { view, recorders, stream } = setup({ onEnded });

    await act(async () => {
      await view.result.current.start();
    });
    act(() => recorders[0]?.emit(16));
    await act(async () => {
      stream.track.end();
    });

    await waitFor(() => expect(onEnded).toHaveBeenCalled());
    expect(onEnded.mock.calls[0]?.[0]?.blob.size).toBe(16);
    expect(stream.track.stop).toHaveBeenCalled();
    await waitFor(() => expect(view.result.current.status).toBe('idle'));
  });
});

describe('when the microphone is refused', () => {
  it('records without it rather than leaving the screen shared', async () => {
    const { view, stream } = setup({
      withMicrophone: true,
      getUserMedia: jest.fn().mockRejectedValue(new Error('NotAllowedError')),
    });

    await act(async () => {
      await view.result.current.start();
    });

    expect(view.result.current.status).toBe('recording');
    expect(stream.track.stop).not.toHaveBeenCalled();

    const take = await act(async () => view.result.current.stop());
    expect(take?.microphone).toBeUndefined();
    expect(stream.track.stop).toHaveBeenCalled();
  });
});

describe('starting twice', () => {
  it('does not orphan the first stream', async () => {
    const { view, options } = setup();

    await act(async () => {
      await view.result.current.start();
    });
    await act(async () => {
      await view.result.current.start();
    });

    expect(options.getDisplayMedia).toHaveBeenCalledTimes(1);
  });
});

// without it the browser is free to leave the pointer out, and a tab capture
// and a Wayland screen capture both do: the recording comes back with no cursor
// in it, which is not a demo of anything
it('asks for the pointer to be drawn into the recording', async () => {
  const { view, options } = setup();

  await act(async () => {
    await view.result.current.start();
  });

  const [request] = options.getDisplayMedia.mock.calls[0] ?? [];
  expect(request?.video).toMatchObject({ cursor: 'always' });
});

// The capture snippet runs in the page being demoed and cannot know whether the
// creator handed over that tab, the window or the whole screen, yet that is what
// decides where the page sits in the recorded frame.
describe('what the picker was pointed at', () => {
  it('knows nothing before a recording has been started', () => {
    expect(setup().view.result.current.displaySurface).toBeUndefined();
  });

  it.each(['browser', 'window', 'monitor'])(
    'reports a %s share as soon as the take starts',
    async (surface) => {
      const { view } = setup({}, surface);

      await act(async () => {
        await view.result.current.start();
      });

      expect(view.result.current.displaySurface).toBe(surface);
    },
  );

  it('ignores a surface it has no mapping for', async () => {
    const { view } = setup({}, 'application');

    await act(async () => {
      await view.result.current.start();
    });

    expect(view.result.current.displaySurface).toBeUndefined();
  });

  it('still knows it once the take is saved, which is when it is needed', async () => {
    const { view, recorders } = setup({}, 'monitor');

    await act(async () => {
      await view.result.current.start();
    });
    act(() => recorders[0]?.emit(10));
    const take = await act(async () => view.result.current.stop());

    expect(take).toEqual(expect.objectContaining({ surface: 'monitor' }));
    expect(view.result.current.displaySurface).toBe('monitor');
  });
});
