/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';

import { ApiError, isLockedOut } from '../api/client';
import {
  useDeleteVideo,
  useEditableVideo,
  useFolders,
  usePublishVideo,
  useUpdateVideo,
  useVideoAccess,
} from '../api/hooks';
import type { Video, VideoAccess } from '../api/types';
import { useIsCreator } from '../auth/MeContext';
import ChapterTable from '../studio/ChapterTable';
import {
  ChapterRow,
  insertAt,
  snapFirstToZero,
  sortRows,
  toChapters,
  toRows,
} from '../studio/chapters';
import useEditLease from '../studio/useEditLease';
import { Badge, Button, Card, Headline, Spinner } from '../ui/components';
import {
  charcoal,
  ember,
  lead,
  paper,
  pearl,
  rem,
  silver,
  steel,
} from '../ui/theme';
import { formatDuration, parseTimecode } from '../utils/time';

const AUTOSAVE_MS = 1500;
const FRAME_MS = 1000 / 30;
const ROOT_FOLDER = 'ROOT';

const layoutStyles = css({ display: 'grid', gap: rem(16) });

const playerFrameStyles = css({
  backgroundColor: charcoal.rgb,
  borderRadius: rem(8),
  overflow: 'hidden',
  border: `1px solid ${steel.rgb}`,
});

const videoStyles = css({
  display: 'block',
  width: '100%',
  maxHeight: rem(420),
  aspectRatio: '16 / 9',
  backgroundColor: charcoal.rgb,
});

const headerRowStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: rem(12),
  alignItems: 'center',
});

const titleInputStyles = css({
  fontFamily: 'inherit',
  fontSize: rem(24),
  fontWeight: 'bold',
  color: charcoal.rgb,
  padding: `${rem(6)} ${rem(8)}`,
  border: `1px solid transparent`,
  borderRadius: rem(4),
  backgroundColor: 'transparent',
  flexGrow: 1,
  minWidth: rem(240),
  ':hover:enabled, :focus': {
    borderColor: steel.rgb,
    backgroundColor: paper.rgb,
  },
});

const selectStyles = css({
  fontFamily: 'inherit',
  fontSize: rem(14),
  color: charcoal.rgb,
  padding: `${rem(8)} ${rem(10)}`,
  border: `1px solid ${steel.rgb}`,
  borderRadius: rem(4),
  backgroundColor: 'white',
});

const hintStripStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: rem(16),
  fontSize: rem(13),
  color: lead.rgb,
  padding: `${rem(8)} ${rem(12)}`,
  backgroundColor: silver.rgb,
  borderRadius: rem(4),
});

const keyStyles = css({
  fontFamily: 'monospace',
  fontWeight: 'bold',
  color: charcoal.rgb,
});

const footerStyles = css({
  position: 'sticky',
  bottom: 0,
  zIndex: 5,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: rem(12),
  padding: `${rem(12)} ${rem(16)}`,
  marginTop: rem(8),
  backgroundColor: paper.rgb,
  border: `1px solid ${steel.rgb}`,
  borderRadius: rem(8),
});

const bannerStyles = css({
  padding: `${rem(12)} ${rem(16)}`,
  borderRadius: rem(8),
  backgroundColor: pearl.rgb,
  border: `1px solid ${steel.rgb}`,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: rem(12),
  fontSize: rem(14),
  color: charcoal.rgb,
});

const dialogStyles = css({
  position: 'fixed',
  inset: 0,
  zIndex: 20,
  display: 'grid',
  placeItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  padding: rem(24),
});

const dialogPanelStyles = css({
  backgroundColor: paper.rgb,
  borderRadius: rem(8),
  padding: rem(24),
  maxWidth: rem(440),
  display: 'grid',
  gap: rem(16),
});

const statePanelStyles = css({
  padding: rem(40),
  display: 'grid',
  gap: rem(12),
  justifyItems: 'start',
});

const errorTextStyles = css({ color: ember.rgb, margin: 0, fontSize: rem(14) });

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

