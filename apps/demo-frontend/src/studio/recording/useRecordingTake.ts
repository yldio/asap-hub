import { useCallback, useRef, useState } from 'react';
import { ProjectAsset } from '../../api/types';
import { AssetUpload } from '../editor/useAssetUpload';
import { RecordedTake, useScreenRecorder } from './useScreenRecorder';

export type TakeResult = {
  video: ProjectAsset;
  durationMs: number;
  // when the take started, in wall clock: the instant the footage shows at t=0,
  // and so the origin a cursor capture applied to it has to be read against
  startedAtEpochMs: number;
  narration?: ProjectAsset;
};

const at = (): string =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// Two names that only differ in a suffix are two names a 280px list cannot tell
// apart, because the longer one is cut off before the suffix is reached.
const takeLabels = (): { video: string; narration: string } => {
  const time = at();
  return { video: `Screen ${time}`, narration: `Voice over ${time}` };
};

// A finished take is two uploads at most: the picture, and the microphone as a
// separate narration asset so it can be retimed or replaced on its own.
export const useRecordingTake = (
  upload: AssetUpload,
  onTake: (result: TakeResult) => void,
) => {
  const [withMicrophone, setWithMicrophone] = useState(true);
  const [saving, setSaving] = useState(false);
  const saveRef = useRef<(take: RecordedTake) => Promise<void>>();
  const recorder = useScreenRecorder({
    withMicrophone,
    // the browser's own Stop sharing button finishes the take, and it still has
    // to be uploaded and put on the timeline
    onEnded: (take) => {
      void saveRef.current?.(take);
    },
  });

  const save = useCallback(
    async (take: RecordedTake) => {
      setSaving(true);
      try {
        const labels = takeLabels();
        const video = await upload.uploadBlob({
          blob: take.blob,
          label: labels.video,
          extension: take.extension,
          mimeType: take.mimeType,
          kind: 'video',
        });
        if (!video) {
          return;
        }

        const narration = take.microphone
          ? await upload.uploadBlob({
              blob: take.microphone.blob,
              label: labels.narration,
              extension: take.microphone.extension,
              mimeType: take.microphone.mimeType,
              kind: 'audio',
            })
          : undefined;

        onTake({
          video,
          durationMs: take.durationMs,
          startedAtEpochMs: take.startedAtEpochMs,
          narration,
        });
      } finally {
        setSaving(false);
      }
    },
    [onTake, upload],
  );

  saveRef.current = save;

  const stop = useCallback(async () => {
    const take = await recorder.stop();
    if (take && take.blob.size > 0) {
      await save(take);
    }
  }, [recorder, save]);

  return {
    ...recorder,
    status: saving ? ('finishing' as const) : recorder.status,
    withMicrophone,
    setWithMicrophone,
    stop,
  };
};
