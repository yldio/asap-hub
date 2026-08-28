/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useDraggable } from '@dnd-kit/core';
import { FC, MouseEvent as ReactMouseEvent } from 'react';
import { Link, useNavigate } from 'react-router';

import type { Video } from '../api/types';
import { Badge } from '../ui/components';
import {
  charcoal,
  ember,
  lead,
  mint,
  paper,
  pine,
  rem,
  shadowSoft,
  shadowStrong,
  silver,
  steel,
  tin,
} from '../ui/theme';
import { formatDuration } from '../utils/time';
import { formatUploadedOn } from '../utils/format';
import { CameraIcon, DragHandleIcon, PencilIcon, TrashIcon } from './icons';
import { Thumbnail } from './Thumbnail';
import type { ViewMode } from './state';

export const isWatchable = (video: Video): boolean =>
  video.processingState === 'ready' && video.status === 'published';

// a studio project is edited, not encoded, so it goes straight to its editor
export const editPathOf = (video: Video): string =>
  video.kind === 'studio'
    ? `/studio/projects/${video.id}`
    : `/studio/videos/${video.id}`;

export const VideoStatusBadge: FC<{ readonly video: Video }> = ({ video }) => {
  if (video.processingState === 'failed') {
    return <Badge tone="error">Failed</Badge>;
  }
  // 'empty' is a project that has never been exported: it is a draft waiting to
  // be worked on, not something the encoder is busy with
  if (video.processingState === 'empty') {
    return <Badge tone="neutral">Studio draft</Badge>;
  }
  if (video.processingState !== 'ready') {
    return <Badge tone="warning">Processing</Badge>;
  }
  if (video.status === 'draft') {
    return <Badge tone="neutral">Draft</Badge>;
  }
  return null;
};

const shellStyles = css({
  position: 'relative',
  boxSizing: 'border-box',
  backgroundColor: paper.rgb,
  border: `1px solid ${steel.rgb}`,
  borderRadius: rem(10),
  transition: 'box-shadow 150ms, border-color 150ms',
  ':hover': { boxShadow: `0 ${rem(2)} ${rem(10)} ${shadowSoft.rgb}` },
});

const selectedShellStyles = css({
  backgroundColor: mint.rgb,
  borderColor: pine.rgb,
});

const gridShellStyles = css({
  padding: rem(10),
  display: 'grid',
  gap: rem(10),
});

const listShellStyles = css({
  padding: rem(10),
  display: 'flex',
  alignItems: 'center',
  gap: rem(14),
});

const selectableStyles = css({ userSelect: 'none', cursor: 'default' });

const titleStyles = css({
  margin: 0,
  fontSize: rem(15),
  fontWeight: 'bold',
  lineHeight: 1.35,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});

const titleLinkStyles = css({
  color: charcoal.rgb,
  textDecoration: 'none',
  ':hover': { textDecoration: 'underline' },
});

const metaStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: rem(6),
  fontSize: rem(13),
  color: lead.rgb,
});

const dotStyles = css({ color: tin.rgb });

const actionsStyles = css({
  position: 'absolute',
  top: rem(18),
  right: rem(18),
  display: 'flex',
  gap: rem(6),
  opacity: 0,
  transition: 'opacity 120ms',
  zIndex: 1,
});

const actionsVisibleStyles = css({ opacity: 1 });

const actionButtonStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: rem(28),
  height: rem(28),
  padding: 0,
  border: 'none',
  borderRadius: rem(6),
  backgroundColor: paper.rgb,
  color: charcoal.rgb,
  cursor: 'pointer',
  boxShadow: `0 ${rem(1)} ${rem(4)} ${shadowStrong.rgb}`,
  ':hover': { backgroundColor: silver.rgb },
});

const dangerActionStyles = css({ color: ember.rgb });

const stop = (event: ReactMouseEvent) => event.stopPropagation();

export type VideoCardProps = {
  readonly video: Video;
  readonly view: ViewMode;
  readonly isCreator: boolean;
  readonly isSelected: boolean;
  readonly folderName?: string;
  readonly onSelect: (event: ReactMouseEvent) => void;
  readonly onContextMenu: (event: ReactMouseEvent) => void;
  readonly onDelete: () => void;
};

