/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, PointerEvent as ReactPointerEvent } from 'react';
import { DragKind } from './dragging';
import { editorTheme } from './editorTheme';

// the shortest block still wide enough to aim a pointer at
export const minBlockPx = 24;

const blockStyles = css({
  position: 'absolute',
  top: 4,
  bottom: 4,
  borderRadius: 6,
  border: '1px solid transparent',
  padding: '4px 10px',
  overflow: 'hidden',
  cursor: 'grab',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  font: 'inherit',
  fontSize: 12,
  fontWeight: 600,
  textAlign: 'left',
  touchAction: 'none',
  userSelect: 'none',
  whiteSpace: 'nowrap',
  ':active': { cursor: 'grabbing' },
});

const selectedStyles = css({
  borderColor: editorTheme.selected,
  boxShadow: `0 0 0 1px ${editorTheme.selected}`,
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
    top: 5,
    bottom: 5,
    left: 3,
    width: 4,
    borderRadius: 2,
    backgroundColor: 'currentColor',
  },
});

const tones = {
  banner: { backgroundColor: editorTheme.banner, color: editorTheme.onBanner },
  zoom: { backgroundColor: editorTheme.zoom, color: editorTheme.onZoom },
  audio: { backgroundColor: editorTheme.audio, color: editorTheme.onAudio },
} as const;

export type LaneTone = keyof typeof tones;

type Props = {
  readonly label: string;
  readonly name: string;
  readonly tone: LaneTone;
  readonly left: number;
  readonly width: number;
  readonly selected: boolean;
  readonly readOnly: boolean;
  readonly onSelect: () => void;
  readonly onDragStart: (
    kind: DragKind,
    event: ReactPointerEvent<HTMLElement>,
  ) => void;
};

// Banners, zooms and voice over are the same thing on the timeline: a labelled
// span that can be dragged along its lane and resized from either edge.
const LaneBlock: FC<Props> = ({
  label,
  name,
  tone,
  left,
  width,
  selected,
  readOnly,
  onSelect,
  onDragStart,
}) => (
  <div
    role="button"
    tabIndex={0}
    aria-label={name}
    aria-pressed={selected}
    css={[blockStyles, tones[tone], selected && selectedStyles]}
    style={{ left, width: Math.max(width, minBlockPx) }}
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
    {label}
    <button
      type="button"
      aria-label={`Drag to change where ${name} starts`}
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
      aria-label={`Drag to change where ${name} ends`}
      css={handleStyles}
      style={{ right: 0 }}
      disabled={readOnly}
      onPointerDown={(event) => {
        event.stopPropagation();
        onSelect();
        onDragStart('trimEnd', event);
      }}
    />
  </div>
);

export default LaneBlock;
