import { useCallback, useEffect, useRef, useState } from 'react';
import {
  extensionForMimeType,
  pickAudioMimeType,
  pickVideoMimeType,
} from './mediaCapabilities';

export type RecordedTake = {
  blob: Blob;
  mimeType: string;
  extension: string;
  durationMs: number;
  startedAtEpochMs: number;
  microphone?: { blob: Blob; mimeType: string; extension: string };
};

export type RecorderStatus = 'idle' | 'recording' | 'paused' | 'finishing';

type RecorderFactory = (
  stream: MediaStream,
  options: { mimeType: string },
) => MediaRecorder;

export type ScreenRecorderOptions = {
  withMicrophone: boolean;
  // the browser's own Stop sharing button ends a take without anyone calling
  // stop(), and the recording still has to be saved
  onEnded?: (take: RecordedTake) => void;
  getDisplayMedia?: (
    constraints: DisplayMediaStreamOptions,
  ) => Promise<MediaStream>;
  getUserMedia?: (constraints: MediaStreamConstraints) => Promise<MediaStream>;
  createRecorder?: RecorderFactory;
  isTypeSupported?: (mimeType: string) => boolean;
  now?: () => number;
};

export type ScreenRecorder = {
  status: RecorderStatus;
  error?: string;
  elapsedMs: number;
  start: () => Promise<void>;
  pause: () => void;
  resume: () => void;
  stop: () => Promise<RecordedTake | undefined>;
};

const displayConstraints: DisplayMediaStreamOptions = {
  video: {
    frameRate: { ideal: 30, max: 60 },
    width: { ideal: 1920 },
    height: { ideal: 1080 },
  },
  audio: false,
};

type Session = {
  recorder: MediaRecorder;
  chunks: Blob[];
  stream: MediaStream;
  mimeType: string;
  finish: () => Promise<void>;
};

const session = (
  recorder: MediaRecorder,
  stream: MediaStream,
  mimeType: string,
): Session => {
  const chunks: Blob[] = [];
  recorder.addEventListener('dataavailable', (event) => {
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  });

  return {
    recorder,
    chunks,
    stream,
    mimeType,
    // ending the share from the browser's own bar stops the recorder for us, and
    // calling stop() on an inactive one throws
    finish: () =>
      new Promise<void>((resolve) => {
        if (recorder.state === 'inactive') {
          resolve();
          return;
        }
        recorder.addEventListener('stop', () => resolve(), { once: true });
        recorder.stop();
      }),
  };
};

const stopTracks = (stream?: MediaStream) =>
  stream?.getTracks().forEach((track) => track.stop());

// a stable default so the hook's callbacks keep their identity between renders
const systemNow = () => Date.now();

