/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FC, useCallback } from 'react';
import { Link, Navigate, useParams } from 'react-router';

import { useApi } from '../api/ApiProvider';
import { useEditableVideo } from '../api/hooks';
import type { ProjectAsset } from '../api/types';
import { useIsCreator } from '../auth/MeContext';
import ProjectEditor from '../studio/editor/ProjectEditor';
import { useAssetUpload } from '../studio/editor/useAssetUpload';
import { useProjectEditor } from '../studio/project/useProjectEditor';
import useEditLease from '../studio/useEditLease';
import { Spinner } from '../ui/components';
import { ember, paper, pearl, rem, silver, steel } from '../ui/theme';

const layoutStyles = css({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
});

const headerStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(12),
  padding: `${rem(10)} ${rem(16)}`,
  borderBottom: `1px solid ${silver.rgb}`,
  backgroundColor: paper.rgb,
  flexWrap: 'wrap',
});

const titleStyles = css({
  margin: 0,
  fontSize: rem(16),
  fontWeight: 600,
});

const backStyles = css({
  color: steel.rgb,
  textDecoration: 'none',
  fontSize: rem(14),
  ':hover': { textDecoration: 'underline' },
});

const noticeStyles = css({
  backgroundColor: pearl.rgb,
  borderRadius: rem(6),
  padding: `${rem(4)} ${rem(10)}`,
  color: steel.rgb,
  fontSize: rem(13),
  margin: 0,
});

const errorStyles = css({ color: ember.rgb, margin: 0, fontSize: rem(13) });

const centredStyles = css({ padding: rem(24) });

// locally the assets are served straight from MinIO through the Vite proxy, and
// in the deployed stack from the same CloudFront path behind a signed cookie
const assetUrlOf =
  (projectId: string) =>
  (asset: ProjectAsset): string | undefined =>
    asset.url ??
    `/projects/${encodeURIComponent(projectId)}/assets/${encodeURIComponent(
      asset.assetId,
    )}/original.mp4`;

const StudioProject: FC = () => {
  const { id = '' } = useParams();
  const isCreator = useIsCreator();
  const api = useApi();
  const queryClient = useQueryClient();

  const video = useEditableVideo(id);
  const timelineQuery = useQuery({
    queryKey: ['project-timeline', id],
    queryFn: () => api.getTimeline(id),
    enabled: Boolean(id),
    staleTime: Infinity,
  });
  const assetsQuery = useQuery({
    queryKey: ['project-assets', id],
    queryFn: () => api.listAssets(id),
    enabled: Boolean(id),
  });

  const { lease, markLost } = useEditLease(id, Boolean(id));
  const readOnly = lease.status !== 'held';

  const upload = useAssetUpload(id);

  const refreshAssets = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ['project-assets', id] }),
    [id, queryClient],
  );

  const onImport = useCallback(
    (file: File) => {
      void upload.importFile(file).then(() => refreshAssets());
    },
    [refreshAssets, upload],
  );

  const onDeleteAsset = useCallback(
    (asset: ProjectAsset) => {
      void api.deleteAsset(id, asset.assetId).then(refreshAssets);
    },
    [api, id, refreshAssets],
  );

  if (!isCreator) {
    return <Navigate to="/" replace />;
  }

  if (video.isLoading || timelineQuery.isLoading) {
    return (
      <div css={centredStyles}>
        <Spinner label="Loading the demo" />
      </div>
    );
  }

  if (!video.data || !timelineQuery.data) {
    return (
      <p css={[errorStyles, centredStyles]}>This demo could not be loaded.</p>
    );
  }

  if (video.data.kind !== 'studio') {
    return <Navigate to={`/studio/videos/${id}`} replace />;
  }

  return (
    <Editor
      id={id}
      video={video.data}
      timeline={timelineQuery.data.timeline}
      timelineVersion={timelineQuery.data.timelineVersion}
      assets={assetsQuery.data ?? []}
      readOnly={readOnly}
      leaseHolder={
        lease.status === 'denied' || lease.status === 'lost'
          ? lease.holderName
          : undefined
      }
      markLost={markLost}
      onImport={onImport}
      onDeleteAsset={onDeleteAsset}
      uploading={upload.busy}
      uploadProgress={upload.progress}
      uploadError={upload.error}
      assetUrl={assetUrlOf(id)}
    />
  );
};

type EditorProps = {
  readonly id: string;
  readonly video: NonNullable<ReturnType<typeof useEditableVideo>['data']>;
  readonly timeline: Parameters<typeof useProjectEditor>[0]['timeline'];
  readonly timelineVersion: number;
  readonly assets: ProjectAsset[];
  readonly readOnly: boolean;
  readonly leaseHolder?: string;
  readonly markLost: (holderName?: string) => void;
  readonly onImport: (file: File) => void;
  readonly onDeleteAsset: (asset: ProjectAsset) => void;
  readonly uploading: boolean;
  readonly uploadProgress?: number;
  readonly uploadError?: string;
  readonly assetUrl: (asset: ProjectAsset) => string | undefined;
};

// the editor only mounts once the document is in hand, so its reducer can be
// seeded with the real timeline instead of an empty one it has to replace
const Editor: FC<EditorProps> = ({
  id,
  video,
  timeline,
  timelineVersion,
  assets,
  readOnly,
  leaseHolder,
  markLost,
  onImport,
  onDeleteAsset,
  uploading,
  uploadProgress,
  uploadError,
  assetUrl,
}) => {
  const editor = useProjectEditor({
    id,
    timeline,
    timelineVersion,
    version: video.version,
    readOnly,
    onLeaseLost: markLost,
  });

  return (
    <div css={layoutStyles}>
      <div css={headerStyles}>
        <Link css={backStyles} to="/">
          Demos
        </Link>
        <h1 css={titleStyles}>{video.title}</h1>
        {readOnly ? (
          <p css={noticeStyles}>
            {leaseHolder
              ? `${leaseHolder} is editing this demo, so it is read only for now.`
              : 'This demo is read only until the editing lock is available.'}
          </p>
        ) : null}
        {uploadError ? <p css={errorStyles}>{uploadError}</p> : null}
      </div>
      <ProjectEditor
        editor={editor}
        assets={assets}
        readOnly={readOnly}
        assetUrl={assetUrl}
        onImport={onImport}
        onDeleteAsset={onDeleteAsset}
        uploading={uploading}
        uploadProgress={uploadProgress}
      />
    </div>
  );
};

export default StudioProject;
