/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Clip, ClipPlacement } from '@asap-hub/demo-timeline';
import { FC } from 'react';
import { ProjectAsset } from '../../api/types';
import { Button, Caption } from '../../ui/components';
import { rem, silver, steel } from '../../ui/theme';
import { formatTimecode } from './geometry';

const panelStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(12),
  padding: rem(16),
  borderLeft: `1px solid ${silver.rgb}`,
  minWidth: rem(240),
  maxWidth: rem(300),
  overflowY: 'auto',
});

const rowStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  gap: rem(8),
  fontSize: rem(13),
});

const mutedStyles = css({ color: steel.rgb, fontSize: rem(13) });

const fieldStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(4),
  fontSize: rem(13),
});

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
  clip.kind === 'title' ? clip.text || 'Title card' : (asset?.label ?? 'Clip');

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
      <aside css={panelStyles}>
        <Caption>Clip</Caption>
        <p css={mutedStyles}>Select a clip on the timeline to edit it.</p>
      </aside>
    );
  }

  const { clip } = placement;
  const source = clip.kind === 'source' ? clip : undefined;

  return (
    <aside css={panelStyles}>
      <Caption>Clip</Caption>
      <strong>{clipName(clip, asset)}</strong>

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
            Volume
            <input
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

      <div css={{ display: 'flex', gap: rem(8) }}>
        <Button
          small
          disabled={readOnly || index === 0}
          onClick={() => onMove(index - 1)}
        >
          Move earlier
        </Button>
        <Button
          small
          disabled={readOnly || index >= clipCount - 1}
          onClick={() => onMove(index + 1)}
        >
          Move later
        </Button>
      </div>

      <Button small danger disabled={readOnly} onClick={onRemove}>
        Remove clip
      </Button>
    </aside>
  );
};

export default ClipInspector;
