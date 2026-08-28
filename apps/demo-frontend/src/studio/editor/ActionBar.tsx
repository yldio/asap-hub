/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC } from 'react';
import EditorButton from './EditorButton';
import { editorTheme } from './editorTheme';
import { formatTimecode } from './geometry';
import {
  DuplicateIcon,
  MinusIcon,
  MuteIcon,
  PlusIcon,
  SoundIcon,
  SplitIcon,
  TrashIcon,
} from './icons';

const barStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap',
  padding: '10px 14px',
  backgroundColor: editorTheme.panel,
  borderTop: `1px solid ${editorTheme.line}`,
  color: editorTheme.text,
});

const hintStyles = css({
  color: editorTheme.muted,
  fontSize: 12,
  marginLeft: 'auto',
});

const timeStyles = css({
  fontVariantNumeric: 'tabular-nums',
  fontSize: 13,
  color: editorTheme.muted,
});

const groupStyles = css({ display: 'flex', alignItems: 'center', gap: 6 });

type Props = {
  readonly hasSelection: boolean;
  readonly selectionMuted: boolean;
  readonly readOnly: boolean;
  readonly playheadMs: number;
  readonly durationMs: number;
  readonly onSplit: () => void;
  readonly onDuplicate: () => void;
  readonly onToggleMute: () => void;
  readonly onRemove: () => void;
  readonly onZoomIn: () => void;
  readonly onZoomOut: () => void;
  readonly onZoomFit: () => void;
};

const ActionBar: FC<Props> = ({
  hasSelection,
  selectionMuted,
  readOnly,
  playheadMs,
  durationMs,
  onSplit,
  onDuplicate,
  onToggleMute,
  onRemove,
  onZoomIn,
  onZoomOut,
  onZoomFit,
}) => (
  <div css={barStyles}>
    <EditorButton
      icon={<SplitIcon size={15} />}
      disabled={readOnly || !hasSelection}
      onClick={onSplit}
    >
      Split
    </EditorButton>
    <EditorButton
      icon={<DuplicateIcon size={15} />}
      disabled={readOnly || !hasSelection}
      onClick={onDuplicate}
    >
      Duplicate
    </EditorButton>
    <EditorButton
      icon={selectionMuted ? <MuteIcon size={15} /> : <SoundIcon size={15} />}
      disabled={readOnly || !hasSelection}
      onClick={onToggleMute}
    >
      {selectionMuted ? 'Unmute' : 'Mute'}
    </EditorButton>
    <EditorButton
      icon={<TrashIcon size={15} />}
      disabled={readOnly || !hasSelection}
      onClick={onRemove}
    >
      Remove
    </EditorButton>

    <span css={timeStyles}>
      {formatTimecode(playheadMs)} / {formatTimecode(durationMs)}
    </span>

    <span css={hintStyles}>
      Drag clips to reorder, drag their edges to trim. S splits, D duplicates, M
      mutes.
    </span>

    <div css={groupStyles}>
      <EditorButton onClick={onZoomFit}>Fit</EditorButton>
      <EditorButton
        aria-label="Zoom the timeline out"
        icon={<MinusIcon size={15} />}
        onClick={onZoomOut}
      />
      <EditorButton
        aria-label="Zoom the timeline in"
        icon={<PlusIcon size={15} />}
        onClick={onZoomIn}
      />
    </div>
  </div>
);

export default ActionBar;
