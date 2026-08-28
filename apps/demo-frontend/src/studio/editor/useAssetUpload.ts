import { useCallback, useRef, useState } from 'react';
import { useApi } from '../../api/ApiProvider';
import { ProjectAsset } from '../../api/types';
import { planParts, uploadParts } from '../upload';

const extensionOf = (file: File): string => {
  const fromName = file.name.split('.').pop()?.toLowerCase() ?? '';
  return /^[a-z0-9]{1,8}$/.test(fromName) ? fromName : 'mp4';
};

const labelOf = (file: File): string =>
  file.name.replace(/\.[^.]+$/, '').slice(0, 300) || 'Untitled';

export type AssetUpload = {
  busy: boolean;
  progress?: number;
  error?: string;
  importFile: (file: File) => Promise<ProjectAsset | undefined>;
};

// the same multipart machinery the single file upload already uses, pointed at
// a project asset key instead of the raw video key
export const useAssetUpload = (projectId: string): AssetUpload => {
  const api = useApi();
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<number>();
  const [error, setError] = useState<string>();
  const abortRef = useRef<AbortController>();

  const importFile = useCallback(
    async (file: File): Promise<ProjectAsset | undefined> => {
      setBusy(true);
      setError(undefined);
      setProgress(0);
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const created = await api.createAsset(projectId, {
          kind: 'video',
          mimeType: file.type || 'video/mp4',
          label: labelOf(file),
          extension: extensionOf(file),
        });

        const plans = planParts(file.size, created.partSize);
        const urls = await api.createAssetPartUrls(
          projectId,
          created.assetId,
          created.uploadId,
          plans.map(({ partNumber }) => partNumber),
        );

        let done = 0;
        const parts = await uploadParts({
          file,
          plans,
          urls,
          signal: controller.signal,
          onPartDone: () => {
            done += 1;
            setProgress(Math.round((done / plans.length) * 100));
          },
        });

        return await api.completeAsset(
          projectId,
          created.assetId,
          created.uploadId,
          parts,
        );
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : 'Upload failed');
        return undefined;
      } finally {
        setBusy(false);
        setProgress(undefined);
        abortRef.current = undefined;
      }
    },
    [api, projectId],
  );

  return { busy, progress, error, importFile };
};
