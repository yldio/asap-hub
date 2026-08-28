/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Banner } from '@asap-hub/demo-timeline';
import { FC, PointerEvent as ReactPointerEvent } from 'react';
import { editorTheme } from './editorTheme';
import { formatDuration } from './geometry';

const blockStyles = css({
  position: 'absolute',
  top: 4,
  bottom: 4,
  borderRadius: 6,
  border: '1px solid transparent',
  backgroundColor: editorTheme.banner,
  color: '#2a0a18',
  padding: '4px 8px',
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
});

export type BannerDragKind = 'move' | 'trimStart' | 'trimEnd';

type Props = {
  readonly banner: Banner;
  readonly left: number;
  readonly width: number;
  readonly selected: boolean;
  readonly readOnly: boolean;
  readonly onSelect: () => void;
  readonly onDragStart: (
    kind: BannerDragKind,
    event: ReactPointerEvent<HTMLElement>,
  ) => void;
};

const BannerBlock: FC<Props> = ({
  banner,
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
    aria-label={`Banner ${banner.text || 'Untitled'}, ${formatDuration(
      banner.durationMs,
    )}`}
    aria-pressed={selected}
    css={[blockStyles, selected && selectedStyles]}
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
    {banner.text || 'Banner'}
    <button
      type="button"
      aria-label={`Trim the start of banner ${banner.text || 'Untitled'}`}
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
      aria-label={`Trim the end of banner ${banner.text || 'Untitled'}`}
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

export default BannerBlock;
