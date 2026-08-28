import { useCallback, useState } from 'react';
import { ProjectAsset } from '../../api/types';
import { AssetUpload } from '../editor/useAssetUpload';
import { RecordedTake, useScreenRecorder } from './useScreenRecorder';

export type TakeResult = {
  video: ProjectAsset;
  durationMs: number;
  narration?: ProjectAsset;
};

const takeLabel = (): string =>
  `Screen recording ${new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`;

// A finished take is two uploads at most: the picture, and the microphone as a
// separate narration asset so it can be retimed or replaced on its own.
export const useRecordingTake = (
  upload: AssetUpload,
  onTake: (result: TakeResult) => void,
) => {
  const [withMicrophone, setWithMicrophone] = useState(true);
  const [saving, setSaving] = useState(false);
  const recorder = useScreenRecorder({ withMicrophone });

  const save = useCallback(
    async (take: RecordedTake) => {
      setSaving(true);
      try {
        const label = takeLabel();
        const video = await upload.uploadBlob({
          blob: take.blob,
          label,
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
              label: `${label} voice over`,
              extension: take.microphone.extension,
              mimeType: take.microphone.mimeType,
              kind: 'audio',
            })
          : undefined;

        onTake({ video, durationMs: take.durationMs, narration });
      } finally {
        setSaving(false);
      }
    },
    [onTake, upload],
  );

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
