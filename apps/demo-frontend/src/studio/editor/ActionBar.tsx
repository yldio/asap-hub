/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC } from 'react';
import EditorButton from './EditorButton';
import { editorTheme } from './editorTheme';
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

const groupStyles = css({ display: 'flex', alignItems: 'center', gap: 6 });

type Props = {
  readonly hasSelection: boolean;
  readonly canAddEffect: boolean;
  readonly onAddTitleCard: () => void;
  readonly onAddBanner: () => void;
  readonly onAddZoom: () => void;
  readonly onAddCursorClick: () => void;
  readonly selectionMuted: boolean;
  readonly readOnly: boolean;
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
  canAddEffect,
  onAddTitleCard,
  onAddBanner,
  onAddZoom,
  onAddCursorClick,
  selectionMuted,
  readOnly,
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
      icon={<PlusIcon size={15} />}
      disabled={readOnly}
      onClick={onAddTitleCard}
    >
      Title card
    </EditorButton>
    <EditorButton
      icon={<PlusIcon size={15} />}
      disabled={readOnly}
      onClick={onAddBanner}
    >
      Banner
    </EditorButton>
    <EditorButton
      icon={<PlusIcon size={15} />}
      disabled={readOnly || !canAddEffect}
      onClick={onAddZoom}
    >
      Zoom
    </EditorButton>
    <EditorButton
      icon={<PlusIcon size={15} />}
      disabled={readOnly || !canAddEffect}
      onClick={onAddCursorClick}
    >
      Mouse click
    </EditorButton>
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

    <span css={hintStyles}>
      Drag anything along its lane to move it, or drag either edge to change how
      long it lasts. S splits, D duplicates, M mutes.
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
