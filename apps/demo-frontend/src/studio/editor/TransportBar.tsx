/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC } from 'react';
import EditorButton from './EditorButton';
import { editorTheme } from './editorTheme';
import {
  PauseIcon,
  PlayIcon,
  RedoIcon,
  SkipEndIcon,
  SkipStartIcon,
  UndoIcon,
} from './icons';

const barStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 14px',
  backgroundColor: editorTheme.panel,
  borderBottom: `1px solid ${editorTheme.line}`,
  color: editorTheme.text,
  flexWrap: 'wrap',
});

const centreStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  margin: '0 auto',
});

const chipStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  height: 32,
  padding: '0 10px',
  borderRadius: 6,
  border: `1px solid ${editorTheme.line}`,
  color: editorTheme.muted,
  fontSize: 13,
  whiteSpace: 'nowrap',
});

const selectStyles = css({
  height: 24,
  borderRadius: 4,
  border: `1px solid ${editorTheme.line}`,
  backgroundColor: editorTheme.raised,
  color: editorTheme.text,
  font: 'inherit',
  fontSize: 13,
});

const saveStyles = css({ fontSize: 12, color: editorTheme.muted });

type Props = {
  readonly playing: boolean;
  readonly canPlay: boolean;
  readonly canUndo: boolean;
  readonly canRedo: boolean;
  readonly saveLabel: string;
  readonly canvasHeight: number;
  readonly canvasFps: 24 | 30 | 60;
  readonly onFpsChange: (fps: 24 | 30 | 60) => void;
  readonly onToggle: () => void;
  readonly onSkipStart: () => void;
  readonly onSkipEnd: () => void;
  readonly onUndo: () => void;
  readonly onRedo: () => void;
};

const TransportBar: FC<Props> = ({
  playing,
  canPlay,
  canUndo,
  canRedo,
  saveLabel,
  canvasHeight,
  canvasFps,
  onFpsChange,
  onToggle,
  onSkipStart,
  onSkipEnd,
  onUndo,
  onRedo,
}) => (
  <div css={barStyles}>
    <span css={chipStyles}>
      {`${canvasHeight}p`}
      <label>
        <span css={{ marginRight: 4 }}>at</span>
        <select
          css={selectStyles}
          aria-label="Frames per second"
          value={canvasFps}
          onChange={(event) =>
            onFpsChange(Number(event.target.value) as 24 | 30 | 60)
          }
        >
          <option value={30}>30fps</option>
          <option value={60}>60fps</option>
        </select>
      </label>
    </span>
    <EditorButton
      aria-label="Undo"
      icon={<UndoIcon size={15} />}
      disabled={!canUndo}
      onClick={onUndo}
    />
    <EditorButton
      aria-label="Redo"
      icon={<RedoIcon size={15} />}
      disabled={!canRedo}
      onClick={onRedo}
    />

    <div css={centreStyles}>
      <EditorButton
        aria-label="Jump to the start"
        icon={<SkipStartIcon size={16} />}
        onClick={onSkipStart}
      />
      <EditorButton
        aria-label={playing ? 'Pause' : 'Play'}
        icon={playing ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
        primary
        disabled={!canPlay}
        onClick={onToggle}
      />
      <EditorButton
        aria-label="Jump to the end"
        icon={<SkipEndIcon size={16} />}
        onClick={onSkipEnd}
      />
    </div>

    <span css={saveStyles}>{saveLabel}</span>
  </div>
);

export default TransportBar;
