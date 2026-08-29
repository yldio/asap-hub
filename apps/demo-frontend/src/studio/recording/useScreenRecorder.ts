import { CaptureSurface, captureSurfaces } from '@asap-hub/demo-timeline';
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
  // browser, window or monitor: what the picker was pointed at
  surface?: CaptureSurface;
  microphone?: { blob: Blob; mimeType: string; extension: string };
};

export type RecorderStatus =
  | 'idle'
  | 'counting'
  | 'recording'
  | 'paused'
  | 'finishing';

// What the creator actually handed over in the picker, which is what the frame
// shows and so which of a capture's coordinates land on it. `displaySurface` is
// not in the DOM lib's settings type, and a browser that does not report it
// leaves the studio with nothing to guess from.
type DisplayTrackSettings = MediaTrackSettings & { displaySurface?: string };

const isCaptureSurface = (value: unknown): value is CaptureSurface =>
  typeof value === 'string' &&
  (captureSurfaces as readonly string[]).includes(value);

export const sharedSurface = (
  stream: MediaStream,
): CaptureSurface | undefined => {
  const settings = stream.getVideoTracks()[0]?.getSettings?.() as
    | DisplayTrackSettings
    | undefined;
  return isCaptureSurface(settings?.displaySurface)
    ? settings?.displaySurface
    : undefined;
};

type RecorderFactory = (
  stream: MediaStream,
  options: { mimeType: string },
) => MediaRecorder;

export type ScreenRecorderOptions = {
  withMicrophone: boolean;
  // how long the screen is shared before the recorder actually starts, so the
  // creator has time to get to the tab they are demoing; the take begins when
  // the count ends, which is the instant its startedAtEpochMs records
  countdownMs?: number;
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
  countdownMsLeft: number;
  // what the last take was a recording of; it outlives the take, because the
  // cursor capture is applied after the recording has already been saved
  displaySurface?: CaptureSurface;
  start: () => Promise<void>;
  // both are only meaningful while the count is running: one lets the take
  // begin at once, the other hands the screen back without recording anything
  startNow: () => void;
  cancel: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => Promise<RecordedTake | undefined>;
};

// `cursor` is not in the DOM lib's constraint type, but it is what decides
// whether the pointer is drawn into the captured frames at all. Left out, a tab
// capture and a Wayland screen capture both hand back a recording with no
// pointer in it, which is not a demo of anything.
type DisplayVideoConstraints = MediaTrackConstraints & {
  cursor?: 'always' | 'motion' | 'never';
};

