/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Clip, ClipPlacement } from '@asap-hub/demo-timeline';
import { FC } from 'react';
import { ProjectAsset } from '../../api/types';
import EditorButton from './EditorButton';
import { editorTheme } from './editorTheme';
import { formatTimecode } from './geometry';
import { TrashIcon } from './icons';

const panelStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  padding: 16,
  borderLeft: `1px solid ${editorTheme.line}`,
  backgroundColor: editorTheme.panel,
  width: 260,
  flexShrink: 0,
  overflowY: 'auto',
  '@media (max-width: 1100px)': { width: 'auto', borderLeft: 0 },
});

const headingStyles = css({
  margin: 0,
  fontSize: 12,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: editorTheme.muted,
});

const nameStyles = css({ fontSize: 14, fontWeight: 600 });

const rowStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  gap: 8,
  fontSize: 13,
  fontVariantNumeric: 'tabular-nums',
});

const mutedStyles = css({ color: editorTheme.muted, fontSize: 13 });

const fieldStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  fontSize: 13,
  color: editorTheme.muted,
});

const inputStyles = css({
  height: 30,
  borderRadius: 6,
  border: `1px solid ${editorTheme.line}`,
  backgroundColor: editorTheme.raised,
  color: editorTheme.text,
  padding: '0 8px',
  font: 'inherit',
  fontSize: 13,
});

const rangeStyles = css({ accentColor: editorTheme.playhead });

const rowButtonsStyles = css({ display: 'flex', gap: 6 });

type Props = {
  readonly placement?: ClipPlacement;
  readonly asset?: ProjectAsset;
  readonly readOnly: boolean;
  readonly index: number;
  readonly clipCount: number;
  readonly onTrim: (change: { inMs?: number; outMs?: number }) => void;
  readonly onVolume: (volume: number) => void;
  readonly onMove: (toIndex: number) => void;
  readonly onRemove: () => void;
};

const clipName = (clip: Clip, asset?: ProjectAsset): string =>
  clip.kind === 'title' ? clip.text || 'Title card' : asset?.label ?? 'Clip';

const ClipInspector: FC<Props> = ({
  placement,
  asset,
  readOnly,
  index,
  clipCount,
  onTrim,
  onVolume,
  onMove,
  onRemove,
}) => {
  if (!placement) {
    return (
      <aside css={panelStyles} aria-label="Clip">
        <h2 css={headingStyles}>Clip</h2>
        <p css={mutedStyles}>Select a clip on the timeline to edit it.</p>
      </aside>
    );
  }

  const { clip } = placement;
  const source = clip.kind === 'source' ? clip : undefined;

  return (
    <aside css={panelStyles} aria-label="Clip">
      <h2 css={headingStyles}>Clip</h2>
      <span css={nameStyles}>{clipName(clip, asset)}</span>

      <div css={rowStyles}>
        <span css={mutedStyles}>Starts</span>
        <span>{formatTimecode(placement.startMs)}</span>
      </div>
      <div css={rowStyles}>
        <span css={mutedStyles}>Length</span>
        <span>{formatTimecode(placement.durationMs)}</span>
      </div>

      {source ? (
        <>
          <label css={fieldStyles}>
            Trim start
            <input
              css={inputStyles}
              type="number"
              min={0}
              step={100}
              disabled={readOnly}
              value={source.inMs}
              onChange={(event) => onTrim({ inMs: Number(event.target.value) })}
            />
          </label>
          <label css={fieldStyles}>
            Trim end
            <input
              css={inputStyles}
              type="number"
              min={0}
              step={100}
              disabled={readOnly}
              value={source.outMs}
              onChange={(event) =>
                onTrim({ outMs: Number(event.target.value) })
              }
            />
          </label>
          <label css={fieldStyles}>
            {`Volume ${Math.round(source.volume * 100)}%`}
            <input
              css={rangeStyles}
              type="range"
              min={0}
              max={2}
              step={0.05}
              disabled={readOnly}
              value={source.volume}
              onChange={(event) => onVolume(Number(event.target.value))}
            />
          </label>
        </>
      ) : null}

      <div css={rowButtonsStyles}>
        <EditorButton
          disabled={readOnly || index === 0}
          onClick={() => onMove(index - 1)}
        >
          Move earlier
        </EditorButton>
        <EditorButton
          disabled={readOnly || index >= clipCount - 1}
          onClick={() => onMove(index + 1)}
        >
          Move later
        </EditorButton>
      </div>

      <EditorButton
        danger
        icon={<TrashIcon size={15} />}
        disabled={readOnly}
        onClick={onRemove}
      >
        Remove clip
      </EditorButton>
    </aside>
  );
};

export default ClipInspector;