const ConfirmDialog: FC<{
  readonly title: string;
  readonly body: string;
  readonly confirmLabel: string;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}> = ({ title, body, confirmLabel, onConfirm, onCancel }) => (
  <div css={dialogStyles} role="dialog" aria-modal="true" aria-label={title}>
    <div css={dialogPanelStyles}>
      <Headline level={3}>{title}</Headline>
      <p css={{ margin: 0, color: lead.rgb }}>{body}</p>
      <div css={{ display: 'flex', gap: rem(12), justifyContent: 'flex-end' }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button primary onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </div>
  </div>
);

const Editor: FC<{
  readonly video: Video;
  readonly access?: VideoAccess;
}> = ({ video, access }) => {
  const navigate = useNavigate();
  const folders = useFolders();
  const updateVideo = useUpdateVideo(video.id);
  const publishVideo = usePublishVideo(video.id);
  const deleteVideo = useDeleteVideo(video.id);
  const { lease, retry, markLost } = useEditLease(video.id, true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const titleInputs = useRef(new Map<string, HTMLInputElement>());
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();
  const versionRef = useRef(video.version);

  const [rows, setRows] = useState<ChapterRow[]>(() => toRows(video.chapters));
  const [title, setTitle] = useState(video.title);
  const [folderId, setFolderId] = useState(video.folderId || ROOT_FOLDER);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});
  const [focusedKey, setFocusedKey] = useState<string>();
  const [pendingFocusKey, setPendingFocusKey] = useState<string>();
  const [currentTime, setCurrentTime] = useState(0);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [confirming, setConfirming] = useState<'publish' | 'delete'>();

  const readOnly = lease.status !== 'held';

  useEffect(() => {
    versionRef.current = video.version;
  }, [video.version]);

  const { durationMs } = video;

  const activeKey = useMemo(() => {
    const currentMs = currentTime * 1000;
    let key: string | undefined;
    rows.forEach((row) => {
      if (row.startMs <= currentMs) key = row.key;
    });
    return key;
  }, [rows, currentTime]);

  const save = useCallback(
    (nextRows: ChapterRow[], extra: { title?: string; folderId?: string }) => {
      setSaveState('saving');
      updateVideo.mutate(
        {
          chapters: toChapters(nextRows),
          version: versionRef.current,
          ...extra,
        },
        {
          onSuccess: (saved) => {
            versionRef.current = saved.version;
            setSaveState('saved');
          },
          onError: (error) => {
            if (isLockedOut(error)) {
              markLost(
                error instanceof ApiError ? error.holderName : undefined,
              );
              return;
            }
            setSaveState('error');
          },
        },
      );
    },
    [markLost, updateVideo],
  );

  const scheduleSave = useCallback(
    (nextRows: ChapterRow[], extra: { title?: string; folderId?: string }) => {
      if (readOnly) return;
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => save(nextRows, extra), AUTOSAVE_MS);
    },
    [readOnly, save],
  );

  const saveNow = useCallback(
    (nextRows: ChapterRow[]) => {
      if (readOnly) return;
      clearTimeout(saveTimer.current);
      save(nextRows, { title, folderId });
    },
    [folderId, readOnly, save, title],
  );

  useEffect(() => () => clearTimeout(saveTimer.current), []);

  useEffect(() => {
    if (!pendingFocusKey) return;
    titleInputs.current.get(pendingFocusKey)?.focus();
    setPendingFocusKey(undefined);
  }, [pendingFocusKey, rows]);

  const seekTo = useCallback((seconds: number) => {
    const element = videoRef.current;
    if (!element) return;
    const next = Math.max(0, seconds);
    element.currentTime = next;
    setCurrentTime(next);
  }, []);

  const markChapter = useCallback(() => {
    if (readOnly) return;
    const startMs = (videoRef.current?.currentTime ?? currentTime) * 1000;
    setRows((current) => {
      const { rows: next, key } = insertAt(current, startMs);
      setPendingFocusKey(key);
      scheduleSave(next, { title, folderId });
      return next;
    });
  }, [currentTime, folderId, readOnly, scheduleSave, title]);

  const nudge = useCallback((deltaMs: number) => {
    const element = videoRef.current;
    if (!element) return;
    const next = Math.max(0, element.currentTime + deltaMs / 1000);
    element.currentTime = next;
    setCurrentTime(next);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable === true;
      if (typing) return;

      const element = videoRef.current;
      if (event.key === ' ') {
        event.preventDefault();
        if (!element) return;
        if (element.paused) void element.play()?.catch(() => undefined);
        else element.pause();
        return;
      }
      if (event.key === 'm' || event.key === 'M') {
        event.preventDefault();
        markChapter();
        return;
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        const step = event.shiftKey ? FRAME_MS : 1000;
        nudge(event.key === 'ArrowLeft' ? -step : step);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [markChapter, nudge]);

  const onTimecodeChange = (key: string, value: string) => {
    setDrafts((current) => ({ ...current, [key]: value }));
    const parsed = parseTimecode(value);
    setInvalid((current) => ({ ...current, [key]: parsed === undefined }));
    if (parsed === undefined) return;
    setRows((current) => {
      const next = current.map((row) =>
        row.key === key ? { ...row, startMs: parsed } : row,
      );
      scheduleSave(snapFirstToZero(next), { title, folderId });
      return next;
    });
  };

  const onTimecodeBlur = (key: string) => {
    setFocusedKey(undefined);
    setDrafts((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
    if (invalid[key]) {
      setInvalid((current) => ({ ...current, [key]: false }));
      return;
    }
    setRows((current) => {
      const next = snapFirstToZero(current);
      saveNow(next);
      return next;
    });
  };

  const onTitleChange = (key: string, value: string) => {
    setRows((current) => {
      const next = current.map((row) =>
        row.key === key ? { ...row, title: value } : row,
      );
      scheduleSave(next, { title, folderId });
      return next;
    });
  };

  const onDeleteRow = (key: string) => {
    setRows((current) => {
      const next = snapFirstToZero(current.filter((row) => row.key !== key));
      scheduleSave(next, { title, folderId });
      return next;
    });
  };

  // Rows only reorder once the timecode field being edited loses focus.
  const displayRows = focusedKey ? rows : sortRows(rows);

  const titleRef = useCallback(
    (key: string) => (element: HTMLInputElement | null) => {
      if (element) titleInputs.current.set(key, element);
      else titleInputs.current.delete(key);
    },
    [],
  );

  const saveLabel = {
    idle: 'All changes saved',
    saving: 'Saving',
    saved: 'Saved',
    error: 'Could not save',
  }[saveState];

  return (
    <div css={layoutStyles}>
      <div css={headerRowStyles}>
        <input
          css={titleInputStyles}
          type="text"
          aria-label="Video title"
          disabled={readOnly}
          value={title}
          onChange={(event) => setTitle(event.currentTarget.value)}
          onBlur={() => {
            if (readOnly || title === video.title) return;
            clearTimeout(saveTimer.current);
            save(rows, { title, folderId });
          }}
        />
        <Badge tone={video.status === 'published' ? 'neutral' : 'warning'}>
          {video.status === 'published' ? 'Published' : 'Draft'}
        </Badge>
        <select
          css={selectStyles}
          aria-label="Folder"
          disabled={readOnly}
          value={folderId}
          onChange={(event) => {
            const nextFolder = event.currentTarget.value;
            setFolderId(nextFolder);
            if (readOnly) return;
            clearTimeout(saveTimer.current);
            save(rows, { title, folderId: nextFolder });
          }}
        >
          <option value={ROOT_FOLDER}>Unfiled</option>
          {(folders.data ?? [])
            .filter(({ id }) => id !== ROOT_FOLDER)
            .map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
        </select>
      </div>

      {lease.status === 'denied' && (
        <div css={bannerStyles} role="status">
          <span>
            Being edited by {lease.holderName ?? 'someone else'}. You can watch
            but not change anything.
          </span>
          <Button small onClick={retry}>
            Try again
          </Button>
        </div>
      )}

      {lease.status === 'lost' && (
        <div css={bannerStyles} role="alert">
          <span>
            Your edit lease was taken over
            {lease.holderName ? ` by ${lease.holderName}` : ''}. Reload to see
            the current chapters before editing again.
          </span>
          <Button small onClick={() => window.location.reload()}>
            Reload
          </Button>
        </div>
      )}

      {access && (
        <div css={playerFrameStyles}>
          <video
            ref={videoRef}
            css={videoStyles}
            controls
            preload="metadata"
            src={access.streamUrl}
            data-testid="studio-video"
            onTimeUpdate={(event) =>
              setCurrentTime(event.currentTarget.currentTime)
            }
          />
        </div>
      )}

      <div css={hintStripStyles}>
        <span>
          <span css={keyStyles}>Space</span> play or pause
        </span>
        <span>
          <span css={keyStyles}>M</span> mark a chapter here
        </span>
        <span>
          <span css={keyStyles}>&larr; &rarr;</span> nudge 1s
        </span>
        <span>
          <span css={keyStyles}>Shift + &larr; &rarr;</span> nudge one frame
        </span>
      </div>

      <Card>
        <ChapterTable
          rows={displayRows}
          drafts={drafts}
          invalid={invalid}
          durationMs={durationMs}
          activeKey={activeKey}
          readOnly={readOnly}
          titleRef={titleRef}
          onSeek={(startMs) => seekTo(startMs / 1000)}
          onTimecodeChange={onTimecodeChange}
          onTimecodeFocus={setFocusedKey}
          onTimecodeBlur={onTimecodeBlur}
          onTitleChange={onTitleChange}
          onDelete={onDeleteRow}
        />
      </Card>

      <div css={footerStyles}>
        <div css={{ display: 'flex', gap: rem(12), alignItems: 'center' }}>
          <span
            css={{
              fontSize: rem(14),
              color: saveState === 'error' ? ember.rgb : lead.rgb,
            }}
            role="status"
          >
            {readOnly ? 'Read only' : saveLabel}
          </span>
          <span css={{ fontSize: rem(14), color: lead.rgb }}>
            {formatDuration(currentTime * 1000)} of {formatDuration(durationMs)}
          </span>
        </div>
        <div css={{ display: 'flex', gap: rem(12) }}>
          <Button disabled={readOnly} onClick={() => setConfirming('delete')}>
            Delete demo
          </Button>
          <Button
            primary
            disabled={readOnly || saveState === 'saving'}
            onClick={() => setConfirming('publish')}
          >
            {video.status === 'published' ? 'Republish' : 'Publish'}
          </Button>
        </div>
      </div>

      {publishVideo.isError && (
        <p css={errorTextStyles} role="alert">
          We could not publish this demo. Try again.
        </p>
      )}

      {confirming === 'publish' && (
        <ConfirmDialog
          title={
            video.status === 'published' ? 'Republish demo' : 'Publish demo'
          }
          body={
            rows.length === 0
              ? `"${title}" has no chapters yet. Members will see it without any sections.`
              : `"${title}" will be visible to every member with ${
                  rows.length
                } ${rows.length === 1 ? 'chapter' : 'chapters'}.`
          }
          confirmLabel={video.status === 'published' ? 'Republish' : 'Publish'}
          onCancel={() => setConfirming(undefined)}
          onConfirm={() => {
            setConfirming(undefined);
            publishVideo.mutate(versionRef.current, {
              onSuccess: (saved) => {
                versionRef.current = saved.version;
              },
            });
          }}
        />
      )}

      {confirming === 'delete' && (
        <ConfirmDialog
          title="Delete demo"
          body={`"${title}" and its recording will be removed for everyone. This cannot be undone.`}
          confirmLabel="Delete"
          onCancel={() => setConfirming(undefined)}
          onConfirm={() => {
            setConfirming(undefined);
            deleteVideo.mutate(undefined, {
              onSuccess: () => navigate('/'),
            });
          }}
        />
      )}
    </div>
  );
};

const StudioVideo: FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const isCreator = useIsCreator();
  const video = useEditableVideo(id);
  const ready = video.data?.processingState === 'ready';
  const access = useVideoAccess(ready ? id : '');

  if (!isCreator) return <Navigate to="/" replace />;

  if (video.isLoading) return <Spinner label="Loading demo" />;

  if (video.isError || !video.data) {
    return (
      <Card overrideStyles={statePanelStyles}>
        <Headline level={3}>We could not load this demo</Headline>
        <Button
          onClick={() => {
            void video.refetch();
          }}
        >
          Retry
        </Button>
      </Card>
    );
  }

  const { processingState, processingError, title } = video.data;

  if (processingState === 'failed') {
    return (
      <>
        <Headline level={2}>{title}</Headline>
        <div css={{ height: rem(16) }} />
        <Card overrideStyles={statePanelStyles}>
          <Headline level={3}>This demo failed to process</Headline>
          <p css={errorTextStyles}>
            {processingError ?? 'The recording could not be encoded.'}
          </p>
        </Card>
      </>
    );
  }

  if (processingState !== 'ready') {
    return (
      <>
        <Headline level={2}>{title}</Headline>
        <div css={{ height: rem(16) }} />
        <Card overrideStyles={statePanelStyles}>
          <Headline level={3}>
            {processingState === 'uploading'
              ? 'This demo is still uploading'
              : 'This demo is still processing'}
          </Headline>
          <p css={{ color: lead.rgb, margin: 0 }}>
            Chapters can be marked as soon as encoding finishes. This page
            updates itself.
          </p>
          <Spinner label="Checking every few seconds" />
        </Card>
      </>
    );
  }

  return <Editor video={video.data} access={access.data} />;
};

export default StudioVideo;