// Everything here is driven by MediaRecorder callbacks rather than a frame
// loop, because the studio tab sits in the background for the whole recording
// while the creator is on the tab being demoed, and background tabs are
// throttled.
export const useScreenRecorder = ({
  withMicrophone,
  onEnded,
  getDisplayMedia,
  getUserMedia,
  createRecorder,
  isTypeSupported,
  now = systemNow,
}: ScreenRecorderOptions): ScreenRecorder => {
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [error, setError] = useState<string>();
  const [elapsedMs, setElapsedMs] = useState(0);

  const screenRef = useRef<Session>();
  const micRef = useRef<Session>();
  const stopRef = useRef<() => Promise<RecordedTake | undefined>>();
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;
  const startedAtRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setInterval>>();

  const stopTicking = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = undefined;
    }
  }, []);

  const startTicking = useCallback(() => {
    stopTicking();
    tickRef.current = setInterval(
      () => setElapsedMs(now() - startedAtRef.current),
      500,
    );
  }, [now, stopTicking]);

  // leaving the editor mid take must not leave the browser sharing the screen
  useEffect(
    () => () => {
      if (tickRef.current) {
        clearInterval(tickRef.current);
      }
      stopTracks(screenRef.current?.stream);
      stopTracks(micRef.current?.stream);
    },
    [],
  );

  const start = useCallback(async () => {
    setError(undefined);

    const display =
      getDisplayMedia ??
      navigator.mediaDevices?.getDisplayMedia.bind(navigator.mediaDevices);
    const user =
      getUserMedia ??
      navigator.mediaDevices?.getUserMedia.bind(navigator.mediaDevices);
    const factory: RecorderFactory =
      createRecorder ??
      ((stream, options) => new MediaRecorder(stream, options));
    const supported =
      isTypeSupported ??
      ((mimeType: string) => MediaRecorder.isTypeSupported(mimeType));

    const videoMimeType = pickVideoMimeType(supported);
    if (!display || !videoMimeType) {
      setError('This browser cannot record a screen.');
      return;
    }

    if (screenRef.current) {
      return;
    }

    let stream: MediaStream;
    try {
      stream = await display(displayConstraints);
    } catch (cause) {
      setError(
        cause instanceof Error && cause.name === 'NotAllowedError'
          ? 'Screen sharing was declined.'
          : 'Could not start the recording.',
      );
      setStatus('idle');
      return;
    }

    try {
      const recorder = factory(stream, { mimeType: videoMimeType });
      screenRef.current = session(recorder, stream, videoMimeType);

      // the picker's own Stop sharing button ends the take as well, and it has
      // to finish the recording rather than only relabel it
      stream.getVideoTracks().forEach((track) => {
        track.addEventListener('ended', () => {
          setStatus('finishing');
          void stopRef.current?.().then((take) => {
            if (take && take.blob.size > 0) {
              onEndedRef.current?.(take);
            }
          });
        });
      });

      // a microphone the creator refuses is not a reason to abandon the take,
      // but it used to leave the screen shared with no way left to stop it
      if (withMicrophone && user) {
        const micMimeType = pickAudioMimeType(supported);
        if (micMimeType) {
          try {
            const micStream = await user({
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
              },
            });
            const micRecorder = factory(micStream, { mimeType: micMimeType });
            micRef.current = session(micRecorder, micStream, micMimeType);
            micRecorder.start(5000);
          } catch {
            setError('The microphone was not available, recording without it.');
          }
        }
      }

      startedAtRef.current = now();
      setElapsedMs(0);
      recorder.start(5000);
      setStatus('recording');
      startTicking();
    } catch {
      stopTracks(stream);
      stopTracks(micRef.current?.stream);
      screenRef.current = undefined;
      micRef.current = undefined;
      setError('Could not start the recording.');
      setStatus('idle');
    }
  }, [
    createRecorder,
    getDisplayMedia,
    getUserMedia,
    isTypeSupported,
    now,
    startTicking,
    withMicrophone,
  ]);

  const pause = useCallback(() => {
    screenRef.current?.recorder.pause();
    micRef.current?.recorder.pause();
    stopTicking();
    setStatus('paused');
  }, [stopTicking]);

  const resume = useCallback(() => {
    screenRef.current?.recorder.resume();
    micRef.current?.recorder.resume();
    startTicking();
    setStatus('recording');
  }, [startTicking]);

  const stop = useCallback(async (): Promise<RecordedTake | undefined> => {
    const screen = screenRef.current;
    if (!screen) {
      return undefined;
    }
    setStatus('finishing');
    stopTicking();

    await screen.finish();
    const mic = micRef.current;
    if (mic) {
      await mic.finish();
    }

    stopTracks(screen.stream);
    stopTracks(mic?.stream);
    screenRef.current = undefined;
    micRef.current = undefined;
    setStatus('idle');

    const durationMs = now() - startedAtRef.current;
    return {
      blob: new Blob(screen.chunks, { type: screen.mimeType }),
      mimeType: screen.mimeType,
      extension: extensionForMimeType(screen.mimeType),
      durationMs,
      startedAtEpochMs: startedAtRef.current,
      ...(mic && mic.chunks.length > 0
        ? {
            microphone: {
              blob: new Blob(mic.chunks, { type: mic.mimeType }),
              mimeType: mic.mimeType,
              extension: extensionForMimeType(mic.mimeType),
            },
          }
        : {}),
    };
  }, [now, stopTicking]);

  stopRef.current = stop;

  return { status, error, elapsedMs, start, pause, resume, stop };
};
