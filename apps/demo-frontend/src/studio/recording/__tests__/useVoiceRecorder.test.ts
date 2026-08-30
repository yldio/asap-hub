import { act, renderHook, waitFor } from '@testing-library/react';
import { useVoiceRecorder } from '../useVoiceRecorder';

const fakeRecorder = () => {
  const listeners: Record<string, ((event: { data: Blob }) => void)[]> = {};
  const recorder = {
    state: 'inactive',
    mimeType: 'audio/webm;codecs=opus',
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
  };
  return recorder as unknown as MediaRecorder & {
    started: number | undefined;
  };
};

const fakeStream = () => {
  const track = { stop: jest.fn() };
  return {
    getTracks: () => [track],
    track,
  } as unknown as MediaStream & { track: { stop: jest.Mock } };
};

const setup = (overrides: Record<string, unknown> = {}) => {
  const stream = fakeStream();
  const recorder = fakeRecorder();
  const view = renderHook(() =>
    useVoiceRecorder({
      getUserMedia: jest.fn().mockResolvedValue(stream),
      createRecorder: () => recorder,
      isTypeSupported: () => true,
      ...overrides,
    }),
  );
  return { view, stream, recorder };
};

describe('a countdown before the voice over', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('asks for the microphone first, then counts, then records', async () => {
    let clock = 0;
    const { view, recorder } = setup({
      countdownMs: 3000,
      now: jest.fn(() => clock),
    });

    await act(async () => {
      await view.result.current.start();
    });
    expect(view.result.current.status).toBe('counting');
    expect(view.result.current.countdownMsLeft).toBe(3000);
    expect(recorder.started).toBeUndefined();

    clock = 3200;
    act(() => {
      jest.advanceTimersByTime(400);
    });
    await waitFor(() => expect(view.result.current.status).toBe('recording'));
    expect(recorder.started).toBe(5000);
  });

  it('skips the rest of the count on start now', async () => {
    const { view, recorder } = setup({ countdownMs: 3000 });

    await act(async () => {
      await view.result.current.start();
    });
    act(() => {
      view.result.current.startNow();
    });

    expect(view.result.current.status).toBe('recording');
    expect(recorder.started).toBe(5000);
  });

  it('hands the microphone back when the count is cancelled', async () => {
    const { view, stream, recorder } = setup({ countdownMs: 3000 });

    await act(async () => {
      await view.result.current.start();
    });
    act(() => {
      view.result.current.cancel();
    });

    expect(view.result.current.status).toBe('idle');
    expect(stream.track.stop).toHaveBeenCalled();
    expect(recorder.started).toBeUndefined();
  });

  it('records at once when no grace was asked for', async () => {
    const { view, recorder } = setup();

    await act(async () => {
      await view.result.current.start();
    });

    expect(view.result.current.status).toBe('recording');
    expect(recorder.started).toBe(5000);
  });
});