export const VideoCard: FC<VideoCardProps> = ({
  video,
  view,
  isCreator,
  isSelected,
  folderName,
  onSelect,
  onContextMenu,
  onDelete,
}) => {
  const navigate = useNavigate();
  const editPath = editPathOf(video);
  const titlePath =
    isCreator && !isWatchable(video) ? editPath : `/videos/${video.id}`;

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: video.id,
    disabled: !isCreator,
  });

  // a project with no export has no running time to show, and a 0:00 badge
  // reads as a broken video rather than as one that has not been made yet
  const duration = video.durationMs > 0 ? formatDuration(video.durationMs) : '';

  const meta = (
    <div css={[metaStyles, isCreator && selectableStyles]}>
      <CameraIcon />
      <span>Uploaded &middot; {formatUploadedOn(video.recordedAt)}</span>
      {folderName && (
        <>
          <span css={dotStyles}>&middot;</span>
          <span>{folderName}</span>
        </>
      )}
      {isCreator && (
        <span css={{ marginLeft: 'auto' }}>
          <VideoStatusBadge video={video} />
        </span>
      )}
    </div>
  );

  const title = (
    <h3 css={titleStyles}>
      <Link
        to={titlePath}
        css={titleLinkStyles}
        draggable={false}
        onClick={stop}
        onMouseDown={stop}
      >
        {video.title}
      </Link>
    </h3>
  );

  const hoverActions = isCreator && (
    <div
      css={[actionsStyles, isSelected && actionsVisibleStyles]}
      className="card-actions"
    >
      <span
        css={actionButtonStyles}
        aria-hidden
        title="Drag to a folder to move"
      >
        <DragHandleIcon size={16} />
      </span>
      <Link
        to={editPath}
        aria-label={`Edit ${video.title}`}
        title="Edit"
        css={actionButtonStyles}
        draggable={false}
        onMouseDown={stop}
        onClick={stop}
      >
        <PencilIcon size={16} />
      </Link>
      <button
        type="button"
        aria-label={`Delete ${video.title}`}
        css={[actionButtonStyles, dangerActionStyles]}
        onMouseDown={stop}
        onClick={(event) => {
          event.stopPropagation();
          onDelete();
        }}
      >
        <TrashIcon size={16} />
      </button>
    </div>
  );

  return (
    <div
      ref={isCreator ? setNodeRef : undefined}
      data-testid={`video-card-${video.id}`}
      aria-selected={isCreator ? isSelected : undefined}
      css={{
        position: 'relative',
        opacity: isDragging ? 0.4 : 1,
        ':hover .card-actions': { opacity: 1 },
      }}
      {...(isCreator ? attributes : {})}
      {...(isCreator ? listeners : {})}
      onContextMenu={isCreator ? onContextMenu : undefined}
      onMouseDown={
        isCreator
          ? (event: ReactMouseEvent) => {
              // shift-click and the second click of a dblclick paint a text selection
              if (event.shiftKey || event.detail > 1) event.preventDefault();
            }
          : undefined
      }
      onDoubleClick={(event: ReactMouseEvent) => {
        // the inner links and buttons already navigate or act on their own
        if ((event.target as HTMLElement).closest('a, button')) return;
        event.preventDefault();
        event.stopPropagation();
        void navigate(titlePath);
      }}
      onClick={isCreator ? onSelect : undefined}
    >
      {hoverActions}
      <div
        css={[
          shellStyles,
          view === 'grid' ? gridShellStyles : listShellStyles,
          isSelected && selectedShellStyles,
        ]}
      >
        {view === 'grid' ? (
          <>
            <Thumbnail
              videoId={video.id}
              mediaPath={video.mediaPath}
              creatorName={video.createdBy.name}
              duration={duration}
              hasPoster={video.processingState === 'ready'}
            />
            <div css={{ display: 'grid', gap: rem(6), padding: `0 ${rem(2)}` }}>
              {title}
              {meta}
            </div>
          </>
        ) : (
          <>
            <Thumbnail
              videoId={video.id}
              mediaPath={video.mediaPath}
              creatorName={video.createdBy.name}
              duration={duration}
              hasPoster={video.processingState === 'ready'}
              width={120}
              radius={6}
            />
            <div css={{ flex: 1, display: 'grid', gap: rem(4), minWidth: 0 }}>
              {title}
              {meta}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
