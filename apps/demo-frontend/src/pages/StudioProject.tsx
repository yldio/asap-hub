/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { timelineDurationMs } from '@asap-hub/demo-timeline';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FC, useCallback, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';

import { useApi } from '../api/ApiProvider';
import { ApiError } from '../api/client';
import {
  useEditableVideo,
  usePublishVideo,
  useUnpublishVideo,
  useUpdateVideo,
} from '../api/hooks';
import type { ProjectAsset, Video } from '../api/types';
import { useIsCreator } from '../auth/MeContext';
import ProjectEditor from '../studio/editor/ProjectEditor';
import ProjectHeader from '../studio/editor/ProjectHeader';
import { AssetUpload, useAssetUpload } from '../studio/editor/useAssetUpload';
import RenderBar from '../studio/editor/RenderBar';
import CapturePanel from '../studio/recording/CapturePanel';
import RecorderPanel from '../studio/recording/RecorderPanel';
import VoiceOverPanel from '../studio/recording/VoiceOverPanel';
import { useCursorCapture } from '../studio/recording/useCursorCapture';
import {
  microphoneRecordingSupport,
  screenRecordingSupport,
} from '../studio/recording/mediaCapabilities';
import {
  TakeResult,
  useRecordingTake,
} from '../studio/recording/useRecordingTake';
import { useVoiceRecorder } from '../studio/recording/useVoiceRecorder';
import { createId } from '../studio/project/ids';
import { useLeaveGuard } from '../studio/project/useLeaveGuard';
import { useProjectEditor } from '../studio/project/useProjectEditor';
import useEditLease from '../studio/useEditLease';
import { Button, Modal, Spinner } from '../ui/components';
import { ember, lead, rem } from '../ui/theme';

const layoutStyles = css({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  overflow: 'hidden',
});

const errorStyles = css({ color: ember.rgb, margin: 0, fontSize: rem(13) });

const centredStyles = css({ padding: rem(24) });

const assetPollMs = 3000;

const dialogTitleStyles = css({ margin: 0, fontSize: rem(18) });

const dialogBodyStyles = css({ margin: 0, color: lead.rgb, fontSize: rem(14) });

