/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ClipPlacement } from '@asap-hub/demo-timeline';
import { FC, PointerEvent as ReactPointerEvent } from 'react';
import { ProjectAsset } from '../../api/types';
import { editorTheme } from './editorTheme';
import { formatDuration } from './geometry';
import { MuteIcon, SoundIcon } from './icons';

const blockStyles = css({
  position: 'absolute',
  top: 6,
  bottom: 6,
  borderRadius: 6,
  border: '1px solid transparent',
  backgroundColor: editorTheme.clip,
  color: editorTheme.clipText,
  padding: '6px 8px',
  overflow: 'hidden',
  cursor: 'grab',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  textAlign: 'left',
  font: 'inherit',
  fontSize: 12,
  touchAction: 'none',
  userSelect: 'none',
});

const titleBlockStyles = css({
  backgroundColor: editorTheme.title,
  color: editorTheme.text,
});

const selectedStyles = css({
  borderColor: editorTheme.selected,
  boxShadow: `0 0 0 1px ${editorTheme.selected}`,
});

const mutedStyles = css({ opacity: 0.65 });

const labelStyles = css({
  fontWeight: 600,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const rangeStyles = css({
  fontVariantNumeric: 'tabular-nums',
  opacity: 0.8,
  whiteSpace: 'nowrap',
});

const handleStyles = css({
  position: 'absolute',
  top: 0,
  bottom: 0,
  width: 10,
  cursor: 'ew-resize',
  background: 'transparent',
  border: 0,
  padding: 0,
  touchAction: 'none',
  ':hover::after, :focus-visible::after': {
    content: '""',
    position: 'absolute',
    top: 6,
    bottom: 6,
    left: 3,
    width: 4,
    borderRadius: 2,
    backgroundColor: editorTheme.clipEdge,
  },
});

const muteButtonStyles = css({
  position: 'absolute',
  right: 6,
  bottom: 6,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 22,
  height: 22,
  borderRadius: 4,
  border: 0,
  color: 'inherit',
  backgroundColor: 'rgba(0, 0, 0, 0.18)',
  cursor: 'pointer',
});

export type ClipDragKind = 'move' | 'trimStart' | 'trimEnd';

type Props = {
  readonly placement: ClipPlacement;
  readonly asset?: ProjectAsset;
  readonly left: number;
  readonly width: number;
  readonly selected: boolean;
  readonly readOnly: boolean;
  readonly onSelect: () => void;
  readonly onDragStart: (
    kind: ClipDragKind,
    event: ReactPointerEvent<HTMLElement>,
  ) => void;
  readonly onToggleMute: () => void;
};

const ClipBlock: FC<Props> = ({
  placement,
  asset,
  left,
  width,
  selected,
  readOnly,
  onSelect,
  onDragStart,
  onToggleMute,
}) => {
  const { clip } = placement;
  const source = clip.kind === 'source' ? clip : undefined;
  const muted = source?.volume === 0;
  const label =
    clip.kind === 'title' ? clip.text || 'Title card' : asset?.label ?? 'Clip';

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${label}, ${formatDuration(placement.durationMs)}`}
      aria-pressed={selected}
      css={[
        blockStyles,
        clip.kind === 'title' && titleBlockStyles,
        selected && selectedStyles,
        muted && mutedStyles,
      ]}
      style={{ left, width: Math.max(width, 18) }}
      onPointerDown={(event) => {
        onSelect();
        if (!readOnly) {
          onDragStart('move', event);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect();
        }
      }}
    >
      <span css={labelStyles}>{label}</span>
      <span css={rangeStyles}>
        {source
          ? `${formatDuration(source.inMs)}-${formatDuration(source.outMs)}`
          : formatDuration(placement.durationMs)}
      </span>

      {source ? (
        <>
          <button
            type="button"
            aria-label={`${muted ? 'Unmute' : 'Mute'} ${label}`}
            css={muteButtonStyles}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              onToggleMute();
            }}
          >
            {muted ? <MuteIcon size={14} /> : <SoundIcon size={14} />}
          </button>
          <button
            type="button"
            aria-label={`Trim the start of ${label}`}
            css={handleStyles}
            style={{ left: 0 }}
            disabled={readOnly}
            onPointerDown={(event) => {
              event.stopPropagation();
              onSelect();
              onDragStart('trimStart', event);
            }}
          />
          <button
            type="button"
            aria-label={`Trim the end of ${label}`}
            css={handleStyles}
            style={{ right: 0 }}
            disabled={readOnly}
            onPointerDown={(event) => {
              event.stopPropagation();
              onSelect();
              onDragStart('trimEnd', event);
            }}
          />
        </>
      ) : null}
    </div>
  );
};

export default ClipBlock;
