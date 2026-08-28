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

const fakeStream = () => {
  const track = { stop: jest.fn(), addEventListener: jest.fn() };
  return {
    getTracks: () => [track],
    getVideoTracks: () => [track],
    track,
  } as unknown as MediaStream & { track: typeof track };
};

const setup = (overrides: Record<string, unknown> = {}) => {
  const recorders: FakeRecorder[] = [];
  const stream = fakeStream();
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
