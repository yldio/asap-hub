import { useCallback, useEffect, useRef, useState } from 'react';
import { extensionForMimeType, pickAudioMimeType } from './mediaCapabilities';

export type RecordedVoice = {
  blob: Blob;
  mimeType: string;
  extension: string;
  durationMs: number;
};

export type VoiceRecorderStatus = 'idle' | 'recording';

export type VoiceRecorderOptions = {
  getUserMedia?: (constraints: MediaStreamConstraints) => Promise<MediaStream>;
  createRecorder?: (
    stream: MediaStream,
    options: { mimeType: string },
  ) => MediaRecorder;
  isTypeSupported?: (mimeType: string) => boolean;
  now?: () => number;
};

export type VoiceRecorder = {
  status: VoiceRecorderStatus;
  error?: string;
  elapsedMs: number;
  start: () => Promise<void>;
  stop: () => Promise<RecordedVoice | undefined>;
};

const systemNow = () => Date.now();

// A voice over is recorded over a demo that already exists, so this is the
// microphone on its own: no screen picker, no second stream to keep in step.
export const useVoiceRecorder = ({
  getUserMedia,
  createRecorder,
  isTypeSupported,
  now = systemNow,
}: VoiceRecorderOptions = {}): VoiceRecorder => {
  const [status, setStatus] = useState<VoiceRecorderStatus>('idle');
  const [error, setError] = useState<string>();
  const [elapsedMs, setElapsedMs] = useState(0);

  const recorderRef = useRef<MediaRecorder>();
  const streamRef = useRef<MediaStream>();
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setInterval>>();

  const stopTicking = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = undefined;
    }
  }, []);

  useEffect(
    () => () => {
      if (tickRef.current) {
        clearInterval(tickRef.current);
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
    },
    [],
  );

  const start = useCallback(async () => {
    setError(undefined);
    const user =
      getUserMedia ??
      navigator.mediaDevices?.getUserMedia.bind(navigator.mediaDevices);
    const factory =
      createRecorder ??
      ((stream: MediaStream, options: { mimeType: string }) =>
        new MediaRecorder(stream, options));
    const supported =
      isTypeSupported ??
      ((mimeType: string) => MediaRecorder.isTypeSupported(mimeType));

    const mimeType = pickAudioMimeType(supported);
    if (!user || !mimeType) {
      setError('This browser cannot record audio.');
      return;
    }

    try {
      const stream = await user({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      const recorder = factory(stream, { mimeType });
      chunksRef.current = [];
      recorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      });

      recorderRef.current = recorder;
      streamRef.current = stream;
      startedAtRef.current = now();
      setElapsedMs(0);
      recorder.start(5000);
      setStatus('recording');
      stopTicking();
      tickRef.current = setInterval(
        () => setElapsedMs(now() - startedAtRef.current),
        500,
      );
    } catch (cause) {
      setError(
        cause instanceof Error && cause.name === 'NotAllowedError'
          ? 'Microphone access was declined.'
          : 'Could not start recording.',
      );
      setStatus('idle');
    }
  }, [createRecorder, getUserMedia, isTypeSupported, now, stopTicking]);

  const stop = useCallback(async (): Promise<RecordedVoice | undefined> => {
    const recorder = recorderRef.current;
    if (!recorder) {
      return undefined;
    }
    stopTicking();
    await new Promise<void>((resolve) => {
      recorder.addEventListener('stop', () => resolve(), { once: true });
      recorder.stop();
    });

    streamRef.current?.getTracks().forEach((track) => track.stop());
    recorderRef.current = undefined;
    streamRef.current = undefined;
    setStatus('idle');

    const chunks = chunksRef.current;
    chunksRef.current = [];
    if (chunks.length === 0) {
      return undefined;
    }

    return {
      blob: new Blob(chunks, { type: recorder.mimeType }),
      mimeType: recorder.mimeType,
      extension: extensionForMimeType(recorder.mimeType),
      durationMs: now() - startedAtRef.current,
    };
  }, [now, stopTicking]);

  return { status, error, elapsedMs, start, stop };
};