const displayConstraints: DisplayMediaStreamOptions = {
  video: {
    frameRate: { ideal: 30, max: 60 },
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    cursor: 'always',
  } as DisplayVideoConstraints,
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
  countdownMs = 0,
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
  const [countdownMsLeft, setCountdownMsLeft] = useState(0);
  const [displaySurface, setDisplaySurface] = useState<CaptureSurface>();
  // read while the track is still live: a stopped track reports nothing
  const surfaceRef = useRef<CaptureSurface>();

  const screenRef = useRef<Session>();
  const micRef = useRef<Session>();
  const stopRef = useRef<() => Promise<RecordedTake | undefined>>();
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;
  const startedAtRef = useRef(0);
  // A pause stops the recorder, so the file it writes holds none of it. Counting
  // the wall clock alone reported a take longer than the footage and put a clip
  // on the timeline with the paused span frozen into it.
  const pausedMsRef = useRef(0);
  const pausedAtRef = useRef<number>();
  const tickRef = useRef<ReturnType<typeof setInterval>>();
  const countdownRef = useRef<ReturnType<typeof setInterval>>();
  const beginRef = useRef<() => void>();

  const stopCounting = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = undefined;
    }
    beginRef.current = undefined;
    setCountdownMsLeft(0);
  }, []);

  const recordedMs = useCallback(
    (): number =>
      now() -
      startedAtRef.current -
      pausedMsRef.current -
      (pausedAtRef.current === undefined ? 0 : now() - pausedAtRef.current),
    [now],
  );

  const stopTicking = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = undefined;
    }
  }, []);

  const startTicking = useCallback(() => {
    stopTicking();
    tickRef.current = setInterval(() => setElapsedMs(recordedMs()), 500);
  }, [recordedMs, stopTicking]);

  // leaving the editor mid take must not leave the browser sharing the screen
  useEffect(
    () => () => {
      if (tickRef.current) {
        clearInterval(tickRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
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
      surfaceRef.current = sharedSurface(stream);
      setDisplaySurface(surfaceRef.current);
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
          } catch {
            setError('The microphone was not available, recording without it.');
          }
        }
      }

      const begin = () => {
        beginRef.current = undefined;
        try {
          startedAtRef.current = now();
          pausedMsRef.current = 0;
          pausedAtRef.current = undefined;
          setElapsedMs(0);
          micRef.current?.recorder.start(5000);
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
      };

      if (countdownMs > 0) {
        // the wall clock, not the interval, decides when the count ends: the
        // studio tab sits in the background while the creator gets to the tab
        // they are demoing, and background intervals are throttled
        setStatus('counting');
        setCountdownMsLeft(countdownMs);
        beginRef.current = begin;
        const deadline = now() + countdownMs;
        countdownRef.current = setInterval(() => {
          const left = deadline - now();
          if (left > 0) {
            setCountdownMsLeft(left);
            return;
          }
          stopCounting();
          begin();
        }, 200);
      } else {
        begin();
      }
    } catch {
      stopTracks(stream);
      stopTracks(micRef.current?.stream);
      screenRef.current = undefined;
      micRef.current = undefined;
      setError('Could not start the recording.');
      setStatus('idle');
    }
  }, [
    countdownMs,
    createRecorder,
    getDisplayMedia,
    getUserMedia,
    isTypeSupported,
    now,
    startTicking,
    stopCounting,
    withMicrophone,
  ]);

  // the count is a promise to record, not a recording: skipping it starts the
  // take at once, and backing out of it hands the screen straight back
  const startNow = useCallback(() => {
    const begin = beginRef.current;
    if (!begin) {
      return;
    }
    stopCounting();
    begin();
  }, [stopCounting]);

  const cancel = useCallback(() => {
    if (!beginRef.current) {
      return;
    }
    stopCounting();
    stopTracks(screenRef.current?.stream);
    stopTracks(micRef.current?.stream);
    screenRef.current = undefined;
    micRef.current = undefined;
    setStatus('idle');
  }, [stopCounting]);

  const pause = useCallback(() => {
    screenRef.current?.recorder.pause();
    micRef.current?.recorder.pause();
    pausedAtRef.current = now();
    stopTicking();
    setStatus('paused');
  }, [now, stopTicking]);

  const resume = useCallback(() => {
    screenRef.current?.recorder.resume();
    micRef.current?.recorder.resume();
    if (pausedAtRef.current !== undefined) {
      pausedMsRef.current += now() - pausedAtRef.current;
      pausedAtRef.current = undefined;
    }
    startTicking();
    setStatus('recording');
  }, [now, startTicking]);

  const stop = useCallback(async (): Promise<RecordedTake | undefined> => {
    const screen = screenRef.current;
    if (!screen) {
      return undefined;
    }
    // the browser's own Stop sharing can land mid count; the take it ends
    // holds nothing, and the empty blob it hands back says so
    stopCounting();
    setStatus('finishing');
    stopTicking();
    // read before the awaits: how long the finishing itself takes is not part
    // of the take
    const durationMs = Math.max(0, recordedMs());

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

    return {
      blob: new Blob(screen.chunks, { type: screen.mimeType }),
      mimeType: screen.mimeType,
      extension: extensionForMimeType(screen.mimeType),
      durationMs,
      startedAtEpochMs: startedAtRef.current,
      ...(surfaceRef.current ? { surface: surfaceRef.current } : {}),
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
  }, [recordedMs, stopCounting, stopTicking]);

  stopRef.current = stop;

  return {
    status,
    error,
    elapsedMs,
    countdownMsLeft,
    displaySurface,
    start,
    startNow,
    cancel,
    pause,
    resume,
    stop,
  };
};
