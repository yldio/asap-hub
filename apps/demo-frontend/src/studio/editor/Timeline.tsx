/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ClipPlacement } from '@asap-hub/demo-timeline';
import { FC, PointerEvent as ReactPointerEvent, useRef } from 'react';
import { ProjectAsset } from '../../api/types';
import {
  charcoal,
  cerulean,
  fern,
  paper,
  pearl,
  rem,
  silver,
  steel,
  tin,
} from '../../ui/theme';
import { formatDuration, msToPx, pxToMs, tickIntervalMs } from './geometry';

const panelStyles = css({
  backgroundColor: pearl.rgb,
  borderTop: `1px solid ${silver.rgb}`,
  display: 'flex',
  flexDirection: 'column',
  minHeight: rem(180),
});

const scrollStyles = css({
  overflowX: 'auto',
  overflowY: 'hidden',
  position: 'relative',
});

const laneStyles = css({
  position: 'relative',
  minWidth: '100%',
});

const rulerStyles = css({
  position: 'relative',
  height: rem(24),
  borderBottom: `1px solid ${silver.rgb}`,
});

const tickStyles = css({
  position: 'absolute',
  top: 0,
  bottom: 0,
  borderLeft: `1px solid ${silver.rgb}`,
  paddingLeft: rem(4),
  fontSize: rem(11),
  color: steel.rgb,
  lineHeight: rem(24),
  userSelect: 'none',
});

const trackStyles = css({
  position: 'relative',
  height: rem(72),
  padding: `${rem(8)} 0`,
});

const clipStyles = css({
  position: 'absolute',
  top: rem(8),
  bottom: rem(8),
  borderRadius: rem(6),
  border: `1px solid ${cerulean.rgb}`,
  backgroundColor: tin.rgb,
  color: charcoal.rgb,
  padding: `${rem(6)} ${rem(8)}`,
  fontSize: rem(12),
  textAlign: 'left',
  overflow: 'hidden',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: rem(4),
});

const selectedClipStyles = css({
  borderColor: fern.rgb,
  borderWidth: rem(2),
  backgroundColor: paper.rgb,
});

const titleClipStyles = css({
  backgroundColor: charcoal.rgb,
  color: paper.rgb,
  borderColor: charcoal.rgb,
});

const clipLabelStyles = css({
  fontWeight: 600,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const playheadStyles = css({
  position: 'absolute',
  top: 0,
  bottom: 0,
  width: rem(2),
  backgroundColor: fern.rgb,
  pointerEvents: 'none',
});

type Props = {
  readonly placements: ClipPlacement[];
  readonly durationMs: number;
  readonly playheadMs: number;
  readonly pixelsPerSecond: number;
  readonly selectedClipId?: string;
  readonly assets: Record<string, ProjectAsset>;
  readonly onSelect: (clipId: string) => void;
  readonly onSeek: (ms: number) => void;
};

const Timeline: FC<Props> = ({
  placements,
  durationMs,
  playheadMs,
  pixelsPerSecond,
  selectedClipId,
  assets,
  onSelect,
  onSeek,
}) => {
  const laneRef = useRef<HTMLDivElement>(null);

  const seekFromPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const lane = laneRef.current;
    if (!lane) return;
    const { left } = lane.getBoundingClientRect();
    onSeek(pxToMs(event.clientX - left, pixelsPerSecond));
  };

  const scrub = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    seekFromPointer(event);
  };

  const interval = tickIntervalMs(pixelsPerSecond);
  const tickCount = Math.max(1, Math.ceil(durationMs / interval) + 1);
  const laneWidth = Math.max(msToPx(durationMs, pixelsPerSecond), 320);

  return (
    <div css={panelStyles}>
      <div css={scrollStyles}>
        <div css={laneStyles} style={{ width: laneWidth }} ref={laneRef}>
          <div
            css={rulerStyles}
            onPointerDown={scrub}
            onPointerMove={(event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                seekFromPointer(event);
              }
            }}
          >
            {Array.from({ length: tickCount }, (_, index) => (
              <span
                key={index}
                css={tickStyles}
                style={{ left: msToPx(index * interval, pixelsPerSecond) }}
              >
                {formatDuration(index * interval)}
              </span>
            ))}
          </div>

          <div css={trackStyles}>
            {placements.map((placement) => {
              const { clip } = placement;
              const asset =
                clip.kind === 'source' ? assets[clip.assetId] : undefined;
              return (
                <button
                  type="button"
                  key={clip.id}
                  css={[
                    clipStyles,
                    clip.kind === 'title' && titleClipStyles,
                    clip.id === selectedClipId && selectedClipStyles,
                  ]}
                  style={{
                    left: msToPx(placement.startMs, pixelsPerSecond),
                    width: Math.max(
                      msToPx(placement.durationMs, pixelsPerSecond),
                      12,
                    ),
                  }}
                  onClick={() => onSelect(clip.id)}
                >
                  <span css={clipLabelStyles}>
                    {clip.kind === 'title'
                      ? clip.text || 'Title card'
                      : asset?.label ?? 'Clip'}
                  </span>
                  <span>{formatDuration(placement.durationMs)}</span>
                </button>
              );
            })}
          </div>

          <div
            css={playheadStyles}
            style={{ left: msToPx(playheadMs, pixelsPerSecond) }}
          />
        </div>
      </div>
    </div>
  );
};

export default Timeline;