const dialogActionsStyles = css({
  display: 'flex',
  gap: rem(8),
  justifyContent: 'flex-end',
  flexWrap: 'wrap',
});

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
    // the ingest runs in a container and writes the probed duration back onto
    // the asset, so the editor keeps asking until nothing is in flight
    refetchInterval: (query) =>
      query.state.data?.some(
        (asset) => asset.state === 'uploading' || asset.state === 'preparing',
      )
        ? assetPollMs
        : false,
  });

  const { lease, markLost } = useEditLease(id, Boolean(id));
  const readOnly = lease.status !== 'held';

  const upload = useAssetUpload(id);

  const refreshAssets = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ['project-assets', id] }),
    [id, queryClient],
  );

  const refreshVideo = useCallback(
    (fresh: Video) => queryClient.setQueryData(['video', id], fresh),
    [id, queryClient],
  );

  const onImport = useCallback(
    (file: File) => {
      void upload.importFile(file).then(() => refreshAssets());
    },
    [refreshAssets, upload],
  );

  const onImportAudio = useCallback(
    (file: File) => {
      void upload.importFile(file, 'audio').then(() => refreshAssets());
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
      onImportAudio={onImportAudio}
      onDeleteAsset={onDeleteAsset}
      upload={upload}
      onAssetsChanged={refreshAssets}
      onVideoChanged={refreshVideo}
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
  readonly onImportAudio: (file: File) => void;
  readonly onDeleteAsset: (asset: ProjectAsset) => void;
  readonly upload: AssetUpload;
  readonly onAssetsChanged: () => void;
  readonly onVideoChanged: (video: Video) => void;
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
  onImportAudio,
  onDeleteAsset,
  upload,
  onAssetsChanged,
  onVideoChanged,
  assetUrl,
}) => {
  const api = useApi();
  const editor = useProjectEditor({
    id,
    timeline,
    timelineVersion,
    version: video.version,
    readOnly,
    onLeaseLost: markLost,
  });

  // a finished take lands as a clip at the end, with its microphone track
  // starting at the same point on the voice over lane
  const onTake = useCallback(
    ({ video: recorded, durationMs, narration }: TakeResult) => {
      const clipId = createId('clip');
      const startMs = timelineDurationMs(editor.timeline.clips);
      editor.dispatch({
        type: 'addClip',
        assetId: recorded.assetId,
        durationMs: recorded.durationMs ?? durationMs,
        clipId,
      });
      if (narration) {
        editor.dispatch({
          type: 'addNarration',
          narration: {
            id: createId('narration'),
            assetId: narration.assetId,
            startMs,
            inMs: 0,
            outMs: narration.durationMs ?? durationMs,
            volume: 1,
          },
        });
      }
      onAssetsChanged();
    },
    [editor, onAssetsChanged],
  );

  const take = useRecordingTake(upload, onTake);

  const voice = useVoiceRecorder();
  const [savingVoice, setSavingVoice] = useState(false);

  // the finished take becomes an asset first, then the editor drops it on the
  // voice over lane at the playhead
  const saveVoice = useCallback(
    async (addAsset: (asset: ProjectAsset) => void) => {
      const recorded = await voice.stop();
      if (!recorded) {
        return;
      }
      setSavingVoice(true);
      try {
        const asset = await upload.uploadBlob({
          blob: recorded.blob,
          label: `Voice over ${new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}`,
          extension: recorded.extension,
          mimeType: recorded.mimeType,
          kind: 'audio',
        });
        if (asset) {
          onAssetsChanged();
          addAsset({
            ...asset,
            durationMs: asset.durationMs ?? recorded.durationMs,
          });
        }
      } finally {
        setSavingVoice(false);
      }
    },
    [onAssetsChanged, upload, voice],
  );

  const capture = useCursorCapture(id);

  // the capture belongs to whichever clip is under the playhead, because that is
  // the recording the creator just made
  const applyCapture = useCallback(() => {
    const clip = editor.timeline.clips[0];
    if (!clip) return;
    const layer = editor.timeline.cursor.find(
      (candidate) => candidate.clipId === clip.id,
    );
    void capture
      .apply({
        startedAtEpochMs:
          Date.now() - timelineDurationMs(editor.timeline.clips),
        stoppedAtEpochMs: Date.now(),
        frame: {
          width: editor.timeline.canvas.width,
          height: editor.timeline.canvas.height,
        },
        existing: layer?.effects ?? [],
      })
      .then((applied) => {
        if (!applied) return;
        editor.dispatch({
          type: 'applyCapture',
          clipId: clip.id,
          path: applied.path,
          effects: applied.effects,
        });
      });
  }, [capture, editor]);

  // the autosave debounce means a departure can outrun the last edit, so the
  // studio asks rather than losing it quietly
  const navigate = useNavigate();
  const leaving = useLeaveGuard(editor.dirty && !readOnly);

  const [renderError, setRenderError] = useState<string>();

  // the export writes to the same row the autosave does, so it takes the
  // version the editor holds and hands the one it gets back straight to it
  const applyWrite = useCallback(
    (fresh: Video) => {
      onVideoChanged(fresh);
      editor.rebase(fresh.version);
    },
    [editor, onVideoChanged],
  );

  const startRender = useCallback(() => {
    setRenderError(undefined);
    // an edit inside the autosave debounce is not on the server yet, and the
    // container renders the server's copy
    editor.flush();
    api
      .startRender(id, editor.version)
      .then(applyWrite)
      .catch((cause: unknown) =>
        setRenderError(
          cause instanceof ApiError && cause.code === 'render_active'
            ? 'An export is already running for this demo.'
            : 'Could not start the export.',
        ),
      );
  }, [api, applyWrite, editor, id]);

  const cancelRender = useCallback(() => {
    api
      .cancelRender(id, editor.version)
      .then(applyWrite)
      .catch(() => setRenderError('Could not cancel the export.'));
  }, [api, applyWrite, editor.version, id]);

  const updateVideo = useUpdateVideo(id);
  const publishVideo = usePublishVideo(id);
  const unpublishVideo = useUnpublishVideo(id);
  const [publishError, setPublishError] = useState<string>();

  // these write to the same guarded row the timeline does, so they take the
  // editor's version and hand the one that comes back straight back to it
  const write = useCallback(
    (run: (version: number) => Promise<Video>, failure: string): void => {
      setPublishError(undefined);
      run(editor.version)
        .then((fresh) => editor.rebase(fresh.version))
        .catch(() => setPublishError(failure));
    },
    [editor],
  );

  const rename = useCallback(
    (title: string) =>
      write(
        (version) => updateVideo.mutateAsync({ title, version }),
        'Could not rename this demo.',
      ),
    [updateVideo, write],
  );

  const publish = useCallback(
    () =>
      write(
        (version) => publishVideo.mutateAsync(version),
        'Could not publish this demo.',
      ),
    [publishVideo, write],
  );

  const unpublish = useCallback(
    () =>
      write(
        (version) => unpublishVideo.mutateAsync(version),
        'Could not unpublish this demo.',
      ),
    [unpublishVideo, write],
  );
  const recorderApi =
    typeof MediaRecorder === 'undefined' ? undefined : MediaRecorder;
  const support = screenRecordingSupport(navigator.mediaDevices, recorderApi);
  const micSupport = microphoneRecordingSupport(
    navigator.mediaDevices,
    recorderApi,
  );

  return (
    <div css={layoutStyles}>
      <ProjectHeader
        video={video}
        readOnly={readOnly}
        leaseHolder={leaseHolder}
        notice={upload.error ?? renderError ?? publishError}
        onLeave={() => leaving.request(() => navigate('/'))}
        onRename={rename}
        onPublish={publish}
        onUnpublish={unpublish}
      >
        <RenderBar
          videoId={id}
          render={video.render}
          status={video.status}
          hasOutput={video.processingState === 'ready'}
          // an export started while a save is in flight would race it for the
          // row version and lose, so it waits for the timeline to settle
          canRender={
            editor.timeline.clips.length > 0 &&
            !editor.dirty &&
            editor.saveState !== 'saving'
          }
          readOnly={readOnly}
          onRender={startRender}
          onCancel={cancelRender}
        />
      </ProjectHeader>
      <ProjectEditor
        editor={editor}
        recorder={(addAsset) => (
          <>
            <RecorderPanel
              status={take.status}
              elapsedMs={take.elapsedMs}
              error={take.error}
              withMicrophone={take.withMicrophone}
              readOnly={readOnly}
              unsupportedReason={support.supported ? undefined : support.reason}
              onMicrophoneChange={take.setWithMicrophone}
              onStart={() => {
                take.start().catch(() => undefined);
              }}
              onPause={take.pause}
              onResume={take.resume}
              onStop={() => {
                take.stop().catch(() => undefined);
              }}
            />
            <VoiceOverPanel
              status={voice.status}
              elapsedMs={voice.elapsedMs}
              error={voice.error}
              saving={savingVoice}
              readOnly={readOnly}
              unsupportedReason={
                micSupport.supported ? undefined : micSupport.reason
              }
              onStart={() => {
                voice.start().catch(() => undefined);
              }}
              onStop={() => {
                saveVoice(addAsset).catch(() => undefined);
              }}
            />
            <CapturePanel
              session={capture.session}
              status={capture.status}
              readOnly={readOnly}
              applying={capture.applying}
              onStart={capture.start}
              onApply={applyCapture}
            />
          </>
        )}
        assets={assets}
        readOnly={readOnly}
        assetUrl={assetUrl}
        onImport={onImport}
        onImportAudio={onImportAudio}
        onDeleteAsset={onDeleteAsset}
        uploading={upload.busy}
        uploadProgress={upload.progress}
      />

      {leaving.asking && (
        <Modal onClose={leaving.stay} label="Unsaved changes">
          <h2 css={dialogTitleStyles}>You have unsaved changes</h2>
          <p css={dialogBodyStyles}>
            The last few edits have not reached the server yet. Save them, or
            leave them behind and go back to the demos.
          </p>
          <div css={dialogActionsStyles}>
            <Button small onClick={leaving.stay}>
              Stay here
            </Button>
            <Button
              small
              onClick={() => {
                editor.discard();
                leaving.discard();
              }}
            >
              Discard and leave
            </Button>
            <Button
              small
              primary
              onClick={() => {
                editor.flush();
                leaving.discard();
              }}
            >
              Save and leave
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StudioProject;
